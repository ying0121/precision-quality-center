
const Agreement = require('../models/Agreement');
const Language = require("../models/Language");

const sequelize = require('sequelize');
const { Op, Sequelize } = require('sequelize');

const util_permission = require('../utilities/permission');

const permission_name = ["AGREEMENTS"];

exports.agreementPage = async (req, res, next) => {
    // permission
    const _permission = 2 * 3 * 5 * 7; // create && read && update && delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    res.render('agreement');
};

exports.create = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newRecord = Agreement.build({
            clinic_id: "",
            name: req.body.name,
            lang_id: req.body.lang_id,
            type: req.body.type,
            desc: req.body.desc,
            completed: req.body.completed,
            status: req.body.status,
        });

        // Save the new record to the database
        await newRecord.save()
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
};

exports.read = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const clinic_id = req.body.clinic_id
        let where = {}
        if (clinic_id != '' && clinic_id != null && clinic_id != 0) {
            const agreement = await Agreement.findAll({
                where: Sequelize.where(
                    Sequelize.fn('FIND_IN_SET', clinic_id, Sequelize.col('clinic_id')),
                    { [Op.ne]: 0 }
                ),
                include: [{
                    model: Language,
                    attributes: [[sequelize.col('english'), 'lang']],
                    required: false,
                }]
            });
            res.json({ data: agreement });
        } else {
            const agreement = await Agreement.findAll({
                include: [{
                    model: Language,
                    attributes: [[sequelize.col('english'), 'lang']],
                    required: false,
                }]
            });
            res.json({ data: agreement });
        }
    } catch (error) {
        res.send(error.message);
    }
};

exports.readOne = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const agreement = await Agreement.findOne({
            where: { id: req.body.id },
            include: [{
                model: Language,
                attributes: [[sequelize.col('english'), 'lang']],
                required: false,
            }]
        });
        res.json(agreement);
    } catch (error) {
        res.send(error.message);
    }
};

exports.update = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            name: req.body.name,
            lang_id: req.body.lang_id,
            type: req.body.type,
            desc: req.body.desc,
            completed: req.body.completed,
            status: req.body.status,
        };
        // Update the record
        numRowsAffected = await Agreement.update(updates, {
            where: {
                id: req.body.id // Update the record with the specified ID
            }
        })
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    };
};

exports.updateClinics = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            clinic_id: req.body.clinic_id,
        };
        // Update the record
        numRowsAffected = await Agreement.update(updates, {
            where: {
                id: req.body.id // Update the record with the specified ID
            }
        })
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    };
};

exports.delete = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await Agreement.destroy({ where: { id: req.body.id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
};
