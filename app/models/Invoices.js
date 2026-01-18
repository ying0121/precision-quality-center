const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Invoices= sequelize.define("invoices", {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
  stripe_invoice_id: DataTypes.STRING(256),
  stripe_payment_intent_id: DataTypes.STRING(256),
  stripe_payment_method_id: DataTypes.STRING(256),
  order_id: DataTypes.INTEGER,
  user_id: DataTypes.INTEGER,
  amount: DataTypes.FLOAT,
  customer_email: DataTypes.STRING(128),
  card_last4: DataTypes.STRING(16),
  currency: DataTypes.STRING(32),
  status: DataTypes.STRING(32),
  invoice_pdf: DataTypes.STRING(256),
}, {
  engine: "MyISAM"
})

module.exports = Invoices;
