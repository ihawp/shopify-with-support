const validator = require('validator');

const verifyJWT = (req, res, next) => {

    let token = req.cookies.token;
  
    if (!token) {
        return res.status(403).json({ message: 'Token required' });
    }

    if (!validator.isJWT(token)) {
        return res.status(403).json({ message: 'Invalid Token' });
    }
  
    jwt.verify(token, 'admin-secret-token', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: err.message });
        }
  
        next();
    });
};

module.exports = verifyJWT