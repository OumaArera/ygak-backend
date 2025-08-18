const assetRequestService = require('../services/assetRequest.service');

class AssetRequestController {
  /**
   * Controller method to create a new asset request.
   * @param {object} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async create(req, res) {
    try {
      const assetRequest = await assetRequestService.createAssetRequest(req.body, req.user);
      res.status(201).json({ success: true, data: assetRequest });
    } catch (err) {
      console.error('Error in AssetRequestController.create:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Controller method to fetch a single asset request by ID.
   * @param {object} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async getById(req, res) {
    try {
      const assetRequest = await assetRequestService.getAssetRequestById(req.params.id, req.user);
      if (!assetRequest) {
        return res.status(404).json({ success: false, error: 'Asset request not found' });
      }
      res.status(200).json({ success: true, data: assetRequest });
    } catch (err) {
      console.error('Error in AssetRequestController.getById:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Controller method to search for asset requests.
   * @param {object} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async search(req, res) {
    try {
      const assetRequests = await assetRequestService.searchAssetRequests(req.query, req.user);
      res.status(200).json({ success: true, data: assetRequests });
    } catch (err) {
      console.error('Error in AssetRequestController.search:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Controller method to update an existing asset request.
   * @param {object} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async update(req, res) {
    try {
      const updated = await assetRequestService.updateAssetRequest(req.params.id, req.body, req.user);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Asset request not found' });
      }
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      console.error('Error in AssetRequestController.update:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Controller method to delete an asset request.
   * @param {object} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async delete(req, res) {
    try {
      const deleted = await assetRequestService.deleteAssetRequest(req.params.id, req.user);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Asset request not found' });
      }
      res.status(204).json({ success: true, message: 'Asset request deleted successfully' });
    } catch (err) {
      console.error('Error in AssetRequestController.delete:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new AssetRequestController();
