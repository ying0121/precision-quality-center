const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Agreement = sequelize.define('agreements', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    clinic_id: DataTypes.TEXT,
    name: DataTypes.STRING,
    lang_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    desc: DataTypes.TEXT,
    completed: DataTypes.TINYINT,
    status: DataTypes.TINYINT
}, {
    engine: "MyISAM"
});

module.exports = Agreement;