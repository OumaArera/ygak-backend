const budgetRepository = require('../repositories/budget.repository');
const { saveBudgetFile } = require('../utils/fileStorage');

class BudgetService {
  async createBudget(data, userContext) {
    try {
      // Handle files asynchronously if provided
      if (data.invoice && data.invoice.buffer) {
        data.invoice = await saveBudgetFile(
          data.invoice.buffer,
          data.invoice.originalname,
          process.env.BASE_URL
        );
      }

      if (data.receipt && data.receipt.buffer) {
        data.receipt = await saveBudgetFile(
          data.receipt.buffer,
          data.receipt.originalname,
          process.env.BASE_URL
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
      // Handle files asynchronously if provided
      if (updates.invoice && updates.invoice.buffer) {
        updates.invoice = await saveBudgetFile(
          updates.invoice.buffer,
          updates.invoice.originalname,
          process.env.BASE_URL
        );
      }

      if (updates.receipt && updates.receipt.buffer) {
        updates.receipt = await saveBudgetFile(
          updates.receipt.buffer,
          updates.receipt.originalname,
          process.env.BASE_URL
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