const institutionRepository = require('../repositories/institution.repository');

class InstitutionService {
  async createInstitution(data) {
    return institutionRepository.create(data);
  }

  async getInstitutionById(id) {
    return institutionRepository.findById(id);
  }

  async searchInstitutions(queryParams, ) {
    return institutionRepository.findByQuery(queryParams);
  }

  async updateInstitution(id, updates) {
    return institutionRepository.updateById(id, updates);
  }

  async deleteInstitution(id, userContext) {
    return institutionRepository.deleteById(id);
  }
}

module.exports = new InstitutionService();
