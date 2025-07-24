const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const SurveyExpiration = sequelize.define('survey_expirations', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    expired_id: DataTypes.STRING,
    route: DataTypes.TEXT,
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
}, {
    engine: "MyISAM"
});

module.exports = SurveyExpiration;