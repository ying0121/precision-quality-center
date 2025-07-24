const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const Permission = require('./Permission');

const RolePermission = sequelize.define('role_permissions', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    role_id: DataTypes.INTEGER,
    permission_id: DataTypes.INTEGER,
    value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
}, {
    engine: "MyISAM"
});

RolePermission.belongsTo(Permission, { foreignKey: 'permission_id' })

module.exports = RolePermission;