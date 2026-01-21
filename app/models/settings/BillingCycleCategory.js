
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const BillingCycleCategory = sequelize.define('billing_cycle_categories', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  category_code: {
    type: DataTypes.STRING(50),
    unique: true
  },
  category_name: {
    type: DataTypes.STRING(100),
  },
  description: {
    type: DataTypes.STRING(255),
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, {
  engine: "MyISAM",
});

module.exports = BillingCycleCategory;
