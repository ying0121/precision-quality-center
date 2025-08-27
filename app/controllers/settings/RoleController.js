
const { permission } = require('process');
const Role = require('../../models/settings/Role');
const RolePermission = require('../../models/settings/RolePermission');

const util_permission = require('../../utilities/permission');

const permission_name = ["SETTING_ROLE"];

exports.rolePage = async (req, res, next) => {
    // permission
    const _permission = 2 * 3 * 5 * 7; // create && read && update && delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    res.render('settings/role');
};

exports.addRole = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newRole = Role.build({
            code: req.body.code,
            name: req.body.name,
            description: req.body.description
        })
        await newRole.save();
        res.send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.readRole = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const roles = await Role.findAll();
        res.json({ data: roles });
    } catch (error) {
        res.send(error.message);
    }
}

exports.readOneRole = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        // read role information
        const role = await Role.findOne({ where: { id: req.body.id } });

        // read the permission for the role
        const role_permission = await RolePermission.findAll({ where: { role_id: req.body.id } })

        res.json({ role: role, role_permission: role_permission });
    } catch (error) {
        res.send(error.message);
    }
}

exports.updateRole = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            code: req.body.code,
            name: req.body.name,
            description: req.body.description
        }
        // update role code, name and description
        await Role.update(updates, { where: { id: req.body.id } })

        // delete already existed
        await RolePermission.destroy({ where: { role_id: req.body.id } });
        // update role permission
        const role_permission = req.body.role_permission
        const _news = []
        for (var permission_id in role_permission) {
            if (role_permission[permission_id] && role_permission[permission_id] > 0) {
                _news.push({
                    role_id: req.body.id,
                    permission_id: permission_id,
                    value: role_permission[permission_id]
                })
            }
        }
        RolePermission.bulkCreate(_news)

        res.status(200).send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.deleteRole = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await Role.destroy({ where: { id: req.body.id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
}