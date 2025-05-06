const jwt = require('jsonwebtoken');

const issueGuestToken = (req, res) => {
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

module.exports = issueGuestToken