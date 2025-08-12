const express = require('express');
const router = express.Router();

// Import individual route modules
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');

// Mount routes
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
