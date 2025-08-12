const { Institution } = require('../models');

class InstitutionRepository {
  async create(data) {
    return Institution.create(data);
  }

  async findById(id) {
    return Institution.findByPk(id);
  }

  async findByQuery(query) {
    return Institution.findAll({ where: query });
  }

  async updateById(id, updates) {
    const institution = await Institution.findByPk(id);
    if (!institution) return null;
    return institution.update(updates);
  }

  async deleteById(id) {
    const institution = await Institution.findByPk(id);
    if (!institution) return null;
    await institution.destroy();
    return institution;
  }
}

module.exports = new InstitutionRepository();
