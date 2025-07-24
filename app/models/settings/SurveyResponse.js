const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const SurveyResponse = sequelize.define('survey_responses', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    key: DataTypes.STRING,
    lang_id: DataTypes.INTEGER,
    items: DataTypes.TEXT,
    status: DataTypes.TINYINT,
    required: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    },
}, {
    engine: "MyISAM"
});

module.exports = SurveyResponse;