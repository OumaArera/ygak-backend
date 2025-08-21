const DonationService = require('../services/donation.service');

class DonationController {
  /**
   * Handles the creation of a new donation.
   * @param {object} req The request object.
   * @param {object} res The response object.
   */
  async create(req, res) {
    try {
      const payload = {
        ...req.body
      };

      const donation = await DonationService.createDonation(payload);
      res.status(201).json({ success: true, data: donation });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Handles fetching a single donation by ID.
   * @param {object} req The request object.
   * @param {object} res The response object.
   */
  async getById(req, res) {
    try {
      const donation = await DonationService.getDonationById(req.params.id, req.user);
      if (!donation) {
        return res.status(404).json({ success: false, error: 'Donation not found' });
      }
      res.status(200).json({ success: true, data: donation });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Handles searching for donations with optional filters and pagination.
   * @param {object} req The request object.
   * @param {object} res The response object.
   */
  async search(req, res) {
    try {
      const donations = await DonationService.searchDonations(req.query, req.user);
      res.status(200).json({ success: true, data: donations });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Handles updating a donation by its ID.
   * @param {object} req The request object.
   * @param {object} res The response object.
   */
  async update(req, res) {
    try {
      const updated = await DonationService.updateDonation(req.params.id, req.body, req.user);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Donation not found' });
      }
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Handles deleting a donation by its ID.
   * @param {object} req The request object.
   * @param {object} res The response object.
   */
  async delete(req, res) {
    try {
      const deleted = await DonationService.deleteDonation(req.params.id, req.user);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Donation not found' });
      }
      res.status(204).json({ success: true, message: 'Donation deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new DonationController();
