const sequelize = require('../config/sequelize');
const User = require('./user.model');
const Token = require('./token.model');

User.hasMany(Token, { foreignKey: 'userId', as: 'tokens' });
Token.belongsTo(User, { foreignKey: 'userId', as: 'users' });


module.exports = {
  sequelize,
  User,
  Token,
};