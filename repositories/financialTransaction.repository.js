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

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FinancialTransaction",
      action: 'CREATE',
      description: `Created financial transaction: ${data.transactionType}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async findById(id, userContext) {
    const result = await FinancialTransaction.findByPk(id, {
      include: [
        { model: GeneralLedger, as: 'generalLedger' },
        { model: Budget, as: 'budget' },
        { model: Payment, as: 'payment' },
        { model: FundAllocation, as: 'allocation' },
        { model: User, as: 'processor', attributes: { exclude: ['password'] } }
      ]
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FinancialTransaction",
      action: 'GET',
      description: `Fetched financial transaction with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async findByQuery(query, userContext) {
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

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FinancialTransaction",
      action: 'GET',
      description: `Queried financial transactions with params: ${JSON.stringify(query)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }
}

module.exports = new FinancialTransactionRepository();