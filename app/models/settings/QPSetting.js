const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const QPSetting = sequelize.define('qpsettings', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    code: DataTypes.STRING,
    color: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "#ffffff"
    },
    display: DataTypes.STRING,
    description: DataTypes.TEXT,
}, {
    engine: "MyISAM"
});

module.exports = QPSetting;