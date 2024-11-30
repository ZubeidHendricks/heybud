import { Shopify } from '@shopify/shopify-api';
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Shopify App Configuration
const shopify = new Shopify({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecret: process.env.SHOPIFY_API_SECRET,
  scopes: ['read_products', 'write_products'],
  hostName: process.env.HOST,
});

// WebSocket handling for real-time communication
io.on('connection', (socket) => {
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
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});