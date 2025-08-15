const { 
  FundAllocation, 
  Payment, 
  Budget,
  User 
} = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class PaymentRepository {
  async create(data, userContext) {
    const result = await Payment.create({
      ...data,
      paidBy: userContext.id
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Payment",
      action: 'CREATE',
      description: `Created payment of ${data.paymentAmount} for budget ${data.budgetId}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async findById(id, userContext) {
    const result = await Payment.findByPk(id, {
      include: [
        { model: Budget, as: 'budget' },
        { model: FundAllocation, as: 'allocation' },
        { model: User, as: 'payer', attributes: { exclude: ['password'] } }
      ]
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Payment",
      action: 'GET',
      description: `Fetched payment with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async findByQuery(query, userContext) {
    const { page, limit, paymentDateFrom, paymentDateTo, ...filters } = query;
    const where = {};

    // Handle date range filtering
    if (paymentDateFrom || paymentDateTo) {
      where.paymentDate = {};
      if (paymentDateFrom) where.paymentDate[Op.gte] = paymentDateFrom;
      if (paymentDateTo) where.paymentDate[Op.lte] = paymentDateTo;
    }

    // Define which fields are safe for iLike
    const iLikeFields = ['description', 'transactionReference', 'supportingDocument'];
    
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value === 'string') {
        if (iLikeFields.includes(key)) {
          where[key] = { [Op.iLike]: `%${value}%` };
        } else {
          // Exact match for non-text fields (enums, UUIDs, etc.)
          where[key] = value;
        }
      } else {
        where[key] = value;
      }
    }

    const result = await paginationUtil.paginate(Payment, {
      where,
      include: [
        { model: Budget, as: 'budget' },
        { model: FundAllocation, as: 'allocation' },
        { model: User, as: 'payer', attributes: { exclude: ['password'] } }
      ],
      page,
      limit
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Payment",
      action: 'GET',
      description: `Queried payments with params: ${JSON.stringify(query)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }


  async updateById(id, updates, userContext) {
    const payment = await Payment.findByPk(id);
    if (!payment) return null;

    const result = await payment.update(updates);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Payment",
      action: 'UPDATE',
      description: `Updated payment ${id}: ${JSON.stringify(updates)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async deleteById(id, userContext) {
    const payment = await Payment.findByPk(id);
    if (!payment) return null;

    await payment.destroy();

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Payment",
      action: 'DELETE',
      description: `Deleted payment with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return payment;
  }
}

module.exports = new PaymentRepository();