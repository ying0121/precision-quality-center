const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const Survey = require("../Survey");

const SurveyType = sequelize.define('survey_types', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name_en: DataTypes.STRING,
    name_es: DataTypes.STRING,
    status: DataTypes.TINYINT
}, {
    engine: "MyISAM"
});

Survey.belongsTo(SurveyType, { foreignKey: 'type_id' });

module.exports = SurveyType;