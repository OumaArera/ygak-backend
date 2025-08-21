const express = require('express');
const router = express.Router();

// Import individual route modules
const userRouter = require('./user.routes');
const authRouter = require('./auth.routes');
const institutionRouter = require('./institution.routes');
const activityTrackerRouter = require('./activityTracker.routes');
const volunteerRouter = require('./volunteer.routes');
const budgetRouter = require('./budget.routes');
const reportRouter = require('./report.routes');
const taskRouter = require('./task.routes');
const meetingRouter = require('./meeting.routes');
const glRouter = require('./generalLedger.routes');
const fundRequestRouter = require('./fundRequest.routes');
const paymentRouter = require('./payment.routes');
const reallocationRouter = require('./fundReallocation.routes');
const reportsRouter = require('./financialReport.routes');
const fundAllocationRouter = require('./fundAllocation.routes');
const projectRouter = require('./project.routes');
const assetRequestRouter = require('./assetRequest.routes');
const inventoryRouter = require('./inventory.routes');
const eventRouter = require('./event.routes');
const eventMediaRouter = require('./eventMedia.routes');
const donationRouter = require('./donation.routes');

// Mount routes
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/institutions', institutionRouter);
router.use('/activity-tracks', activityTrackerRouter);
router.use('/volunteers', volunteerRouter);
router.use('/budgets', budgetRouter);
router.use('/reports', reportRouter);
router.use('/tasks', taskRouter);
router.use('/meetings', meetingRouter);
router.use('/general-ledgers', glRouter);
router.use('/fund-requests', fundRequestRouter);
router.use('/payments', paymentRouter);
router.use('/reallocations', reallocationRouter);
router.use('/financial-reports', reportsRouter);
router.use('/fund-allocations', fundAllocationRouter);
router.use('/projects', projectRouter);
router.use('/asset-requests', assetRequestRouter);
router.use('/inventories', inventoryRouter);
router.use('/upcoming-events', eventRouter);
router.use('/events-media', eventMediaRouter);
router.use('/donations', donationRouter);

module.exports = router;
