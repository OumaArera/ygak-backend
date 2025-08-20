const inventoryRepository = require('../repositories/inventory.repository');

class InventoryService {
  /**
   * Creates a new inventory item.
   * @param {object} data - The data for the new inventory item.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Inventory>} The newly created inventory item.
   */
  async createInventory(data, userContext) {
    try {
      return await inventoryRepository.create(data, userContext);
    } catch (error) {
      console.error('Error in createInventory service:', error);
      throw error;
    }
  }

  /**
   * Fetches a single inventory item by its ID.
   * @param {string} id - The UUID of the inventory item.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Inventory|null>} The inventory item, or null if not found.
   */
  async getInventoryById(id, userContext) {
    try {
      return await inventoryRepository.findById(id, userContext);
    } catch (error) {
      console.error('Error in getInventoryById service:', error);
      throw new Error(`Failed to get inventory item: ${error.message}`);
    }
  }

  /**
   * Searches for inventory items based on query parameters.
   * @param {object} queryParams - The query parameters for filtering and pagination.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<{rows: Inventory[], count: number}>} Paginated list of inventory items.
   */
  async searchInventory(queryParams, userContext) {
    try {
      return await inventoryRepository.findByQuery(queryParams, userContext);
    } catch (error) {
      console.error('Error in searchInventory service:', error);
      throw new Error(`Failed to search inventory items: ${error.message}`);
    }
  }

  /**
   * Updates an existing inventory item.
   * @param {string} id - The UUID of the inventory item to update.
   * @param {object} updates - The fields to update.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Inventory|null>} The updated inventory item, or null if not found.
   */
  async updateInventory(id, updates, userContext) {
    try {
      return await inventoryRepository.updateById(id, updates, userContext);
    } catch (error) {
      console.error('Error in updateInventory service:', error);
      throw error;
    }
  }

  /**
   * Deletes an inventory item.
   * @param {string} id - The UUID of the inventory item to delete.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Inventory|null>} The deleted inventory item, or null if not found.
   */
  async deleteInventory(id, userContext) {
    try {
      return await inventoryRepository.deleteById(id, userContext);
    } catch (error) {
      console.error('Error in deleteInventory service:', error);
      throw new Error(`Failed to delete inventory item: ${error.message}`);
    }
  }
}

module.exports = new InventoryService();
