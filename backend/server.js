const http = require('http');
const fs = require('fs');
const path = require('path');
const { createDatabase } = require('./config/database');
const { parseJsonBody, sendJson, sendHtml, sendStaticFile, matchRoute } = require('./utils/helpers');
const { requireAuth } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const estimateRoutes = require('./routes/estimates');
const contractRoutes = require('./routes/contracts');
const adminRoutes = require('./routes/admin');

const routes = [
  ...authRoutes,
  ...projectRoutes,
  ...estimateRoutes,
  ...contractRoutes,
  ...adminRoutes
];

function loadEnv() {
  return {
    PORT: Number(process.env.PORT || 3000),
    APP_SECRET: process.env.APP_SECRET || 'change-me-before-production'
  };
}

function createRequestHandler({ db = createDatabase(), env = loadEnv() } = {}) {
  const frontendRoot = path.resolve(__dirname, '..', 'frontend');

  return async function requestHandler(req, res) {
    try {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const pathname = url.pathname;

      if (req.method === 'OPTIONS') {
        res.writeHead(204, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS'
        });
        return res.end();
      }

      if (pathname.startsWith('/api/')) {
        const matched = matchRoute(routes, req.method, pathname);
        if (!matched) return sendJson(res, 404, { error: 'API route not found.' });

        const context = {
          db,
          env,
          params: matched.params,
          body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? await parseJsonBody(req) : {},
          query: Object.fromEntries(url.searchParams.entries())
        };

        if (matched.route.auth) {
          const user = requireAuth(req, res, context);
          if (!user) return;
          context.user = user;
        }

        return matched.route.handler(req, res, context);
      }

      const requestedFile = pathname === '/'
        ? path.join(frontendRoot, 'index.html')
        : path.join(frontendRoot, pathname.replace(/^\//, ''));

      if (requestedFile.startsWith(frontendRoot) && fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
        if (requestedFile.endsWith('.html')) return sendHtml(res, requestedFile);
        return sendStaticFile(res, requestedFile);
      }

      return sendJson(res, 404, { error: 'File not found.' });
    } catch (error) {
      return sendJson(res, 500, { error: 'Internal server error.', detail: error.message });
    }
  };
}

function startServer() {
  const env = loadEnv();
  const db = createDatabase();
  const server = http.createServer(createRequestHandler({ db, env }));
  server.listen(env.PORT, () => {
    console.log(`Fence estimator server listening on http://localhost:${env.PORT}`);
  });
  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { createRequestHandler, startServer, loadEnv };
