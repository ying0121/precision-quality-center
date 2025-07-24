const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const SurveyQuestion = require("./settings/SurveyQuestion");
const SurveyView = require('./SurveyView');

const Survey = sequelize.define('surveys', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    language_id: DataTypes.INTEGER,
    cate_id: DataTypes.INTEGER,
    type_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    desc: DataTypes.TEXT,
    page_length: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    status: DataTypes.TINYINT
}, {
    engine: "MyISAM"
});

SurveyView.belongsTo(Survey, { foreignKey: 'survey_id' });
SurveyQuestion.belongsTo(Survey, { foreignKey: 'survey_id' });

module.exports = Survey;