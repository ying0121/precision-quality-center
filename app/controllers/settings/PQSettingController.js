
const pqsetting = require('../../models/settings/QPSetting');

const util_permission = require('../../utilities/permission');

const permission_name = ["SETTING_PQ"];

exports.pqsettingPage = async (req, res, next) => {
    // permission
    const _permission = 2 * 3 * 5 * 7; // create && read && update && delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    res.render('settings/pqsetting');
};

exports.createpqsetting = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newRecord = pqsetting.build({
            code: req.body.code,
            color: req.body.color,
            display: req.body.display,
            description: req.body.description,
        });

        // Save the new record to the database
        await newRecord.save()
        res.send('ok');
    } catch (error) {
        res.send(error.message)
    }
};

exports.readpqsettings = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const pqsettings = await pqsetting.findAll();
        res.json({ data: pqsettings });
    } catch (error) {
        res.send(error.message);
    }
};

exports.readOnepqsetting = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const one = await pqsetting.findOne({ where: { id: req.body.id } });
        res.json(one);
    } catch (error) {
        res.send(error.message);
    }
};

exports.updatepqsetting = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            code: req.body.code,
            color: req.body.color,
            display: req.body.display,
            description: req.body.description,
        };
        // Update the record
        numRowsAffected = await pqsetting.update(updates, {
            where: {
                id: req.body.id // Update the record with the specified ID
            }
        })
        res.send('ok');
    } catch (error) {
        res.send(error.message)
    }
};

exports.deletepqsetting = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await pqsetting.destroy({ where: { id: req.body.id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
};

exports.updatealltextcolor = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            color: req.body.color,
        };
        // Update the record
        numRowsAffected = await pqsetting.update(updates, {
            where: {}
        })
        res.send('ok');
    } catch (error) {
        res.send(error.message)
    }
}
