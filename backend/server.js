const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});


app.get('/', (req, res) => {
  res.send('Socket.IO server is running!');
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('message', (msg) => {
    console.log('Received:', msg);
    socket.emit('message', `Server received: ${msg}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
