const InstitutionService = require('../services/institution.service');

class InstitutionController {
  async create(req, res, next) {
    try {
      const institution = await InstitutionService.createInstitution(req.body, req.user);
      res.status(201).json(institution);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const institution = await InstitutionService.getInstitutionById(req.params.id, req.user);
      if (!institution) {
        return res.status(404).json({ message: 'Institution not found' });
      }
      res.json(institution);
    } catch (err) {
      next(err);
    }
  }

  async search(req, res, next) {
    try {
      const institutions = await InstitutionService.searchInstitutions(req.query, req.user);
      res.json(institutions);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await InstitutionService.updateInstitution(req.params.id, req.body, req.user);
      if (!updated) {
        return res.status(404).json({ message: 'Institution not found' });
      }
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const deleted = await InstitutionService.deleteInstitution(req.params.id, req.user);
      if (!deleted) {
        return res.status(404).json({ message: 'Institution not found' });
      }
      res.json({ message: 'Institution deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new InstitutionController();
