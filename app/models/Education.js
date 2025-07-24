const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Education = sequelize.define('educations', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    page: DataTypes.STRING,
    title_en: DataTypes.STRING,
    title_es: DataTypes.STRING,
    desc_en: DataTypes.TEXT,
    desc_es: DataTypes.TEXT,
    file_en: DataTypes.STRING,
    file_es: DataTypes.STRING,
}, {
    engine: "MyISAM"
});

module.exports = Education;