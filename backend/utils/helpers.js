const fs = require('fs');
const path = require('path');

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS'
  });
  res.end(body);
}

function sendHtml(res, filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(content);
}

function sendStaticFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = {
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  }[ext] || 'application/octet-stream';

  const content = fs.readFileSync(filePath);
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(content);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let buffer = '';
    req.on('data', chunk => { buffer += chunk; });
    req.on('end', () => {
      if (!buffer) return resolve({});
      try {
        resolve(JSON.parse(buffer));
      } catch (error) {
        reject(new Error('Request body must be valid JSON.'));
      }
    });
    req.on('error', reject);
  });
}

function createRoute(method, pattern, handler, options = {}) {
  const paramNames = [];
  const expression = new RegExp('^' + pattern.replace(/:[^/]+/g, segment => {
    paramNames.push(segment.slice(1));
    return '([^/]+)';
  }) + '$');

  return { method, expression, paramNames, handler, auth: Boolean(options.auth) };
}

function matchRoute(routes, method, pathname) {
  for (const route of routes) {
    if (route.method !== method) continue;
    const matched = pathname.match(route.expression);
    if (!matched) continue;
    const params = {};
    route.paramNames.forEach((name, index) => {
      params[name] = decodeURIComponent(matched[index + 1]);
    });
    return { route, params };
  }
  return null;
}

module.exports = { sendJson, sendHtml, sendStaticFile, parseJsonBody, createRoute, matchRoute };
