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

module.exports = verifyJWT