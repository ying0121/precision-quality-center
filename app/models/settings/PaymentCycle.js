
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const BillingCycleCategory = require('./BillingCycleCategory');

const PaymentCycle = sequelize.define('payment_cycles', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  category_id: {
    type: DataTypes.INTEGER,
  },
  cycle_code: {
    type: DataTypes.STRING(50),
    unique: true
  },
  cycle_name: {
    type: DataTypes.STRING(100),
  },
  interval_value: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  interval_unit: {
    type: DataTypes.STRING(32),
    allowNull: true
  },
  is_recurring: {
    type: DataTypes.TINYINT(1),
    defaultValue: 1
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, {
  engine: "MyISAM",
});

PaymentCycle.belongsTo(BillingCycleCategory, { foreignKey: 'category_id' });

module.exports = PaymentCycle;
