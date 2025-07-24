const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const SecurityQuestion = sequelize.define('security_questions', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    question: DataTypes.TEXT,
    status: DataTypes.TINYINT,
}, {
    engine: "MyISAM"
});

module.exports = SecurityQuestion;