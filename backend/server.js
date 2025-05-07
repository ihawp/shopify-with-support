// Packages
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Yet to implement
const winston = require('winston');
const nodemailer = require('nodemailer');

// Middleware
const createCustomer = require('./middleware/createCustomer.js');
const checkAdminToken = require('./middleware/checkAdminToken.js');
const checkValidGuestToken = require('./middleware/checkValidGuestToken.js');
const issueGuestToken = require('./middleware/issueGuestToken.js');
const setHeader = require('./middleware/setHeader.js');
const corsOptions = require('./middleware/corsOptions.js');
const adminLogin = require('./middleware/adminLogin.js');
const verifyJWT = require('./middleware/verifyJWT.js');

// Interface
const UsersInterface = require('./interface/UsersInterface.js');
const AdminInterface = require('./interface/AdminInterface.js');
const SocketInterface = require('./interface/SocketInterface.js');

const UserDirector = new UsersInterface();
const AdminDirector = new AdminInterface();

const app = express();
const server = http.createServer(app);

new SocketInterface(server, UserDirector, AdminDirector);

app.use(cors(corsOptions));
app.use(helmet());
app.use(setHeader);
app.use(express.json());
app.use(cookieParser());

app.post('/create-customer', createCustomer);

app.get('/getUsers', verifyJWT, (req, res) => {
  let usersWithRooms = UserDirector.getAllUsers();
  res.json(usersWithRooms); 
});

app.get('/getUsersCount', (req, res) => {
  let usersWithRooms = UserDirector.getAllUsers().length;
  res.json({ count: usersWithRooms }); 
});

app.post('/login', adminLogin);

app.get('/user-login', checkAdminToken, checkValidGuestToken, issueGuestToken);

server.listen(3000);