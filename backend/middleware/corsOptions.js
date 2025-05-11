const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true
};

module.exports = corsOptions