const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const createCustomer = require('./middleware/createCustomer.js');
const checkAdminToken = require('./middleware/checkAdminToken.js');
const checkValidGuestToken = require('./middleware/checkValidGuestToken.js');
const issueGuestToken = require('./middleware/issueGuestToken.js');
const setHeader = require('./middleware/setHeader.js');
const corsOptions = require('./middleware/corsOptions');
const adminCredentials = require('./middleware/adminCredentials.js');
const verifyJWT = require('./middleware/verifyJWT.js');

// Yet to implement
const winston = require('winston');
const nodemailer = require('nodemailer');
const mysql2 = require('mysql2');

const app = express();

const server = http.createServer(app);

const UsersInterface = require('./interface/UsersInterface.js');
const UserDirector = new UsersInterface();

const SocketInterface = require('./interface/SocketInterface.js');
const SocketDirector = new SocketInterface(server, UserDirector);

app.use(cors(corsOptions));
app.use(helmet());
app.use(setHeader);
app.use(express.json());
app.use(cookieParser());

app.get('/user-login', checkAdminToken, checkValidGuestToken, issueGuestToken);

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === adminCredentials.username && password === adminCredentials.password) {

    const token = jwt.sign({ room: 'admin', role: 'admin' }, 'admin-secret-token', { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 1000,
      sameSite: 'strict',
    });
    // secure: process.env.NODE_ENV === 'production',

    return res.json({ message: 'admin auth' });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

/* ADMIN PROTECTED */
app.post('/create-customer', createCustomer);

app.get('/getUsers', verifyJWT, (req, res) => {
  let usersWithRooms = UserDirector.getAllUsers();
  res.json(usersWithRooms); 
});

/* OPEN (rate limiting required) */
app.get('/getUsersCount', (req, res) => {
  let usersWithRooms = UserDirector.getAllUsers().length || 1;
  res.json({ count: usersWithRooms }); 
});

const PORT = 3000;
server.listen(PORT);