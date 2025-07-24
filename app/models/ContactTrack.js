const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ContactTrack = sequelize.define('contact_tracks', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    case_number: DataTypes.INTEGER,
    clinic: DataTypes.STRING,
    type: DataTypes.INTEGER,
    reason: DataTypes.STRING,
    name: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    email: DataTypes.STRING,
    cel: DataTypes.STRING,
    subject: DataTypes.STRING,
    message: DataTypes.TEXT,
    date: DataTypes.DATE,
    assign: {
        type: DataTypes.STRING,
        defaultValue: 'Nobody'
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    priority: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    lang: DataTypes.STRING,
    besttime: DataTypes.STRING,
}, {
    engine: "MyISAM"
});

module.exports = ContactTrack;