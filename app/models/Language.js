const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Survey = require("./Survey");
const SurveyView = require("./SurveyView");
const SurveyResponse = require("./settings/SurveyResponse");
const SurveyQuestion = require("./settings/SurveyQuestion");
const Agreement = require('./Agreement');

const Language = sequelize.define('languages', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    code: DataTypes.STRING,
    dansk: DataTypes.STRING,
    deutsch: DataTypes.STRING,
    english: DataTypes.STRING,
    netherlands: DataTypes.STRING,
    polskie: DataTypes.STRING,
    russian: DataTypes.STRING,
    chinese: DataTypes.STRING,
}, {
    engine: "MyISAM"
});

SurveyResponse.belongsTo(Language, { foreignKey: 'lang_id' });
Survey.belongsTo(Language, { foreignKey: 'language_id' });
SurveyView.belongsTo(Language, { foreignKey: 'lang_id' });
SurveyQuestion.belongsTo(Language, { foreignKey: 'language_id' });
Agreement.belongsTo(Language, { foreignKey: 'lang_id' });

module.exports = Language;