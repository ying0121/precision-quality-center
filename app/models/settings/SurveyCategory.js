const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const Survey = require("../Survey");

const SurveyCategory = sequelize.define('survey_categories', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name_en: DataTypes.STRING,
    name_es: DataTypes.STRING,
    e_status: DataTypes.INTEGER,
    status: DataTypes.TINYINT
}, {
    engine: "MyISAM"
});

Survey.belongsTo(SurveyCategory, { foreignKey: 'cate_id' });

module.exports = SurveyCategory;