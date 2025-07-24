const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Insurance = sequelize.define('insurances', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    fax: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    status: DataTypes.TINYINT,
    img: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "empty-img.jpg"
    }
}, {
    engine: "MyISAM"
});

module.exports = Insurance;