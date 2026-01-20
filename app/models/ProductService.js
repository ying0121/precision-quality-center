
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const ProductCategory = require('./ProductCategory');

const ProductService = sequelize.define("product_services", {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(256),
    allowNull: false,
    defaultValue: ''
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING(256),
    allowNull: true,
    defaultValue: null
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.00
  },
  billing_type: {
    type: DataTypes.STRING(32),
    allowNull: false,
    defaultValue: 'one_time'
  },
  recurring_interval: {
    type: DataTypes.STRING(32),
    allowNull: true,
    defaultValue: 'month'
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  usage_limit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1
  }
}, {
  engine: "MyISAM"
})

ProductService.belongsTo(ProductCategory, { foreignKey: 'category_id' });

module.exports = ProductService;
