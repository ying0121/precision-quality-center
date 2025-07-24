
const SecurityQuestion = require('../../models/settings/SecurityQuestion');

const util_permission = require('../../utilities/permission');

const permission_name = ["SETTING_SECURITY_QUESTION"];

exports.security_questionPage = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    res.render('settings/security_question');
};

exports.add = async (req, res, next) => {
    // permission
    _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newSecurityQuestion = SecurityQuestion.build({
            question: req.body.question,
            status: req.body.status
        })
        await newSecurityQuestion.save();
        res.send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.read = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const security_question = await SecurityQuestion.findAll();
        res.json({ data: security_question });
    } catch (error) {
        res.send(error.message);
    }
}

exports.readOne = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        // read SecurityQuestion information
        const security_question = await SecurityQuestion.findOne({ where: { id: req.body.id } });

        res.json({ data: security_question });
    } catch (error) {
        res.send(error.message);
    }
}

exports.update = async (req, res, next) => {
    // permission
    _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            question: req.body.question,
            status: req.body.status
        }
        // update SecurityQuestion code, name and description
        await SecurityQuestion.update(updates, { where: { id: req.body.id } })
        res.status(200).send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.delete = async (req, res, next) => {
    // permission
    _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await SecurityQuestion.destroy({ where: { id: req.body.id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
}