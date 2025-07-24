
const EducationCategory = require('../../models/settings/EducationCategory');

const util_permission = require('../../utilities/permission');

const permission_name = ["SETTING_EDUCATION_CATEGORY"];

exports.educationCategoryPage = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    res.render('settings/education_category');
}

exports.createEducationCategory = async (req, res, next) => {
    // permission
    _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newRecord = EducationCategory.build({
            parent_menu: req.body.parent_menu,
            text_en: req.body.text_en,
            text_es: req.body.text_es,
            status: req.body.status
        });

        // Save the new record to the database
        await newRecord.save()
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
}

exports.readEducationCategories = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const education_categories = await EducationCategory.findAll();
        res.json({ data: education_categories });
    } catch (error) {
        res.send(error.message);
    }
}

exports.readOneEducationCategory = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const education_category = await EducationCategory.findOne({ where: { id: req.body.id } });
        res.json(education_category);
    } catch (error) {
        res.send(error.message);
    }
}

exports.updateEducationCategory = async (req, res, next) => {
    // permission
    _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            parent_menu: req.body.parent_menu,
            text_en: req.body.text_en,
            text_es: req.body.text_es,
            status: req.body.status
        }

        // Update the record
        numRowsAffected = await EducationCategory.update(updates, {
            where: {
                id: req.body.id // Update the record with the specified ID
            }
        })
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
}

exports.deleteEducationCategory = async (req, res, next) => {
    // permission
    _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await EducationCategory.destroy({ where: { id: req.body.id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
}
