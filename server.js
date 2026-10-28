/* =========================================================================
   BLDC MOTOR THRUST TEST STAND - ZERO-DEPENDENCY NODE.JS SERVER
   (Runs immediately with "node server.js" - NO npm install required!)
   Serves static frontend, REST API, and Server-Sent Events (SSE) telemetry.
   ========================================================================= */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ino': 'text/plain; charset=utf-8'
};

// In-memory telemetry cache
let latestTelemetry = {
  raw: 86511,
  thrust: 0.0,
  current: 0.0,
  rpm: 0,
  power: 0.0,
  efficiency: 0.0,
  timestamp: new Date().toISOString()
};

let telemetryHistory = [];
const MAX_HISTORY = 300;
const sseClients = new Set();

function broadcastSSE(data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (err) {
      sseClients.delete(client);
    }
  }
}

function updateTelemetry(data) {
  latestTelemetry = {
    ...latestTelemetry,
    ...data,
    timestamp: new Date().toISOString()
  };

  telemetryHistory.unshift(latestTelemetry);
  if (telemetryHistory.length > MAX_HISTORY) {
    telemetryHistory.pop();
  }

  broadcastSSE(latestTelemetry);
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- REST & SSE API ROUTES ---
  if (pathname === '/api/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      system: 'BLDC Motor Thrust Test Stand Backend',
      clients: sseClients.size,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  if (pathname === '/api/telemetry/latest' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(latestTelemetry));
    return;
  }

  if (pathname === '/api/telemetry/history' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(telemetryHistory));
    return;
  }

  // Server-Sent Events (SSE) Stream for real-time telemetry
  if (pathname === '/api/telemetry/stream' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write(`data: ${JSON.stringify(latestTelemetry)}\n\n`);
    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // POST telemetry from external scripts or hardware bridge
  if (pathname === '/api/telemetry' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { raw, thrust, current, rpm, voltage = 11.1 } = payload;
        const pWatts = (current || 0) * voltage;
        const eff = pWatts > 0.5 ? (thrust || 0) / pWatts : 0.0;

        updateTelemetry({
          raw: raw || 86511,
          thrust: parseFloat(thrust || 0),
          current: parseFloat(current || 0),
          rpm: parseInt(rpm || 0, 10),
          power: parseFloat(pWatts.toFixed(1)),
          efficiency: parseFloat(eff.toFixed(1))
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, telemetry: latestTelemetry }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // --- STATIC FILE SERVING ---
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(__dirname, filePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA
      filePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 BLDC Thrust Stand Server running on port ${PORT}`);
  console.log(`📡 Access web portal at: http://localhost:${PORT}`);
  console.log(`⚡ Real-time SSE Stream at: http://localhost:${PORT}/api/telemetry/stream`);
  console.log(`=======================================================`);
});
