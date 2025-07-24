const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Setting = sequelize.define('settings', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    code: DataTypes.STRING,
    display: DataTypes.STRING,
    detail: DataTypes.TEXT,
}, {
    engine: "MyISAM"
});

module.exports = Setting;