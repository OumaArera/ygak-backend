const User = require('../models/user.model');
const { Op } = require('sequelize');

async function generateRegistrationNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  // Prefix for the search
  const prefix = `YGAK/${year}/${month}/`;

  // Find the latest user with matching year/month
  const latestUser = await User.findOne({
    where: {
      regNumber: { [Op.like]: `${prefix}%` }
    },
    order: [['regNumber', 'DESC']]
  });

  let nextNumber = 1;
  if (latestUser) {
    const lastRegNumber = latestUser.regNumber;
    const lastNumberPart = parseInt(lastRegNumber.split('/').pop(), 10);
    nextNumber = lastNumberPart + 1;
  }

  const regNumber = `${prefix}${String(nextNumber).padStart(2, '0')}`;
  return regNumber;
}

module.exports = generateRegistrationNumber;
