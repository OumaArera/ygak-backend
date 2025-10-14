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

    return result;
  }

  async findById(id) {
    const result = await Payment.findByPk(id, {
      include: [
        { model: Budget, as: 'budget' },
        { model: FundAllocation, as: 'allocation' },
        { model: User, as: 'payer', attributes: { exclude: ['password'] } }
      ]
    });

    return result;
  }

  async findByQuery(query) {
    const { page, limit, paymentDateFrom, paymentDateTo, ...filters } = query;
    const where = {};

    if (paymentDateFrom || paymentDateTo) {
      where.paymentDate = {};
      if (paymentDateFrom) where.paymentDate[Op.gte] = paymentDateFrom;
      if (paymentDateTo) where.paymentDate[Op.lte] = paymentDateTo;
    }

    const iLikeFields = ['description', 'transactionReference', 'supportingDocument'];
    
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value === 'string') {
        if (iLikeFields.includes(key)) {
          where[key] = { [Op.iLike]: `%${value}%` };
        } else {
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

    return result;
  }


  async updateById(id, updates) {
    const payment = await Payment.findByPk(id);
    if (!payment) return null;

    const result = await payment.update(updates);

    return result;
  }

  async deleteById(id) {
    const payment = await Payment.findByPk(id);
    if (!payment) return null;

    await payment.destroy();

    return payment;
  }
}

module.exports = new PaymentRepository();