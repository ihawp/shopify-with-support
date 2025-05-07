const jwt = require('jsonwebtoken');
const cookie = require('cookie');

module.exports = (socket, next) => {
    const cookies = cookie.parse(socket.request.headers.cookie || '');
    const token = cookies?.token;

    if (!token) {
        return next(new Error('Authentication error: No token provided.'));
    }

    let verifier = 'user-secret-token';
    const insecureDecoded = jwt.decode(token);
    if (insecureDecoded?.role === 'admin') verifier = 'admin-secret-token';

    jwt.verify(token, verifier, (err, decoded) => {
        if (err) return next(new Error('Authentication error: Invalid token.'));

        socket.user = decoded;
        return next();
    });
};
