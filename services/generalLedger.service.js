const GeneralLedgerRepository = require('../repositories/generalLedger.repository');

class GeneralLedgerService {
  async createGL(data, userContext) {
    try {
      return await GeneralLedgerRepository.create(data);
    } catch (error) {
      console.error('Error in createGL service:', error);
      throw new Error(`Failed to create general ledger: ${error.message}`);
    }
  }

  async getGLById(id, userContext) {
    try {
      return await GeneralLedgerRepository.findById(id);
    } catch (error) {
      console.error('Error in getGLById service:', error);
      throw new Error(`Failed to get general ledger: ${error.message}`);
    }
  }

  async searchGLs(queryParams, userContext) {
    try {
      return await GeneralLedgerRepository.findByQuery(queryParams);
    } catch (error) {
      console.error('Error in searchGLs service:', error);
      throw new Error(`Failed to search general ledgers: ${error.message}`);
    }
  }

  async updateGL(id, updates, userContext) {
    try {
      return await GeneralLedgerRepository.updateById(id, updates);
    } catch (error) {
      console.error('Error in updateGL service:', error);
      throw new Error(`Failed to update general ledger: ${error.message}`);
    }
  }

  async deleteGL(id, userContext) {
    try {
      return await GeneralLedgerRepository.deleteById(id);
    } catch (error) {
      console.error('Error in deleteGL service:', error);
      throw new Error(`Failed to delete general ledger: ${error.message}`);
    }
  }

  async getGLBalance(glId, userContext) {
    try {
      const gl = await GeneralLedgerRepository.findById(glId);
      if (!gl) throw new Error('General ledger not found');
      
      // Calculate available balance (current balance minus pending allocations)
      const pendingAllocations = gl.allocations
        .filter(allocation => allocation.status === 'active')
        .reduce((sum, allocation) => sum + parseFloat(allocation.remainingAmount), 0);
      
      return {
        glId: gl.id,
        glCode: gl.glCode,
        glName: gl.glName,
        currentBalance: parseFloat(gl.currentBalance),
        pendingAllocations,
        availableBalance: parseFloat(gl.currentBalance) - pendingAllocations
      };
    } catch (error) {
      console.error('Error in getGLBalance service:', error);
      throw new Error(`Failed to get GL balance: ${error.message}`);
    }
  }
}


module.exports = new GeneralLedgerService();