/* =========================================================================
   BLDC MOTOR THRUST TEST STAND - NODE.JS BACKEND SERVER (RENDER / LOCAL)
   Serves static telemetry web app, REST endpoints, and WebSocket broadcasting.
   ========================================================================= */

const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { WebSocketServer, WebSocket } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

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

// Broadcast helper to all connected WebSocket clients
function broadcast(data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// WebSocket Connection Handler
wss.on('connection', (ws) => {
  console.log(`[WS] Client connected. Total active clients: ${wss.clients.size}`);
  
  // Send current telemetry state on connect
  ws.send(JSON.stringify({ type: 'INIT', data: latestTelemetry }));

  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message);
      if (parsed.type === 'TELEMETRY_UPDATE') {
        updateTelemetry(parsed.data);
      }
    } catch (err) {
      console.error('[WS] Error processing message:', err.message);
    }
  });

  ws.on('close', () => {
    console.log(`[WS] Client disconnected. Total active: ${wss.clients.size}`);
  });
});

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

  broadcast({ type: 'TELEMETRY', data: latestTelemetry });
}

// REST Endpoints
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    system: 'BLDC Motor Thrust Test Stand Backend',
    connectedClients: wss.clients.size,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/telemetry/latest', (req, res) => {
  res.json(latestTelemetry);
});

app.get('/api/telemetry/history', (req, res) => {
  res.json(telemetryHistory);
});

// Endpoint for receiving telemetry from external bridges or hardware scripts
app.post('/api/telemetry', (req, res) => {
  const { raw, thrust, current, rpm, voltage = 11.1 } = req.body;
  if (thrust === undefined || current === undefined || rpm === undefined) {
    return res.status(400).json({ error: 'Missing telemetry fields: thrust, current, rpm' });
  }

  const pWatts = current * voltage;
  const eff = pWatts > 0.5 ? thrust / pWatts : 0.0;

  updateTelemetry({
    raw: raw || 86511,
    thrust: parseFloat(thrust),
    current: parseFloat(current),
    rpm: parseInt(rpm, 10),
    power: parseFloat(pWatts.toFixed(1)),
    efficiency: parseFloat(eff.toFixed(1))
  });

  res.json({ success: true, telemetry: latestTelemetry });
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 BLDC Thrust Stand Server running on port ${PORT}`);
  console.log(`📡 Access web portal at: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket Server active on same port`);
  console.log(`=======================================================`);
});
