const Insurance = require('../models/Insurance');
const util_upload = require('../utilities/upload');

const util_permission = require('../utilities/permission');

const permission_name = ["INSURANCES"];

exports.insurancePage = async (req, res, next) => {
    // permission
    const _permission = 2 * 3 * 5 * 7; // create && read && update && delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    res.render('insurance');
};

exports.createInsurance = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newRecord = Insurance.build({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            fax: req.body.fax,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            status: req.body.status,
        });

        // Save the new record to the database
        await newRecord.save()
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
};

exports.readInsurances = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const insurances = await Insurance.findAll();
        res.json({ data: insurances });
    } catch (error) {
        res.send(error.message);
    }
};

exports.readByClinic = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const insurances = await Insurance.findAll({ where: { id: req.body.clinic_id } });
        res.json({ data: insurances });
    } catch (error) {
        res.send(error.message);
    }
};

exports.readOneInsurance = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const insurance = await Insurance.findOne({ where: { id: req.body.id } });
        res.json(insurance);
    } catch (error) {
        res.send(error.message);
    }
};

exports.readOnlyNames = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const names = await Insurance.findAll({ attributes: ['id', 'name'] });
        res.json({ data: names });
    } catch (error) {
        res.send(error.message);
    }
};

exports.updateInsurance = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            fax: req.body.fax,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            status: req.body.status,
        };
        // Update the record
        numRowsAffected = await Insurance.update(updates, {
            where: {
                id: req.body.id // Update the record with the specified ID
            }
        })
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    };
};

exports.deleteInsurance = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const insurance = await Insurance.findOne({ where: { id: req.body.id } });
        await Insurance.destroy({ where: { id: req.body.id } });
        if (insurance.img !== 'empty-img.jpg')
            await util_upload.deleteOldFile(insurance.img, './public/assets/images/insurances');
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
};

exports.uploadInsuranceImage = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    const destination = './public/assets/images/insurances'; // Destination directory

    util_upload.uploadFile(req, destination, [])
        .then(async (savedFileName) => {
            console.log('File uploaded successfully:', savedFileName);
            const insurance = await Insurance.findOne({ where: { id: req.body.id } });
            if (insurance.image !== 'empty-img.jpg' && insurance.image !== '')
                await util_upload.deleteOldFile(insurance.img, './public/assets/images/insurances')

            const updates = {
                img: savedFileName
            };
            // Update the record
            numRowsAffected = await Insurance.update(updates, {
                where: {
                    id: req.body.id // Update the record with the specified ID
                }
            });
            res.send('ok');
        })
        .catch(error => {
            console.log(error);
            res.send(error.message);
        });
};