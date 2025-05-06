const jwt = require('jsonwebtoken');

const checkAdminToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return next();

  // should check for token expired, or add another middleware that will check token expired...
  // all these jwt.verifies are getting expensive.

  try {
    const decoded = jwt.decode(token);
    if (decoded?.role === 'admin') {
      jwt.verify(token, 'admin-secret-token', (err, decoded) => {

        console.log(err);

        if (decoded.role === 'admin') return res.json({ message: 'is-admin' });
      });
    }
  } catch (err) {
    // Fall through
  }

  next();
}

module.exports = checkAdminToken