// Local server: serves the site and the API with zero installs. Run: node dev-server.js
// In Azure, Static Web Apps + Azure Functions replace this file.
const http = require('http');
const fs = require('fs');
const path = require('path');
const logic = require('./api/src/lib/logic');

const PORT = process.env.PORT || 4280;
const SITE = path.join(__dirname, 'site');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
const ROUTES = {
  'POST /api/track': logic.track,
  'GET /api/decide': logic.decide,
  'POST /api/journeys/abandoned': logic.runAbandonmentJourney,
  'GET /api/stats': logic.stats,
  'POST /api/simulate': logic.simulate,
  'POST /api/reset': logic.reset,
};

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const handler = ROUTES[`${req.method} ${url.pathname}`];
    if (handler) {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const body = raw ? JSON.parse(raw) : {};
      const result = await handler({ ...Object.fromEntries(url.searchParams), ...body });
      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result.body));
    }
    const file = path.join(SITE, url.pathname === '/' ? 'index.html' : url.pathname);
    if (!file.startsWith(SITE) || !fs.existsSync(file)) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`Banco Pacífico lab running: http://localhost:${PORT}  (dashboard: /dashboard.html)`));
