const jwt = require('jsonwebtoken');

const checkAdminToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return next();

  console.log(token);

  jwt.verify(token, 'admin-secret-token', (err, decoded) => {
    if (err) {
      return next();
    }

    if (decoded?.role === 'admin') {
      return res.json({ message: 'is-admin' });
    }

    next();
  });
};

module.exports = checkAdminToken;
