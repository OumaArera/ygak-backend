const InstitutionService = require('../services/institution.service');

class InstitutionController {
  async create(req, res) {
    try {
      const institution = await InstitutionService.createInstitution(req.body, req.user);
      res.status(201).json({success: true, data: institution});
    } catch (err) {
      res.status(500).json({success: false, error:err.message});
    }
  }

  async getById(req, res) {
    try {
      const institution = await InstitutionService.getInstitutionById(req.params.id, req.user);
      if (!institution) {
        return res.status(404).json({success: false, error: 'Institution not found' });
      }
      res.status(200).json({success: true, data: institution});
    } catch (err) {
      res.status(500).json({success: false, error:err.message});
    }
  }

  async search(req, res) {
    try {
      const institutions = await InstitutionService.searchInstitutions(req.query, req.user);
      res.status(200).json({success: true, data: institutions});
    } catch (err) {
      res.status(500).json({success: false, error:err.message});
    }
  }

  async update(req, res) {
    try {
      const updated = await InstitutionService.updateInstitution(req.params.id, req.body, req.user);
      if (!updated) {
        return res.status(404).json({success: false, error: 'Institution not found' });
      }
      res.status(200).json({success: true, data: updated});
    } catch (err) {
      res.status(500).json({success: false, error:err.message});
    }
  }

  async delete(req, res) {
    try {
      const deleted = await InstitutionService.deleteInstitution(req.params.id, req.user);
      if (!deleted) {
        return res.status(404).json({success: false, error: 'Institution not found' });
      }
      res.status(204).json({success: true, error: 'Institution deleted successfully' });
    } catch (err) {
      res.status(500).json({success: false, error:err.message});
    }
  }
}

module.exports = new InstitutionController();
