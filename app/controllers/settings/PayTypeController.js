
const PayType = require('../../models/settings/PayType');
const util_permission = require('../../utilities/permission');

const permission_name = ["SETTING_PAY_TYPE"];

exports.payTypePage = async (req, res, next) => {
    // permission
    const _permission = 2 * 3 * 5 * 7; // create && read && update && delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    res.render('settings/pay_type');
};

exports.readPayTypes = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const payTypes = await PayType.findAll({ order: [['type_name', 'ASC']] });
        res.status(200).json({ data: payTypes });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.createPayType = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newRecord = PayType.build({
            type_code: req.body.type_code,
            type_name: req.body.type_name,
            description: req.body.description,
            status: req.body.status,
        });

        await newRecord.save();
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.updatePayType = async (req, res, next) => {
    // permission
    const _permission = 5; // update
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            type_code: req.body.type_code,
            type_name: req.body.type_name,
            description: req.body.description,
            status: req.body.status,
        };
        
        await PayType.update(updates, { where: { id: req.body.id } });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.deletePayType = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await PayType.destroy({ where: { id: req.body.id } });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
