const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const mysql2 = require('mysql2');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const winston = require('winston');
const nodemailer = require('nodemailer');

const { SHOPIFY_ADMIN_API_URL, ADMIN_API_TOKEN } = require('./keys.js');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true
};
app.use(cors(corsOptions));

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", 
    "default-src 'self'; " +
    "script-src 'self'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "object-src 'none'; " +
    "connect-src 'self'; " +
    "img-src 'self' data:;"
  );
  next();
})

const server = http.createServer(app);

const UsersInterface = require('./interface/UsersInterface.js');
const UserDirector = new UsersInterface();

const SocketInterface = require('./interface/SocketInterface.js');
const SocketDirector = new SocketInterface(server, UserDirector);

app.use(express.json());
app.use(cookieParser());

function checkAdminToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) return next();

  try {
    const decoded = jwt.decode(token);
    if (decoded?.role === 'admin') {
      return res.json({ message: 'is-admin' });
    }
  } catch (err) {
    // Fall through
  }

  next();
}

function checkValidGuestToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) return next();

  jwt.verify(token, 'user-secret-token', (err) => {
    if (!err) {
      return res.json({ message: 'valid guest' });
    }
    next();
  });
}

function issueGuestToken(req, res) {
  const newToken = jwt.sign(
    { room: `${Date.now()}_guest`, role: 'guest' },
    'user-secret-token',
    { expiresIn: '1h' }
  );

  res.cookie('token', newToken, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 1000,
    sameSite: 'strict',
  });

  return res.json({ message: 'new guest issued' });
}

app.get('/user-login', checkAdminToken, checkValidGuestToken, issueGuestToken);

const adminCredentials = {
  username: 'root',
  password: 'root'
};

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

const verifyJWT = (req, res, next) => {

  let token = req.cookies.token;

  if (!token) {
      return res.status(403).json({ message: 'Token required' });
  }

  jwt.verify(token, 'admin-secret-token', (err, decoded) => {
      if (err) {
          return res.status(401).json({ message: err.message });
      }

      next();
  });
};

function isValidEmailFormat(email) {
  // Very simple and safe regex for email format validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.post('/create-customer', async (req, res) => {
  const { email } = req.body;

  let isValidEmail = isValidEmailFormat(email);

  if (!isValidEmail) return res.status(400).json({ userErrors: 'Not An Email.' });

  // Use (dns) to verify if email is sendable to.
  // dns has plenty of deprecated tech.
  // need alternate plan.

  const mutation = `
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        createdAt
        emailMarketingConsent {
          marketingState
          marketingOptInLevel
          consentUpdatedAt
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const variables = {
  input: {
    email: email,
    emailMarketingConsent: {
      marketingState: "SUBSCRIBED",
      marketingOptInLevel: "SINGLE_OPT_IN",
      consentUpdatedAt: new Date().toISOString(),
    },
  },
};


try {
    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': ADMIN_API_TOKEN,
          },
          body: JSON.stringify({ query: mutation, variables }),
    });

    const data = await response.json();

    const { customerCreate } = data.data;

    console.log(customerCreate);

    if (customerCreate?.userErrors.length > 0) {
      return res.status(400).json({ userErrors: customerCreate.userErrors });
    }

    return res.status(200).json({ success: true, customer: customerCreate.customer });
  } catch (err) {
    console.error('Admin API request failed:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


/* ADMIN PROTECTED */
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