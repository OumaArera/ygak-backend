const { Blog } = require('../models');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class BlogRepository {
  async create(data) {
    return await Blog.create(data);
  }

  async findById(id) {
    return await Blog.findByPk(id);
  }

  async findByQuery(query) {
    const { page, limit, category, author, title, ...rest } = query;
    const where = {};

    if (category) where.category = { [Op.iLike]: `%${category}%` };
    if (author) where.author = { [Op.iLike]: `%${author}%` };
    if (title) where.title = { [Op.iLike]: `%${title}%` };

    const result = await paginationUtil.paginate(Blog, {
      where,
      page,
      limit,
      order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']],
    });

    return result;
  }

  async updateById(id, updates) {
    const blog = await Blog.findByPk(id);
    if (!blog) return null;
    return await blog.update(updates);
  }

  async deleteById(id) {
    const blog = await Blog.findByPk(id);
    if (!blog) return null;
    await blog.destroy();
    return blog;
  }
}

module.exports = new BlogRepository();
