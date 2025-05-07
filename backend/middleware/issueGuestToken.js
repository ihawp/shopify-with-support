const jwt = require('jsonwebtoken');
const generateRandomName = require('./generateRandomName.js');

const issueGuestToken = (req, res) => {

  const randomName = generateRandomName();

  const newToken = jwt.sign(
    { role: 'guest', name: randomName, room: `${Date.now()}_guest`},
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

module.exports = issueGuestToken