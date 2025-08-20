const budgetRepository = require('../repositories/budget.repository');
const { saveFile } = require('../utils/fileStorage');

class BudgetService {
  async createBudget(data, userContext) {
    try {
      const address = 'assets/accounts';
      if (data.invoice && data.invoice.buffer) {
        data.invoice = await saveFile(
          data.invoice.buffer,
          data.invoice.originalname,
          process.env.BASE_URL,
          address

        );
      }

      if (data.receipt && data.receipt.buffer) {
        data.receipt = await saveFile(
          data.receipt.buffer,
          data.receipt.originalname,
          process.env.BASE_URL,
          address
        );
      }

      return await budgetRepository.create(data, userContext);
    } catch (error) {
      console.error('Error in createBudget service:', error);
      throw new Error(`Failed to create budget: ${error.message}`);
    }
  }

  async getBudgetById(id, userContext) {
    try {
      return await budgetRepository.findById(id, userContext);
    } catch (error) {
      console.error('Error in getBudgetById service:', error);
      throw new Error(`Failed to get budget: ${error.message}`);
    }
  }

  async searchBudgets(queryParams, userContext) {
    try {
      return await budgetRepository.findByQuery(queryParams, userContext);
    } catch (error) {
      console.error('Error in searchBudgets service:', error);
      throw new Error(`Failed to search budgets: ${error.message}`);
    }
  }

  async updateBudget(id, updates, userContext) {
    try {
      const address = 'assets/accounts';
      if (updates.invoice && updates.invoice.buffer) {
        updates.invoice = await saveFile(
          updates.invoice.buffer,
          updates.invoice.originalname,
          process.env.BASE_URL,
          address
        );
      }

      if (updates.receipt && updates.receipt.buffer) {
        updates.receipt = await saveFile(
          updates.receipt.buffer,
          updates.receipt.originalname,
          process.env.BASE_URL,
          address
        );
      }

      return await budgetRepository.updateById(id, updates, userContext);
    } catch (error) {
      console.error('Error in updateBudget service:', error);
      throw new Error(`Failed to update budget: ${error.message}`);
    }
  }

  async deleteBudget(id, userContext) {
    try {
      return await budgetRepository.deleteById(id, userContext);
    } catch (error) {
      console.error('Error in deleteBudget service:', error);
      throw new Error(`Failed to delete budget: ${error.message}`);
    }
  }
}

module.exports = new BudgetService();