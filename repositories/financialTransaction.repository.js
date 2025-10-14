const { 
  GeneralLedger,
  FundAllocation, 
  Payment, 
  FinancialTransaction,
  Budget,
  User 
} = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');


class FinancialTransactionRepository {
  async create(data, userContext) {
    const result = await FinancialTransaction.create({
      ...data,
      processedBy: userContext.id
    });


    return result;
  }

  async findById(id) {
    const result = await FinancialTransaction.findByPk(id, {
      include: [
        { model: GeneralLedger, as: 'generalLedger' },
        { model: Budget, as: 'budget' },
        { model: Payment, as: 'payment' },
        { model: FundAllocation, as: 'allocation' },
        { model: User, as: 'processor', attributes: { exclude: ['password'] } }
      ]
    });

    return result;
  }

  async findByQuery(query) {
    const { page, limit, transactionDateFrom, transactionDateTo, ...filters } = query;
    const where = {};

    // Handle date range filtering
    if (transactionDateFrom || transactionDateTo) {
      where.transactionDate = {};
      if (transactionDateFrom) where.transactionDate[Op.gte] = transactionDateFrom;
      if (transactionDateTo) where.transactionDate[Op.lte] = transactionDateTo;
    }
    const isUUID = (val) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value === 'string' && !isUUID(value)) {
        where[key] = { [Op.iLike]: `%${value}%` };
      } else {
        where[key] = value;
      }
    }

    const result = await paginationUtil.paginate(FinancialTransaction, {
      where,
      include: [
        { model: GeneralLedger, as: 'generalLedger' },
        { model: Budget, as: 'budget' },
        { model: User, as: 'processor', attributes: { exclude: ['password'] } }
      ],
      order: [['transactionDate', 'DESC']],
      page,
      limit
    });


    return result;
  }
}

module.exports = new FinancialTransactionRepository();