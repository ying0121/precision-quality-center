const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const SurveyQuestion = sequelize.define('survey_questions', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    response_id: DataTypes.INTEGER,
    survey_id: DataTypes.INTEGER,
    language_id: DataTypes.INTEGER,
    text: DataTypes.STRING,
    choice_text: DataTypes.STRING,
    required: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    },
    status: DataTypes.TINYINT
}, {
    engine: "MyISAM"
});

module.exports = SurveyQuestion;