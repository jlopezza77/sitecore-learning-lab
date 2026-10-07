// Azure Functions (v4 Node model) entry points. They only adapt HTTP to the shared logic.
const { app } = require('@azure/functions');
const logic = require('../lib/logic');

function route(name, method, handler) {
  app.http(name, {
    methods: [method],
    authLevel: 'anonymous',
    route: name,
    handler: async (request) => {
      const query = Object.fromEntries(request.query.entries());
      const body = method === 'POST' ? await request.json().catch(() => ({})) : {};
      const result = await handler({ ...query, ...body });
      return { status: result.status, jsonBody: result.body };
    },
  });
}

route('track', 'POST', logic.track);
route('decide', 'GET', logic.decide);
route('journeys/abandoned', 'POST', logic.runAbandonmentJourney);
route('stats', 'GET', logic.stats);
route('simulate', 'POST', logic.simulate);
route('reset', 'POST', logic.reset);
