const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./User');
const Clinic = require('./Clinic');

const Ticket = sequelize.define('tickets', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    clinic_id: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    reason: DataTypes.TEXT,
    message: DataTypes.TEXT,
    assigned_to: DataTypes.INTEGER,
    backup_assigned: DataTypes.INTEGER,
    priority: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
}, {
    engine: "MyISAM"
});

Ticket.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Ticket.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedUser' });
Ticket.belongsTo(User, { foreignKey: 'backup_assigned', as: 'backupAssignedUser' });
Ticket.belongsTo(Clinic, { foreignKey: 'clinic_id' });
module.exports = Ticket;