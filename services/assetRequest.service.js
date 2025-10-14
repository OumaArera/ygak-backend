const assetRequestRepository = require('../repositories/assetRequest.repository');

class AssetRequestService {
 
  async createAssetRequest(data, userContext) {
    try {
      return await assetRequestRepository.create(data);
    } catch (error) {
      console.error('Error in createAssetRequest service:', error);
      throw new Error(`Failed to create asset request: ${error.message}`);
    }
  }


  async getAssetRequestById(id, userContext) {
    try {
      return await assetRequestRepository.findById(id);
    } catch (error) {
      console.error('Error in getAssetRequestById service:', error);
      throw new Error(`Failed to get asset request: ${error.message}`);
    }
  }


  async searchAssetRequests(queryParams, userContext) {
    try {
      return await assetRequestRepository.findByQuery(queryParams);
    } catch (error) {
      console.error('Error in searchAssetRequests service:', error);
      throw new Error(`Failed to search asset requests: ${error.message}`);
    }
  }


  async updateAssetRequest(id, updates, userContext) {
    try {
      return await assetRequestRepository.updateById(id, updates);
    } catch (error) {
      console.error('Error in updateAssetRequest service:', error);
      throw new Error(`Failed to update asset request: ${error.message}`);
    }
  }

 
  async deleteAssetRequest(id, userContext) {
    try {
      return await assetRequestRepository.deleteById(id);
    } catch (error) {
      console.error('Error in deleteAssetRequest service:', error);
      throw new Error(`Failed to delete asset request: ${error.message}`);
    }
  }
}

module.exports = new AssetRequestService();
