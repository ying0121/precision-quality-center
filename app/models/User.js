const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Role = require('./settings/Role');

const User = sequelize.define('users', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	fname: DataTypes.STRING,
	lname: DataTypes.STRING,
	email: {
		type: DataTypes.STRING,
		allowNull: false
	},
	phone: DataTypes.STRING,
	fax: DataTypes.STRING,
	address: DataTypes.STRING,
	city: DataTypes.STRING,
	state: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: "NY"
	},
	zip: DataTypes.STRING,
	role_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 1
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	status: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0
	},
	resetToken: {
		type: DataTypes.STRING,
		allowNull: true
	},
	resetTokenExpiry: {
		type: DataTypes.DATE,
		allowNull: true
	},
	clinics: DataTypes.TEXT,
}, {
	indexes: [
		// Create a unique index on email
		{
			unique: true,
			fields: ['email']
		}],
	engine: "MyISAM"
});

User.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = User;