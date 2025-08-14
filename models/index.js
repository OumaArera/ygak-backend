const sequelize = require('../config/sequelize');
const User = require('./user.model');
const Token = require('./token.model');
const Institution = require('./institution.model');
const ActivityTracker = require('./activityTracker.model');
const Volunteer = require('./volunteer.model');
const Budget = require('./budget.model');
const Report = require('./report.model');
const Task = require('./task.model');
const Meeting = require('./meeting.model');

User.hasMany(Token, { foreignKey: 'userId', as: 'tokens' });
Token.belongsTo(User, { foreignKey: 'userId', as: 'users' });

User.hasMany(ActivityTracker, { foreignKey: 'userId', as: 'activity_trackers' });
ActivityTracker.belongsTo(User, { foreignKey: 'userId', as: 'users' });

Institution.hasMany(Volunteer, { foreignKey: 'institutionId', as: 'volunteers' });
Volunteer.belongsTo(Institution, { foreignKey: 'institutionId', as: 'institution' });

User.hasMany(Budget, { foreignKey: 'userId', as: 'budgets' });
Budget.belongsTo(User, { foreignKey: 'userId', as: 'requestee' });

User.hasMany(Report, { foreignKey: 'userId', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'userId', as: 'reportee' });

Budget.hasMany(Report, { foreignKey: 'budgetId', as: 'reports' });
Report.belongsTo(Budget, { foreignKey: 'budgetId', as: 'budget' });

Task.hasMany(Report, { foreignKey: 'taskId', as: 'reports' });
Report.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

User.hasMany(Task, { foreignKey: 'assignedTo', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });

module.exports = {
  sequelize,
  User,
  Token,
  Institution,
  ActivityTracker,
  Volunteer,
  Budget,
  Report,
  Task,
  Meeting
};