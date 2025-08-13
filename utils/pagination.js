module.exports = {
  /**
   * Paginate a Sequelize model query
   * @param {Model} model - Sequelize model
   * @param {Object} options - { where, include, attributes, order, page, limit }
   * @returns {Object} paginated result
   */
  async paginate(model, options) {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await model.findAndCountAll({
      where: options.where || {},
      include: options.include || [],
      attributes: options.attributes || undefined,
      order: options.order || [['createdAt', 'DESC']],
      limit,
      offset
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }
};
