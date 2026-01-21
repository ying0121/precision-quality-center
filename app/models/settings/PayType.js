
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const PayType = sequelize.define('pay_types', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  type_code: {
    type: DataTypes.STRING(50),
    unique: true
  },
  type_name: {
    type: DataTypes.STRING(100),
  },
  description: {
    type: DataTypes.STRING(255),
  },
  is_service: {
    type: DataTypes.TINYINT(1),
    defaultValue: 0
  },
  is_product: {
    type: DataTypes.TINYINT(1),
    defaultValue: 0
  },
  is_subscription: {
    type: DataTypes.TINYINT(1),
    defaultValue: 0
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, {
  engine: "MyISAM",
  timestamps: true
});

module.exports = PayType;
