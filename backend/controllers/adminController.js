const { sendJson } = require('../utils/helpers');

async function dashboard(req, res, context) {
  return sendJson(res, 200, { data: context.db.summary() });
}

async function catalog(req, res, context) {
  return sendJson(res, 200, { data: context.db.listCatalog() });
}

module.exports = { dashboard, catalog };
