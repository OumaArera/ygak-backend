const { Institution } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');

class InstitutionRepository {
  async create(data, userContext) {
    const result = await Institution.create(data);
    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Institution",
      action: 'CREATE',
      description: `Created a new institution ${JSON.stringify(data)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });
    return result
  }

  async findById(id, userContext) {
    const result = await Institution.findByPk(id);
    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Institution",
      action: 'GET',
      description: `Get an institution of ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });
    return result;
  }

  async findByQuery(query, userContext) {
    const result = await Institution.findAll({ where: query });
    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Institution",
      action: 'GET',
      description: `Get institutions ${result}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });
    return result;
  }

  async updateById(id, updates, userContext) {
    const institution = await Institution.findByPk(id);
    if (!institution) return null;
    const result = await institution.update(updates);
    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Institution",
      action: 'UPDATE',
      description: `Update institution of ID: ${id}, Payload: ${JSON.stringify(updates)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });
    return result;
  }

  async deleteById(id, userContext) {
    const institution = await Institution.findByPk(id);
    if (!institution) return null;
    await institution.destroy();
    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Institution",
      action: 'DELETE',
      description: `Delete institution of ID: ${id}.`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });
    return institution;
  }
}

module.exports = new InstitutionRepository();
