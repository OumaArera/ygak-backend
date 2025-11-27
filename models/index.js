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
const FundAllocation = require('./fundAllocation.model');
const GeneralLedger = require('./generalLedger.model');
const Payment = require('./payment.model');
const FundRequest = require('./fundRequest.model');
const FundReallocation = require('./fundReallocation.model');
const FinancialTransaction = require('./financialTransaction.model');
const Project = require('./project.model');
const AssetRequest = require('./assetRequest.model');
const Inventory = require('./inventory.model');
const Event = require('./event.model');
const EventMedia = require('./eventMedia.model');
const Donation = require('./donation.model');
const UpcomingProject = require('./upcomingProject.model');
const ResourceLibrary = require('./resourceLibrary.model');
const Blog = require('./blog.model');
const Newsletter = require('./newsletter.model');
const EventRegister = require('./eventRegister.model');
const Contact = require('./contact.model');


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

// Fund Request relationships
FundRequest.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
FundRequest.belongsTo(Budget, { foreignKey: 'budgetId', as: 'budget' });
FundRequest.belongsTo(GeneralLedger, { foreignKey: 'glId', as: 'generalLedger' });

Budget.hasMany(FundRequest, { foreignKey: 'budgetId', as: 'fundRequests' });
GeneralLedger.hasMany(FundRequest, { foreignKey: 'glId', as: 'fundRequests' });

// Fund Allocation relationships
FundAllocation.belongsTo(FundRequest, { foreignKey: 'fundRequestId', as: 'fundRequest' });
FundAllocation.belongsTo(Budget, { foreignKey: 'budgetId', as: 'budget' });
FundAllocation.belongsTo(GeneralLedger, { foreignKey: 'glId', as: 'generalLedger' });
FundAllocation.belongsTo(User, { foreignKey: 'allocatedBy', as: 'allocator' });

FundRequest.hasOne(FundAllocation, { foreignKey: 'fundRequestId', as: 'allocation' });
Budget.hasMany(FundAllocation, { foreignKey: 'budgetId', as: 'allocations' });
GeneralLedger.hasMany(FundAllocation, { foreignKey: 'glId', as: 'allocations' });

// Fund Reallocation relationships
FundReallocation.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
FundReallocation.belongsTo(FundAllocation, { foreignKey: 'fromAllocationId', as: 'fromAllocation' });
FundReallocation.belongsTo(Budget, { foreignKey: 'toBudgetId', as: 'toBudget' });

FundAllocation.hasMany(FundReallocation, { foreignKey: 'fromAllocationId', as: 'reallocationsFrom' });
Budget.hasMany(FundReallocation, { foreignKey: 'toBudgetId', as: 'reallocationsTo' });

// Payment relationships
Payment.belongsTo(Budget, { foreignKey: 'budgetId', as: 'budget' });
Payment.belongsTo(FundAllocation, { foreignKey: 'allocationId', as: 'allocation' });
Payment.belongsTo(User, { foreignKey: 'paidBy', as: 'payer' });

Budget.hasMany(Payment, { foreignKey: 'budgetId', as: 'payments' });
FundAllocation.hasMany(Payment, { foreignKey: 'allocationId', as: 'payments' });

// Financial Transaction relationships
FinancialTransaction.belongsTo(GeneralLedger, { foreignKey: 'glId', as: 'generalLedger' });
FinancialTransaction.belongsTo(Budget, { foreignKey: 'budgetId', as: 'budget' });
FinancialTransaction.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });
FinancialTransaction.belongsTo(FundAllocation, { foreignKey: 'allocationId', as: 'allocation' });
FinancialTransaction.belongsTo(User, { foreignKey: 'processedBy', as: 'processor' });

GeneralLedger.hasMany(FinancialTransaction, { foreignKey: 'glId', as: 'transactions' });
Budget.hasMany(FinancialTransaction, { foreignKey: 'budgetId', as: 'transactions' });
Payment.hasMany(FinancialTransaction, { foreignKey: 'paymentId', as: 'transactions' });
FundAllocation.hasMany(FinancialTransaction, { foreignKey: 'allocationId', as: 'transactions' });

Project.belongsTo(User, { foreignKey: 'maker', as: 'creator',});
User.hasMany(Project, { foreignKey: 'maker', as: 'projects',});

Project.belongsTo(Budget, { foreignKey: 'budgetId', as: 'budget',});
Budget.hasOne(Project, { foreignKey: 'budgetId', as: 'projects',});

AssetRequest.belongsTo(User, { foreignKey: 'requestedBy', as: 'requester' });
User.hasMany(AssetRequest, { foreignKey: 'requestedBy', as: 'users' });

AssetRequest.belongsTo(Budget, { foreignKey: 'budgetId', as: 'budget' });
Budget.hasOne(AssetRequest, { foreignKey: 'budgetId', as: 'budget' });

Inventory.belongsTo(User, { foreignKey: 'currentUserId', as: 'currentUser' });
User.hasMany(Inventory, {foreignKey: "currentUserId", as: "inventories"});

Event.hasOne(EventMedia, { foreignKey: 'eventId', as: 'media' });
EventMedia.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

Event.hasMany(EventRegister, { foreignKey: 'eventId', as: 'registrations' });
EventRegister.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });



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
  Meeting,
  GeneralLedger,
  FundRequest,
  FundAllocation,
  FundReallocation,
  Payment,
  FinancialTransaction,
  Project,
  AssetRequest,
  Inventory,
  Event,
  EventMedia,
  EventRegister,
  Donation,
  UpcomingProject,
  ResourceLibrary,
  Blog,
  Newsletter,
  Contact
};
