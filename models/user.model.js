const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'first_name',
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'last_name',
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'phone_number',
    validate: { is: /^\+?\d{7,15}$/ },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  regNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'reg_number',
  },
  designation: {
    type: DataTypes.ENUM('Board Member', 'Secretariat', 'Chapter', 'IT'),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM(
      'Secretary',
      'Treasurer',
      'Chairman',
      'Member',
      'CEO',
      'Chapter Coordinator',
      'Superuser',
      'Manager',
      'Junior',
      'Intern'
    ),
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  isSuperUser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_super_user',
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isStaff: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_staff',
  },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
  },
});

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

User.validatePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = User;
