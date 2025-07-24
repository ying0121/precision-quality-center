const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const SurveyCategory = require("../models/settings/SurveyCategory");

const EventStatus = sequelize.define('event_status', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    code: DataTypes.STRING,
    display: DataTypes.STRING,
    definition: DataTypes.TEXT,
}, {
    engine: "MyISAM"
});

SurveyCategory.belongsTo(EventStatus, { foreignKey: 'e_status' });

module.exports = EventStatus;