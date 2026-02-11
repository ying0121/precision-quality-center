
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ProductService = sequelize.define('product_services', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('product', 'service'),
    allowNull: false
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  short_description: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  long_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  currency: {
    type: DataTypes.CHAR(3),
    defaultValue: 'USD'
  },
  is_subscription: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  pay_type_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  payment_cycle_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  billing_cycle_category_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  discount_type: {
    type: DataTypes.ENUM('none', 'percentage', 'fixed'),
    defaultValue: 'none'
  },
  discount_value: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  tax_required: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'draft'),
    defaultValue: 'active'
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  videos: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  engine: 'MyISAM',
  timestamps: true
});

const ProductCategory = require('./settings/ProductCategory');
const PayType = require('./settings/PayType');
const PaymentCycle = require('./settings/PaymentCycle');
const BillingCycleCategory = require('./settings/BillingCycleCategory');

ProductService.belongsTo(ProductCategory, { foreignKey: 'category_id' });
ProductService.belongsTo(PayType, { foreignKey: 'pay_type_id' });
ProductService.belongsTo(PaymentCycle, { foreignKey: 'payment_cycle_id' });
ProductService.belongsTo(BillingCycleCategory, { foreignKey: 'billing_cycle_category_id' });

module.exports = ProductService;
