// Local preview with zero installs. Run: node dev-server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4281;
const SITE = path.join(__dirname, 'site');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const file = path.join(SITE, url.pathname === '/' ? 'index.html' : url.pathname);
    if (!file.startsWith(SITE) || !fs.existsSync(file)) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`Adaptive portfolio running: http://localhost:${PORT}`));
