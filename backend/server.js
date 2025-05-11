// Packages
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const compression = require('compression');

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

app.use(compression());
app.use(cors(corsOptions));
app.use(setHeader);
app.use(express.json());
app.use(cookieParser());


// Do more helmet setup
app.use(helmet.contentSecurityPolicy({ 
  directives: { 
    connectSrc: ["'self'", 'https://x00qwc-pe.myshopify.com'], 
    imgSrc: ["'self'", 'https://cdn.shopify.com'] 
  }
}));


app.use(express.static(path.join(__dirname, '../frontend/dist')));

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

app.all('/*john', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

server.listen(3000, () => {
  console.log(new Date());
  console.log(new Date().toString());
  console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
});