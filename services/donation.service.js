const donationRepository = require('../repositories/donation.repository');
const { generateTransactionReference } = require('../utils/transactionReference.util');

class DonationService {
  /**
   * Creates a new donation record.
   * A transaction reference is automatically generated before saving.
   * @param {object} data The donation data.
   * @returns {Promise<object>} The created donation object.
   */
  async createDonation(data) {
    try {
      data.transactionId = generateTransactionReference();
      return await donationRepository.create(data);
    } catch (error) {
      console.error('Error in createDonation service:', error);
      throw new Error(`Failed to create donation: ${error.message}`);
    }
  }

  /**
   * Fetches a donation by its unique ID.
   * @param {string} id The UUID of the donation.
   * @param {object} userContext The user context for activity tracking.
   * @returns {Promise<object|null>} The found donation or null.
   */
  async getDonationById(id, userContext) {
    try {
      return await donationRepository.findById(id, userContext);
    } catch (error) {
      console.error('Error in getDonationById service:', error);
      throw new Error(`Failed to get donation: ${error.message}`);
    }
  }

  /**
   * Searches for donations based on query parameters.
   * @param {object} queryParams The query parameters for filtering and pagination.
   * @param {object} userContext The user context for activity tracking.
   * @returns {Promise<object>} An object containing the paginated results.
   */
  async searchDonations(queryParams, userContext) {
    try {
      return await donationRepository.findByQuery(queryParams, userContext);
    } catch (error) {
      console.error('Error in searchDonations service:', error);
      throw new Error(`Failed to search donations: ${error.message}`);
    }
  }

  /**
   * Updates an existing donation record.
   * @param {string} id The UUID of the donation.
   * @param {object} updates The updates object.
   * @param {object} userContext The user context for activity tracking.
   * @returns {Promise<object|null>} The updated donation or null if not found.
   */
  async updateDonation(id, updates, userContext) {
    try {
      return await donationRepository.updateById(id, updates, userContext);
    } catch (error) {
      console.error('Error in updateDonation service:', error);
      throw new Error(`Failed to update donation: ${error.message}`);
    }
  }

  /**
   * Deletes a donation record.
   * @param {string} id The UUID of the donation.
   * @param {object} userContext The user context for activity tracking.
   * @returns {Promise<object|null>} The deleted donation or null if not found.
   */
  async deleteDonation(id, userContext) {
    try {
      return await donationRepository.deleteById(id, userContext);
    } catch (error) {
      console.error('Error in deleteDonation service:', error);
      throw new Error(`Failed to delete donation: ${error.message}`);
    }
  }
}

module.exports = new DonationService();
