const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const SurveyFeedback = sequelize.define('survey_feedbacks', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    ques_id: DataTypes.INTEGER,
    resp_id: DataTypes.INTEGER,
    resp_type: DataTypes.STRING,
    response: DataTypes.TEXT
}, {
    engine: "MyISAM"
});

module.exports = SurveyFeedback;