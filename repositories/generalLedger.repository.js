const { 
  GeneralLedger, 
  FundAllocation, 
} = require('../models');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class GeneralLedgerRepository {
  async create(data) {
    const result = await GeneralLedger.create(data);


    return result;
  }

  async findById(id) {
    const result = await GeneralLedger.findByPk(id, {
      include: [
        {
          model: FundAllocation,
          as: 'allocations',
        }
      ]
    });

    return result;
  }

  async findByQuery(query) {
    const { page, limit, ...filters } = query;
    const where = {};

    for (const [key, value] of Object.entries(filters)) {
      if (typeof value === 'string') {
        where[key] = { [Op.iLike]: `%${value}%` };
      } else {
        where[key] = value;
      }
    }

    const result = await paginationUtil.paginate(GeneralLedger, {
      where,
      include: [
        {
          model: FundAllocation,
          as: 'allocations',
        }
      ],
      page,
      limit
    });

    return result;
  }

  async updateById(id, updates) {
    const gl = await GeneralLedger.findByPk(id);
    if (!gl) return null;

    const result = await gl.update(updates);

    return result;
  }

  async deleteById(id) {
    const gl = await GeneralLedger.findByPk(id);
    if (!gl) return null;

    await gl.destroy();

    return gl;
  }
}


module.exports = new GeneralLedgerRepository();