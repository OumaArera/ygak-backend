const inventoryRepository = require('../repositories/inventory.repository');

class InventoryService {

  async createInventory(data, userContext) {
    try {
      return await inventoryRepository.create(data);
    } catch (error) {
      console.error('Error in createInventory service:', error);
      throw error;
    }
  }


  async getInventoryById(id, userContext) {
    try {
      return await inventoryRepository.findById(id);
    } catch (error) {
      console.error('Error in getInventoryById service:', error);
      throw new Error(`Failed to get inventory item: ${error.message}`);
    }
  }


  async searchInventory(queryParams, userContext) {
    try {
      return await inventoryRepository.findByQuery(queryParams);
    } catch (error) {
      console.error('Error in searchInventory service:', error);
      throw new Error(`Failed to search inventory items: ${error.message}`);
    }
  }

 
  async updateInventory(id, updates, userContext) {
    try {
      return await inventoryRepository.updateById(id, updates);
    } catch (error) {
      console.error('Error in updateInventory service:', error);
      throw error;
    }
  }

 
  async deleteInventory(id, userContext) {
    try {
      return await inventoryRepository.deleteById(id);
    } catch (error) {
      console.error('Error in deleteInventory service:', error);
      throw new Error(`Failed to delete inventory item: ${error.message}`);
    }
  }
}

module.exports = new InventoryService();
