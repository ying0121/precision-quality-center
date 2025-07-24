
const Permission = require('../../models/settings/Permission');
const RolePermission = require('../../models/settings/RolePermission');

const util_permission = require('../../utilities/permission');

const permission_name = ["SETTING_PERMISSION"];

exports.permissionPage = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    res.render('settings/permission');
};

exports.addPermission = async (req, res, next) => {
    // permission
    _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newPermission = Permission.build({
            name: req.body.name,
            description: req.body.description
        })
        await newPermission.save();
        res.send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.readPermission = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const permissions = await Permission.findAll();
        res.json({ data: permissions });
    } catch (error) {
        res.send(error.message);
    }
}

exports.readOnePermission = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const permission = await Permission.findOne({ where: { id: req.body.id } });
        res.json(permission);
    } catch (error) {
        res.send(error.message);
    }
}

exports.updatePermission = async (req, res, next) => {
    // permission
    _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            name: req.body.name,
            description: req.body.description
        }
        await Permission.update(updates, {
            where: {
                id: req.body.id
            }
        })
        res.send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.deletePermission = async (req, res, next) => {
    // permission
    _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await Permission.destroy({ where: { id: req.body.id } });
        await RolePermission.destroy({ where: { permission_id: req.body.id } })
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
}