const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const SurveyQuestionType = sequelize.define('survey_ques_types', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    code: DataTypes.STRING,
    display_en: DataTypes.STRING,
    display_es: DataTypes.STRING,
    type: DataTypes.STRING,
    field_value: DataTypes.TEXT,
}, {
    engine: "MyISAM"
});

module.exports = SurveyQuestionType;