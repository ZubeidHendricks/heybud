const express = require('express');
const { Shopify } = require('@shopify/shopify-api');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Shopify App Configuration
const shopify = new Shopify({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecret: process.env.SHOPIFY_API_SECRET,
  scopes: ['read_products', 'write_products'],
  hostName: process.env.HOST.replace(/https?:\/\//, ''),
});

// Middleware
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.send('HeyBud server is running!');
});

// WebSocket handling for real-time communication
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('join-shopping-session', (sessionId) => {
    socket.join(sessionId);
    io.to(sessionId).emit('participant-joined', socket.id);
  });

  socket.on('screen-share-update', (data) => {
    io.to(data.sessionId).emit('screen-updated', data);
  });

  socket.on('voice-state-change', (data) => {
    io.to(data.sessionId).emit('participant-voice-update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});