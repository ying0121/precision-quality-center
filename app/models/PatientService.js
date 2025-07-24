const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const PatientService = sequelize.define('patient_services', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	category_id: DataTypes.INTEGER,
	en_name: DataTypes.STRING,
	es_name: DataTypes.STRING,
	image: {
		type: DataTypes.STRING,
		defaultValue: 'default.jpg'
	},
	en_desc: DataTypes.TEXT,
	es_desc: DataTypes.TEXT,
	en_detail: DataTypes.TEXT,
	es_detail: DataTypes.TEXT,
	contact: DataTypes.TEXT,
	status: {
		type: DataTypes.INTEGER,
		defaultValue: 1
	}
}, {
	engine: "MyISAM"
});

module.exports = PatientService;