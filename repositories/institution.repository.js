const { Institution } = require('../models');

class InstitutionRepository {
  async create(data) {
    const result = await Institution.create(data);
    return result
  }

  async findById(id) {
    const result = await Institution.findByPk(id);
    return result;
  }

  async findByQuery(query) {
    const result = await Institution.findAll({ where: query });
    
    return result;
  }

  async updateById(id, updates) {
    const institution = await Institution.findByPk(id);
    if (!institution) return null;
    const result = await institution.update(updates);
    return result;
  }

  async deleteById(id) {
    const institution = await Institution.findByPk(id);
    if (!institution) return null;
    await institution.destroy();
    return institution;
  }
}

module.exports = new InstitutionRepository();
