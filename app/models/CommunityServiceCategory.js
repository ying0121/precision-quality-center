const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const CommunityService = require('./CommunityService');

const CommunityServiceCategory = sequelize.define('community_service_cats', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	en_name: DataTypes.STRING,
	es_name: DataTypes.STRING,
	status: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
	}
}, {
	engine: "MyISAM"
});

module.exports = CommunityServiceCategory;