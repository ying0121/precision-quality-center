const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const CommunityService = sequelize.define('community_services', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	category: {
		type: DataTypes.STRING,
		defaultValue: "[]"
	},
	en_name: DataTypes.STRING,
	es_name: DataTypes.STRING,
	image: {
		type: DataTypes.STRING,
		defaultValue: 'default.jpg'
	},

	address_1: DataTypes.STRING,
	address_2: DataTypes.STRING,
	city: DataTypes.STRING,
	state: DataTypes.STRING,
	zip: DataTypes.STRING,
	country: DataTypes.STRING,
	phone: DataTypes.STRING,
	email: DataTypes.STRING,
	fax: DataTypes.STRING,
	link: DataTypes.STRING,

	en_desc: DataTypes.TEXT,
	es_desc: DataTypes.TEXT,

	en_detail: DataTypes.TEXT,
	es_detail: DataTypes.TEXT,
	additional: DataTypes.TEXT,
	clinic_allowance: {
		type: DataTypes.STRING,
		defaultValue: "[]"
	},
	status: {
		type: DataTypes.INTEGER,
		defaultValue: 1
	}
}, {
	engine: "MyISAM"
});

module.exports = CommunityService;