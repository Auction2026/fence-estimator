const http = require('http');
const req = http.request('http://localhost:5000/api/health', (res) => {
    console.log('Health status:', res.statusCode);
    process.exit(0);
});
req.on('error', (e) => {
    console.error('Request error:', e.message);
    process.exit(1);
});
req.end();
