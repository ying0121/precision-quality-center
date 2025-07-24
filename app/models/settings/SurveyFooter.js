const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const SurveyFooter = sequelize.define('survey_footer', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    lang_id: DataTypes.INTEGER,
    footer: DataTypes.TEXT
}, {
    engine: "MyISAM"
});

module.exports = SurveyFooter;