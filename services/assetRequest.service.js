const assetRequestRepository = require('../repositories/assetRequest.repository');

class AssetRequestService {
  /**
   * Creates a new asset request.
   * @param {object} data - The data for the new asset request.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<AssetRequest>} The newly created asset request.
   */
  async createAssetRequest(data, userContext) {
    try {
      return await assetRequestRepository.create(data, userContext);
    } catch (error) {
      console.error('Error in createAssetRequest service:', error);
      throw new Error(`Failed to create asset request: ${error.message}`);
    }
  }

  /**
   * Fetches a single asset request by its ID.
   * @param {string} id - The UUID of the asset request.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<AssetRequest|null>} The asset request, or null if not found.
   */
  async getAssetRequestById(id, userContext) {
    try {
      return await assetRequestRepository.findById(id, userContext);
    } catch (error) {
      console.error('Error in getAssetRequestById service:', error);
      throw new Error(`Failed to get asset request: ${error.message}`);
    }
  }

  /**
   * Searches for asset requests based on query parameters.
   * @param {object} queryParams - The query parameters for filtering and pagination.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<{rows: AssetRequest[], count: number}>} Paginated list of asset requests.
   */
  async searchAssetRequests(queryParams, userContext) {
    try {
      return await assetRequestRepository.findByQuery(queryParams, userContext);
    } catch (error) {
      console.error('Error in searchAssetRequests service:', error);
      throw new Error(`Failed to search asset requests: ${error.message}`);
    }
  }

  /**
   * Updates an existing asset request.
   * @param {string} id - The UUID of the asset request to update.
   * @param {object} updates - The fields to update.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<AssetRequest|null>} The updated asset request, or null if not found.
   */
  async updateAssetRequest(id, updates, userContext) {
    try {
      return await assetRequestRepository.updateById(id, updates, userContext);
    } catch (error) {
      console.error('Error in updateAssetRequest service:', error);
      throw new Error(`Failed to update asset request: ${error.message}`);
    }
  }

  /**
   * Deletes an asset request.
   * @param {string} id - The UUID of the asset request to delete.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<AssetRequest|null>} The deleted asset request, or null if not found.
   */
  async deleteAssetRequest(id, userContext) {
    try {
      return await assetRequestRepository.deleteById(id, userContext);
    } catch (error) {
      console.error('Error in deleteAssetRequest service:', error);
      throw new Error(`Failed to delete asset request: ${error.message}`);
    }
  }
}

module.exports = new AssetRequestService();
