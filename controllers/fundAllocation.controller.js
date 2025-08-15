const FundAllocationService = require('../services/fundAllocation.service');

class FundAllocationController {
  async create(req, res) {
    try {
      const fundAllocation = await FundAllocationService.createFundAllocation(req.body, req.user);
      res.status(201).json({ 
        success: true, 
        message: 'Fund allocation created successfully',
        data: fundAllocation 
      });
    } catch (err) {
      res.status(400).json({ 
        success: false, 
        error: err.message 
      });
    }
  }

  async getById(req, res) {
    try {
      const fundAllocation = await FundAllocationService.getFundAllocationById(req.params.id, req.user);
      if (!fundAllocation) {
        return res.status(404).json({ 
          success: false, 
          error: 'Fund allocation not found' 
        });
      }
      res.status(200).json({ 
        success: true, 
        data: fundAllocation 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  }

  async search(req, res) {
    try {
      const fundAllocations = await FundAllocationService.searchFundAllocations(req.query, req.user);
      res.status(200).json({ 
        success: true, 
        data: fundAllocations 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  }

  async update(req, res) {
    try {
      const updated = await FundAllocationService.updateFundAllocation(req.params.id, req.body, req.user);
      if (!updated) {
        return res.status(404).json({ 
          success: false, 
          error: 'Fund allocation not found' 
        });
      }
      res.status(200).json({ 
        success: true, 
        message: 'Fund allocation updated successfully',
        data: updated 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  }

  async reallocate(req, res) {
    try {
      const { newBudgetId, newAmount } = req.body;
      
      if (!newBudgetId) {
        return res.status(400).json({
          success: false,
          error: 'New budget ID is required for reallocation'
        });
      }

      const reallocated = await FundAllocationService.reallocateFunds(
        req.params.id, 
        newBudgetId, 
        newAmount, 
        req.user
      );
      
      res.status(200).json({ 
        success: true, 
        message: 'Funds reallocated successfully',
        data: reallocated 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await FundAllocationService.deleteFundAllocation(req.params.id, req.user);
      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          error: 'Fund allocation not found' 
        });
      }
      res.status(200).json({ 
        success: true, 
        message: 'Fund allocation deleted successfully',
        data: deleted 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  }

  async getSummary(req, res) {
    try {
      const summary = await FundAllocationService.getFundAllocationSummary(req.user);
      res.status(200).json({ 
        success: true, 
        data: summary 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      
      if (!status || !['active', 'fully_utilized', 'reallocated'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Valid status is required (active, fully_utilized, reallocated)'
        });
      }

      const updated = await FundAllocationService.updateFundAllocation(
        req.params.id, 
        { status }, 
        req.user
      );
      
      if (!updated) {
        return res.status(404).json({ 
          success: false, 
          error: 'Fund allocation not found' 
        });
      }

      res.status(200).json({ 
        success: true, 
        message: 'Fund allocation status updated successfully',
        data: updated 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  }

  async getByBudget(req, res) {
    try {
      const { budgetId } = req.params;
      const queryParams = { ...req.query, budgetId };
      
      const allocations = await FundAllocationService.searchFundAllocations(queryParams, req.user);
      res.status(200).json({ 
        success: true, 
        data: allocations 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  }

  async getByFundRequest(req, res) {
    try {
      const { fundRequestId } = req.params;
      const queryParams = { ...req.query, fundRequestId };
      
      const allocations = await FundAllocationService.searchFundAllocations(queryParams, req.user);
      res.status(200).json({ 
        success: true, 
        data: allocations 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  }
}

module.exports = new FundAllocationController();