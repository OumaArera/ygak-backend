const donationRepository = require('../repositories/donation.repository');
const { generateTransactionReference } = require('../utils/transactionReference.util');

class DonationService {
  
  async createDonation(data) {
    try {
      data.transactionId = generateTransactionReference();
      return await donationRepository.create(data);
    } catch (error) {
      console.error('Error in createDonation service:', error);
      throw new Error(`Failed to create donation: ${error.message}`);
    }
  }


  async getDonationById(id, userContext) {
    try {
      return await donationRepository.findById(id);
    } catch (error) {
      console.error('Error in getDonationById service:', error);
      throw new Error(`Failed to get donation: ${error.message}`);
    }
  }


  async searchDonations(queryParams, userContext) {
    try {
      return await donationRepository.findByQuery(queryParams);
    } catch (error) {
      console.error('Error in searchDonations service:', error);
      throw new Error(`Failed to search donations: ${error.message}`);
    }
  }


  async updateDonation(id, updates, userContext) {
    try {
      return await donationRepository.updateById(id, updates);
    } catch (error) {
      console.error('Error in updateDonation service:', error);
      throw new Error(`Failed to update donation: ${error.message}`);
    }
  }


  async deleteDonation(id, userContext) {
    try {
      return await donationRepository.deleteById(id);
    } catch (error) {
      console.error('Error in deleteDonation service:', error);
      throw new Error(`Failed to delete donation: ${error.message}`);
    }
  }
}

module.exports = new DonationService();
