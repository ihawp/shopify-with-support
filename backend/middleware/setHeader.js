const setHeader = (req, res, next) => {
    res.setHeader("Content-Security-Policy", 
      "default-src 'self'; " +
      "script-src 'self'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "object-src 'none'; " +
      "connect-src 'self'; " +
      "img-src 'self' data:;"
    );
    next();
  }

  module.exports = setHeader