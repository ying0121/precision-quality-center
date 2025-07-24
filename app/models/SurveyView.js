const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const SurveyView = sequelize.define('survey_views', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    survey_id: DataTypes.INTEGER,
    completed: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    lang_id: DataTypes.INTEGER,
    view: DataTypes.TEXT,
}, {
    engine: "MyISAM"
});

module.exports = SurveyView;