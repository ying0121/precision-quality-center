
const Setting = require('../models/Setting');
const util = require('../utilities/upload');

const util_permission = require('../utilities/permission');

const permission_name = ["SETTING"];

exports.read = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const settings = await Setting.findAll();
        res.json({ data: settings });
    } catch (error) {
        res.send(error.message);
    }
};

exports.readOne = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const setting = await Setting.findOne({ where: { id: req.body.id } });
        res.json(setting);
    } catch (error) {
        res.send(error.message);
    }
};

exports.readByCodes = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    let result = {};
    try {
        for (code of req.body.code) {
            const setting = await Setting.findOne({ where: { code: code } });
            result[code] = setting ?? '';
        }
        res.json({ data: result });
    } catch (error) {
        res.send(error.message);
    }
};

exports.create = async (req, res, next) => {
    // permission
    _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newRecord = Setting.build({
            code: req.body.code,
            display: req.body.display,
            detail: req.body.detail,
        });

        // Save the new record to the database
        await newRecord.save()
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
};

exports.update = async (req, res, next) => {
    // permission
    _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            code: req.body.code,
            display: req.body.display,
            detail: req.body.detail,
        };
        // Update the record
        numRowsAffected = await Setting.update(updates, {
            where: {
                id: req.body.id // Update the record with the specified ID
            }
        })
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    };
};

exports.updateFileForImage = async (req, res, next) => {
    // permission
    _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    const destination = './public/assets/images/pq'; // Destination directory

    await util.uploadFile(req, destination, [{
        name: 'image',
        maxCount: 1
    }]).then(async savedFileNames => {
        const setting = await Setting.findOne({ where: { code: 'bg_image' } });
        if (setting && setting.display) await util.deleteOldFile(setting.display, destination);

        try {
            const updates = {
                display: savedFileNames.image,
            };
            // Update the record
            numRowsAffected = await Setting.update(updates, {
                where: {
                    code: 'bg_image' // Update the record with the specified ID
                }
            })
            console.log(numRowsAffected)
            res.status(200).send({ msg: "ok", name: savedFileNames.image });
        } catch (error) {
            res.send(error.message);
        };
    })
};

exports.updateFileForVideo = async (req, res, next) => {
    // permission
    _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    const destination = './public/assets/images/pq'; // Destination directory

    await util.uploadFile(req, destination, [{
        name: 'video',
        maxCount: 1
    }]).then(async savedFileNames => {
        const setting = await Setting.findOne({ where: { code: 'bg_video' } });
        if (setting && setting.display) await util.deleteOldFile(setting.display, destination);

        try {
            const updates = {
                display: savedFileNames.video,
            };
            // Update the record
            numRowsAffected = await Setting.update(updates, {
                where: {
                    code: 'bg_video' // Update the record with the specified ID
                }
            })
            res.status(200).send({ msg: "ok", name: savedFileNames.video });
        } catch (error) {
            res.send(error.message);
        };
    })
};

exports.updateBgStatus = async (req, res, next) => {
    // permission
    _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            display: req.body.value,
            detail: "",
        };
        // Update the record
        numRowsAffected = await Setting.update(updates, {
            where: {
                code: "bg_status"
            }
        })
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    };
};

exports.updateTextStatus = async (req, res, next) => {
    // permission
    _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            display: req.body.value,
            detail: "",
        };
        // Update the record
        numRowsAffected = await Setting.update(updates, {
            where: {
                code: "bg_text"
            }
        })
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    };
};

exports.delete = async (req, res, next) => {
    // permission
    _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await Setting.destroy({ where: { id: req.body.id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
};

exports.setBackgroundFooter = async (req, res, next) => {
    // permission
    _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        // get exist
        const r = await Setting.findOne({ where: { code: "bg_footer" } })
        if (r) {
            const row = {
                detail: req.body.value,
            };
            // Update the record
            numRowsAffected = await Setting.update(row, {
                where: {
                    code: "bg_footer"
                }
            })
        } else {
            const row = Setting.build({
                code: "bg_footer",
                display: "footer",
                detail: req.body.value,
            });
            row.save();
        }

        res.send('ok');
    } catch (error) {
        res.send(error.message);
    };
};
