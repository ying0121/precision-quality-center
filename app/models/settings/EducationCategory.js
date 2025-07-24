const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const EducationCategory = sequelize.define('education_category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    parent_menu: DataTypes.STRING,
    text_en: DataTypes.STRING,
    text_es: DataTypes.STRING,
    status: DataTypes.TINYINT
}, {
    engine: "MyISAM"
});

module.exports = EducationCategory;