const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const mysql2 = require('mysql2');
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

const helmet = require('helmet');
const winston = require('winston');

const nodemailer = require('nodemailer');

const app = express();

app.use(cors(corsOptions));

app.use(helmet());

const server = http.createServer(app);

// Admin variable for storing if admin is online for support?

// If they are not online all received messages are uploaded to db for later reading

// Those users sessions will not be stored

// PLAN:
// Manages connected users allowing for admin view and responding
// Will also allow for live user view 
const UsersInterface = require('./interface/UsersInterface.js');
const UserDirector = new UsersInterface();

// PLAN:
// Manages sockets
const SocketInterface = require('./interface/SocketInterface.js');
const SocketDirector = new SocketInterface(server, UserDirector);

app.use(express.json());

const adminSecret = 'admin-secret-key';
const adminCredentials = {
  username: 'root',
  password: 'root'
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === adminCredentials.username && password === adminCredentials.password) {
    const token = jwt.sign({ role: 'admin' }, adminSecret, { expiresIn: '1h' });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

const verifyJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
      return res.status(403).json({ message: 'Token required' });
  }

  jwt.verify(token, adminSecret, (err, decoded) => {
      if (err) {
          console.log('JWT verification failed:', err);
          return res.status(401).json({ message: 'Unauthorized - Invalid or expired token' });
      }

      req.user = decoded;
      next();
  });
};

app.get('/getUsers', verifyJWT, (req, res) => {
  if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - Admins only' });
  }

  let usersWithRooms = UserDirector.getAllUsers().filter(([socketId, user]) => user.room);

  res.json(usersWithRooms); 
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
