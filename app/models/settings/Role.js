const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Role = sequelize.define('roles', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    code: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
}, {
    engine: "MyISAM"
});

module.exports = Role;