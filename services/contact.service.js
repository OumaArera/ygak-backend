const { Contact } = require('../models');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class ContactService {
  /**
   * C - Creates a new contact form entry (Submission).
   */
  async submitContact(data) {
    return await Contact.create(data);
  }

  /**
   * R - Retrieves all contact submissions with pagination and optional filtering.
   */
  async getAll(query) {
    const { page, limit, ...filters } = query;
    const where = {};

    for (const [key, value] of Object.entries(filters)) {
      if (typeof value === 'string' && key !== 'id') {
        where[key] = { [Op.iLike]: `%${value}%` };
      } else {
        where[key] = value;
      }
    }

    // Assuming paginationUtil.paginate handles limit and page
    return await paginationUtil.paginate(Contact, { where, page, limit });
  }

  /**
   * R - Retrieves a single contact submission by ID.
   */
  async getById(id) {
    const record = await Contact.findByPk(id);
    if (!record) throw new Error('Contact submission not found');
    return record;
  }

  /**
   * D - Deletes a contact submission by ID.
   */
  async delete(id) {
    const record = await Contact.findByPk(id);
    if (!record) throw new Error('Contact submission not found');
    await record.destroy();
    return record;
  }

  /**
   * U - Update is typically not required for a submission, but here is the method for completeness.
   */
  async update(id, data) {
    const record = await Contact.findByPk(id);
    if (!record) {
      throw new Error('Contact submission not found');
    }
    await record.update(data);
    return record;
  }
}

module.exports = new ContactService();