
const axios = require("axios")
const Education = require('../models/Education');
const util = require('../utilities/upload');

const util_permission = require('../utilities/permission');

const permission_name = ["EDUCATION"];

exports.educationPage = async (req, res, next) => {
    // permission
    const _permission = 2 * 3 * 5 * 7; // create && read && update && delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    res.render('education');
};

exports.createEducation = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    const destination = './public/assets/images/educations'; // Destination directory
    // Upload files
    await util.uploadFile(req, destination, [{
        name: 'file_en', maxCount: 1
    }, {
        name: 'file_es', maxCount: 1
    }]).then(async savedFileNames => {
        const education = await Education.findOne({ where: { id: req.body.id } });
        if (education && education.file_en) await util.deleteOldFile(education.file_en, destination);
        if (education && education.file_es) await util.deleteOldFile(education.file_es, destination);
        try {
            const newRecord = Education.build({
                page: req.body.page,
                title_en: req.body.title_en,
                title_es: req.body.title_es,
                desc_en: req.body.desc_en,
                desc_es: req.body.desc_es,
                file_en: savedFileNames['file_en'],
                file_es: savedFileNames['file_es'],
            });

            // Save the new record to the database
            await newRecord.save()
            res.send('ok');
        } catch (error) {
            res.send(error.message);
        }
    })
};

exports.readEducations = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const educations = await Education.findAll();
        res.json({ data: educations });
    } catch (error) {
        res.send(error.message);
    }
};

exports.readOneEducation = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const education = await Education.findOne({ where: { id: req.body.id } });
        res.json(education);
    } catch (error) {
        res.send(error.message);
    }
};

exports.updateEducation = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    const destination = './public/assets/images/educations'; // Destination directory
    // Upload files
    await util.uploadFile(req, destination, [{
        name: 'file_en', maxCount: 1
    }, {
        name: 'file_es', maxCount: 1
    }]).then(async savedFileNames => {
        const education = await Education.findOne({ where: { id: req.body.id } });
        if (education && education.file_en) await util.deleteOldFile(education.file_en, destination);
        if (education && education.file_es) await util.deleteOldFile(education.file_es, destination);
        try {
            const updates = {
                page: req.body.page,
                title_en: req.body.title_en,
                title_es: req.body.title_es,
                desc_en: req.body.desc_en,
                desc_es: req.body.desc_es,
                file_en: req.body.file_en,
                file_es: req.body.file_es,
            };
            // Update the record
            numRowsAffected = await Education.update(updates, {
                where: {
                    id: req.body.id // Update the record with the specified ID
                }
            })
            res.send('ok');
        } catch (error) {
            res.send(error.message);
        };
    })
};

exports.deleteEducation = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    const destination = './public/assets/images/educations'; // Destination directory
    try {
        const education = await Education.findOne({ where: { id: req.body.id } });
        console.log(education.dataValues)
        if (education && education.dataValues.file_en) await util.deleteOldFile(education.dataValues.file_en, destination);
        if (education && education.dataValues.file_es) await util.deleteOldFile(education.dataValues.file_es, destination);

        await Education.destroy({ where: { id: req.body.id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
};
