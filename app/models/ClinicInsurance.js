const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Clinic = require('./Clinic');
const Insurance = require('./Insurance');

const ClinicInsurance = sequelize.define('clinic_insurance', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    clinic_id: DataTypes.INTEGER,
    insurance_id: DataTypes.INTEGER,
    pt_portal_repid: DataTypes.INTEGER,
    pcp_portal_repid: DataTypes.INTEGER,
    pt_eligib_repid: DataTypes.INTEGER,
    hedis_repid: DataTypes.INTEGER,
    coverage_repid: DataTypes.INTEGER
}, {
    engine: "MyISAM"
});

ClinicInsurance.belongsTo(Clinic, { foreignKey: 'clinic_id' });
ClinicInsurance.belongsTo(Insurance, { foreignKey: 'insurance_id' });

module.exports = ClinicInsurance;