const sequelize = require('../config/sequelize');
const User = require('./user.model');
const Token = require('./token.model');
const Institution = require('./institution.model');
const ActivityTracker = require('./activityTracker.model');
const Volunteer = require('./volunteer.model');

User.hasMany(Token, { foreignKey: 'userId', as: 'tokens' });
Token.belongsTo(User, { foreignKey: 'userId', as: 'users' });

User.hasMany(ActivityTracker, { foreignKey: 'userId', as: 'activity_trackers' });
ActivityTracker.belongsTo(User, { foreignKey: 'userId', as: 'users' });

Institution.hasMany(Volunteer, { foreignKey: 'institutionId', as: 'volunteers' });
Volunteer.belongsTo(Institution, { foreignKey: 'institutionId', as: 'institution' });

module.exports = {
  sequelize,
  User,
  Token,
  Institution,
  ActivityTracker,
  Volunteer 
};