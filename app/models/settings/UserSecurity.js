const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const UserSecurity = sequelize.define('user_security', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    question_id: DataTypes.INTEGER,
    answer: DataTypes.STRING,
}, {
    engine: "MyISAM"
});

module.exports = UserSecurity;