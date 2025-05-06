const jwt = require('jsonwebtoken');

const checkValidGuestToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return next();

  jwt.verify(token, 'user-secret-token', (err) => {
    if (!err) {
      return res.json({ message: 'valid guest' });
    }
    next();
  });
}

module.exports = checkValidGuestToken