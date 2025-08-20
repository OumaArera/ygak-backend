const inventoryService = require('../services/inventory.service');
const { handleAllErrors } = require('../utils/sequelizeErrorHandler.util');

class InventoryController {
  /**
   * Controller method to create a new inventory item.
   * @param {object} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async create(req, res) {
    try {
      const inventoryItem = await inventoryService.createInventory(req.body, req.user);
      res.status(201).json({ success: true, data: inventoryItem });
    } catch (err) {
      console.error('Error in InventoryController.create:', err);
      
      const sequelizeErrors = ['SequelizeUniqueConstraintError', 'SequelizeForeignKeyConstraintError', 'SequelizeValidationError'];
      if (sequelizeErrors.includes(err.name)) {
        const errors = handleAllErrors(err);
        return res.status(400).json({ success: false, errors });
      }

      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Controller method to fetch a single inventory item by ID.
   * @param {object} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async getById(req, res) {
    try {
      const inventoryItem = await inventoryService.getInventoryById(req.params.id, req.user);
      if (!inventoryItem) {
        return res.status(404).json({ success: false, error: 'Inventory item not found' });
      }
      res.status(200).json({ success: true, data: inventoryItem });
    } catch (err) {
      console.error('Error in InventoryController.getById:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Controller method to search for inventory items.
   * @param {object} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async search(req, res) {
    try {
      const inventoryItems = await inventoryService.searchInventory(req.query, req.user);
      res.status(200).json({ success: true, data: inventoryItems });
    } catch (err) {
      console.error('Error in InventoryController.search:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Controller method to update an existing inventory item.
   * @param {string} id - The UUID of the inventory item to update.
   * @param {object} updates - The fields to update.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Inventory|null>} The updated inventory item, or null if not found.
   */
  async update(req, res) {
    try {
      const updated = await inventoryService.updateInventory(req.params.id, req.body, req.user);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Inventory item not found' });
      }
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      console.error('Error in InventoryController.update:', err);

      const sequelizeErrors = ['SequelizeUniqueConstraintError', 'SequelizeForeignKeyConstraintError', 'SequelizeValidationError'];
      if (sequelizeErrors.includes(err.name)) {
        const errors = handleAllErrors(err);
        return res.status(400).json({ success: false, errors });
      }

      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Controller method to delete an inventory item.
   * @param {string} id - The UUID of the inventory item to delete.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Inventory|null>} The deleted inventory item, or null if not found.
   */
  async delete(req, res) {
    try {
      const deleted = await inventoryService.deleteInventory(req.params.id, req.user);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Inventory item not found' });
      }
      res.status(204).json({ success: true, message: 'Inventory item deleted successfully' });
    } catch (err) {
      console.error('Error in InventoryController.delete:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new InventoryController();
