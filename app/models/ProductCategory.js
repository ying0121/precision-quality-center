
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ProductCategory = sequelize.define('product_categories', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(256),
    defaultValue: ''
  },
  description: {
    type: DataTypes.TEXT,
  },
  type: {
    type: DataTypes.STRING(32),
    defaultValue: 'service'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, {
  engine: "MyISAM"
});

module.exports = ProductCategory;
