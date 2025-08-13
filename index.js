const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const routes = require('./routes');
require('dotenv').config();

const enrichUserContext = require('./middlewares/enrichUser.context');
const pool = require('./config/db');
const app = express();
const PORT = process.env.PORT || 3005;

const allowedOrigins = [
  "http://localhost:5173/",
  "https://ygak.org/",
  process.env.CORS_ORIGIN_1,
  process.env.CORS_ORIGIN_2,
  process.env.CORS_ORIGIN_3,
  process.env.CORS_ORIGIN_4,
].filter(Boolean);

// CORS config
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
};


// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Extract user's IP address and agent
app.use(enrichUserContext);

// Handle origins
app.use(cors(corsOptions));

// Increase payload limits for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Routes
app.use('/api/v1', routes);

// Test route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Catch-all route for non-existent endpoints
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The route '${req.originalUrl}' does not exist.`,
  });
});

// General error-handling middleware
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  
  // Handle multer errors specifically
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large',
      message: 'File size exceeds the maximum limit'
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Invalid file field',
      message: 'Unexpected file field in request'
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

// Start server only once - after DB connection
pool.query('SELECT NOW()')
  .then(result => {
    console.log('Database connected successfully at:', result.rows[0].now);

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    // Set server timeout
    server.timeout = 60000; 
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });