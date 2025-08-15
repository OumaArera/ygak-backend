const FundReallocationService = require('../services/fundReallocation.service');

class FundReallocationController {
  async create(req, res) {
    try {
      const reallocation = await FundReallocationService.createReallocation(req.body, req.user);
      res.status(201).json({ success: true, data: reallocation });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async search(req, res) {
    try {
      const reallocations = await FundReallocationService.searchReallocations(req.query, req.user);
      res.status(200).json({ success: true, data: reallocations });
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

      const approved = await FundReallocationService.approveReallocation(req.params.id, approvalData, req.user);
      if (!approved) {
        return res.status(404).json({ success: false, error: 'Reallocation not found' });
      }
      res.status(200).json({ success: true, data: approved });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new FundReallocationController();