const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Permission = sequelize.define('permissions', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
}, {
    engine: "MyISAM"
});

module.exports = Permission;