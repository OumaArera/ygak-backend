const blogRepository = require('../repositories/blog.repository');
const { saveFile } = require('../utils/fileStorage');

class BlogService {
  async createBlog(data) {
    if (data.coverImage && data.coverImage.buffer) {
      const address = 'assets/blogs';
      data.coverImage = await saveFile(
        data.coverImage.buffer,
        data.coverImage.originalname,
        process.env.BASE_URL,
        address
      );
    }
    return await blogRepository.create(data);
  }

  async getBlogById(id) {
    return await blogRepository.findById(id);
  }

  async searchBlogs(query) {
    return await blogRepository.findByQuery(query);
  }

  async updateBlog(id, updates) {
    if (updates.coverImage && updates.coverImage.buffer) {
      const address = 'assets/blogs';
      updates.coverImage = await saveFile(
        updates.coverImage.buffer,
        updates.coverImage.originalname,
        process.env.BASE_URL,
        address
      );
    }
    return await blogRepository.updateById(id, updates);
  }

  async deleteBlog(id) {
    return await blogRepository.deleteById(id);
  }
}

module.exports = new BlogService();
