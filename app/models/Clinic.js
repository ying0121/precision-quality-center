const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Agreement = require('./Agreement');

const Clinic = sequelize.define('clinics', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	clinic_id: DataTypes.INTEGER,
	name: DataTypes.STRING,
	acronym: DataTypes.STRING,
	address1: DataTypes.STRING,
	address2: DataTypes.STRING,
	city: DataTypes.STRING,
	state: DataTypes.STRING,
	zip: DataTypes.STRING,
	phone: DataTypes.STRING,
	email: DataTypes.STRING,
	web: DataTypes.STRING,
	portal: DataTypes.STRING,
}, {
	engine: "MyISAM"
});

module.exports = Clinic;