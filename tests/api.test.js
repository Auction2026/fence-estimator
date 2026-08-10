const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const { createRequestHandler } = require('../backend/server');

async function startTestServer() {
  const server = http.createServer(createRequestHandler());
  await new Promise(resolve => server.listen(0, resolve));
  const { port } = server.address();
  return { server, baseUrl: `http://127.0.0.1:${port}` };
}

test('auth, project creation, and tab persistence work together', async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    const login = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@fencedepot.local', password: 'DemoPass123!' })
    });
    assert.equal(login.status, 200);
    const loginBody = await login.json();
    assert.ok(loginBody.token);

    const authHeader = { 'Authorization': 'Bearer ' + loginBody.token };

    const project = await fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify({
        name: 'Test Project',
        customerName: 'Tester',
        address: '1 Main Street',
        city: 'Toronto',
        province: 'ON',
        postalCode: 'A1A1A1',
        fenceType: 'chain-link',
        status: 'draft',
        linearFeet: 80,
        notes: 'Created by test'
      })
    });
    assert.equal(project.status, 201);
    const projectBody = await project.json();

    const saveTab = await fetch(`${baseUrl}/api/projects/${projectBody.data.id}/tabs/specs`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify({ fenceType: 'chain-link', linearFeet: 80, heightFeet: 6 })
    });
    assert.equal(saveTab.status, 200);

    const loadProject = await fetch(`${baseUrl}/api/projects/${projectBody.data.id}`, {
      headers: authHeader
    });
    assert.equal(loadProject.status, 200);
    const loadBody = await loadProject.json();
    assert.equal(loadBody.tabs.length, 1);
    assert.equal(loadBody.tabs[0].tabKey, 'specs');
  } finally {
    server.close();
  }
});
