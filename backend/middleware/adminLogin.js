const jwt = require('jsonwebtoken');
const adminCredentials = require('./adminCredentials.js');
const generateRandomName = require('./generateRandomName.js');

const adminLogin = (req, res) => {
    const { username, password } = req.body;
  
    if (username === adminCredentials.username && password === adminCredentials.password) {

      // could create actual accounts

      // for users as well as admins
      let randomName = generateRandomName();
  
      const token = jwt.sign({ role: 'admin', name: 'ADMIN-' + randomName, room: 'admin' }, 'admin-secret-token', { expiresIn: '1h' });
  
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
}

module.exports = adminLogin