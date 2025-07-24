const ContactTrack = require('../models/ContactTrack');

const util_permission = require('../utilities/permission');

const permission_name = ["CONTACT_RECORDS"];

exports.dashboardPage = async (req, res, next) => {
    const user = req.session.user;
    if (user === undefined) {
        res.render('dashboard');
    } else {
        res.render('dashboard', { user: user });
    }
};

exports.read = async (req, res, next) => {
    // // permission
    // _permission = 3; // read
    // const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    // if (!_status) return res.status(403).send("")

    try {
        const contact_tracks = await ContactTrack.findAll();
        res.json({ data: contact_tracks });
    } catch (error) {
        res.send(error.message);
    }
};

exports.readOne = async (req, res, next) => {
    // // permission
    // _permission = 3; // read
    // const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    // if (!_status) return res.status(403).send("")

    try {
        const contact_track = await ContactTrack.findOne({ where: { id: req.body.id } });
        res.json(contact_track);
    } catch (error) {
        res.send(error.message);
    }
};

exports.delete = async (req, res, next) => {
    // // permission
    // _permission = 7; // delete
    // const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    // if (!_status) return res.status(403).send("")

    try {
        await ContactTrack.destroy({ where: { id: req.body.id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
};
