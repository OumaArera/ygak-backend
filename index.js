const express = require('express');
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
// Extract user's IP address and agent
app.use(enrichUserContext);

// Handle origins
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));


pool.query('SELECT NOW()')
  .then(result => {
    console.log('Database connected successfully at:', result.rows[0].now);

    // Start server only after DB is confirmed
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1); // stop app if DB connection fails
  });

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
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
