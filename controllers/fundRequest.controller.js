const FundRequestService = require('../services/fundRequest.service');

class FundRequestController {
  async create(req, res) {
    try {
      const fundRequest = await FundRequestService.createFundRequest(req.body, req.user);
      res.status(201).json({ success: true, data: fundRequest });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const fundRequest = await FundRequestService.getFundRequestById(req.params.id, req.user);
      if (!fundRequest) {
        return res.status(404).json({ success: false, error: 'Fund request not found' });
      }
      res.status(200).json({ success: true, data: fundRequest });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async search(req, res) {
    try {
      const fundRequests = await FundRequestService.searchFundRequests(req.query, req.user);
      res.status(200).json({ success: true, data: fundRequests });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await FundRequestService.updateFundRequest(req.params.id, req.body, req.user);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Fund request not found' });
      }
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async approve(req, res) {
    try {
      const { secretaryApprovalStatus, secretaryDeclineReason, chairpersonApprovalStatus, chairpersonDeclineReason } = req.body;
      
      const approvalData = {
        secretaryApprovalStatus,
        secretaryDeclineReason,
        chairpersonApprovalStatus,
        chairpersonDeclineReason
      };

      const updated = await FundRequestService.updateFundRequest(req.params.id, approvalData, req.user);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Fund request not found' });
      }
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new FundRequestController();