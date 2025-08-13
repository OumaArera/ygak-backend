const express = require('express');
const router = express.Router();

// Import individual route modules
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const institutionRoutes = require('./institution.routes');
const activityTrackerRoutes = require('./activityTracker.routes');
const volunteerRoutes = require('./volunteer.routes');
const budgetRoutes = require('./budget.routes');

// Mount routes
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/institutions', institutionRoutes);
router.use('/activity-tracks', activityTrackerRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/budgets', budgetRoutes);

module.exports = router;
