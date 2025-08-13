const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Institution = require('./institution.model');

const Volunteer = sequelize.define('Volunteer', {
  // Primary key
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  // Personal information
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  otherNames: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sex: {
    type: DataTypes.ENUM('Male', 'Female'),
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isUnder16(value) {
        const today = new Date();
        const dob = new Date(value);
        const age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        if (age < 16) {
          throw new Error('Volunteer must be at least 16 years old.');
        }
      }
    }
  },

  // Contact information
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },

  // Next of Kin
  nextOfKinName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nextOfKinPhoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nextOfKinEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },

  // Education / Student details
  isStudent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  institutionId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Institution,
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  schoolRegNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Non-student identification
  identificationNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Registration details
  regNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  // Location
  countyOfResidence: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subCountyOfResidence: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // Status
  isApproved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isExpelled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isSuspended: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }

}, {
  tableName: 'volunteers',
  timestamps: true
});

module.exports = Volunteer;
