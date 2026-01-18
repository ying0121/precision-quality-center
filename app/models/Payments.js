
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Payments = sequelize.define("payments", {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
  order_id: DataTypes.INTEGER,
  user_id: DataTypes.INTEGER,
  stripe_payment_intent_id: DataTypes.STRING(256),
  stripe_payment_method_id: DataTypes.STRING(256),
  name: DataTypes.STRING(32),
  email: DataTypes.STRING(128),
  phone: DataTypes.STRING(64),
  country: DataTypes.STRING(32),
  amount: DataTypes.FLOAT,
  currency: {
      type: DataTypes.STRING(32),
      defaultValue: 'usd',
  },
  card_last4: DataTypes.STRING(16),
  card_exp_month: DataTypes.INTEGER,
  card_exp_year: DataTypes.INTEGER,
  status: DataTypes.STRING(32),
  failure_reason: DataTypes.STRING(256),
}, {
  engine: "MyISAM"
})

module.exports = Payments;
