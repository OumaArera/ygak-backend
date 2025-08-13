const institutionRepository = require('../repositories/institution.repository');

class InstitutionService {
  async createInstitution(data, userContext) {
    return institutionRepository.create(data, userContext);
  }

  async getInstitutionById(id, userContext) {
    return institutionRepository.findById(id, userContext);
  }

  async searchInstitutions(queryParams, userContext) {
    return institutionRepository.findByQuery(queryParams, userContext);
  }

  async updateInstitution(id, updates, userContext) {
    return institutionRepository.updateById(id, updates, userContext);
  }

  async deleteInstitution(id, userContext) {
    return institutionRepository.deleteById(id, userContext);
  }
}

module.exports = new InstitutionService();
