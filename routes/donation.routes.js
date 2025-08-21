const express = require('express');
const router = express.Router();

const DonationController = require('../controllers/donation.controller');
const DonationValidation = require('../deserializers/donation.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');
const parseJSONFields = require('../middlewares/jsonParse.middleware');
const { decryptDonationData, getTimestamp } = require('../middlewares/donationEncryption.middleware');

// Public endpoint to get timestamp for encryption
router.get('/timestamp', getTimestamp);

// Public donation creation route (encrypted)
router.post(
  '/public',
  decryptDonationData,
  parseJSONFields(['transactionalParticulars']),
  DonationValidation.createRules(),
  validate,
  DonationController.create
);

// Protected donation creation route (authenticated)
router.post(
  '/',
  authenticateToken,
  parseJSONFields(['transactionalParticulars']),
  DonationValidation.createRules(),
  validate,
  authorizeRolesFromMapping('AllBoardMembers'),
  DonationController.create
);

// Get all donations (with search/filtering)
router.get(
  '/',
  authenticateToken,
  DonationValidation.queryRules(),
  validate,
  authorizeRolesFromMapping('AllBoardMembers'),
  DonationController.search
);

// Get donation by ID
router.get(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllBoardMembers'),
  DonationController.getById
);

// Update donation
router.put(
  '/:id',
  authenticateToken,
  parseJSONFields(['transactionalParticulars']),
  DonationValidation.updateRules(),
  validate,
  authorizeRolesFromMapping('AllBoardMembers'),
  DonationController.update
);

// Delete donation (restricted access)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  DonationController.delete
);

module.exports = router;