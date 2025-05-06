// Packages
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Yet to implement
const winston = require('winston');
const nodemailer = require('nodemailer');
const validator = require('validator');

// Middleware
const createCustomer = require('./middleware/createCustomer.js');
const checkAdminToken = require('./middleware/checkAdminToken.js');
const checkValidGuestToken = require('./middleware/checkValidGuestToken.js');
const issueGuestToken = require('./middleware/issueGuestToken.js');
const setHeader = require('./middleware/setHeader.js');
const corsOptions = require('./middleware/corsOptions');
const adminLogin = require('./middleware/adminLogin.js');
const verifyJWT = require('./middleware/verifyJWT.js');

// Interface
const UsersInterface = require('./interface/UsersInterface.js');
const SocketInterface = require('./interface/SocketInterface.js');

const UserDirector = new UsersInterface();

const app = express();
const server = http.createServer(app);

new SocketInterface(server, UserDirector);

app.use(cors(corsOptions));
app.use(helmet());
app.use(setHeader);
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/user-login', checkAdminToken, checkValidGuestToken, issueGuestToken);

app.post('/login', adminLogin);

// Admin protected routes
app.post('/create-customer', createCustomer);

app.get('/getUsers', verifyJWT, (req, res) => {
  let usersWithRooms = UserDirector.getAllUsers();
  res.json(usersWithRooms); 
});

// Open routes
app.get('/getUsersCount', (req, res) => {
  let usersWithRooms = UserDirector.getAllUsers().length || 1;
  res.json({ count: usersWithRooms }); 
});

server.listen(3000);