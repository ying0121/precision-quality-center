
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/settings/Role');
const UserSecurity = require("../models/settings/UserSecurity");

const util_permission = require('../utilities/permission');

const permission_name = ["USERS"];

exports.userPage = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    res.render('user')
};

exports.createUser = async (req, res, next) => {
    // permission
    _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newRecord = User.build({
            fname: req.body.fname,
            lname: req.body.lname,
            phone: req.body.phone,
            email: req.body.email,
            password: "",
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            fax: req.body.fax,
            role_id: req.body.role_id,
            status: req.body.status,
        });

        // Save the new record to the database
        await newRecord.save()
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
};

exports.readUser = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const users = await User.findAll({
            include: [{
                model: Role,
                required: false,
                attributes: ['name']
            }]
        })
        res.send({ data: users })
    } catch (error) {
        console.log("Message => ", error.message)
    }
}

exports.readUserNames = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const names = await User.findAll({ attributes: ['id', 'fname', 'lname'] });
        res.send({ data: names })
    } catch (error) {
        console.log("Message => ", error.message)
    }
}

exports.readOneUserById = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const user = await User.findOne({ where: { id: req.body.id } })
        res.send({ "message": "ok", data: user })
    } catch (error) {
        console.log({ "message": error.message })
    }
}

exports.updateUser = async (req, res, next) => {
    // permission
    _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            fname: req.body.fname,
            lname: req.body.lname,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            fax: req.body.fax,
            role_id: req.body.role_id,
            status: req.body.status,
        }

        await User.update(updates, { where: { id: req.body.id } })
        res.send("ok")
    } catch (error) {
        res.send(error.message)
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        bcrypt.hash(req.body.password, 12).then(hashedPassword => {
            const updates = {
                password: hashedPassword
            }
            User.update(updates, { where: { id: req.body.id } })
            res.send("ok")
        })
    } catch (error) {
        res.send(error.message)
    }
}

exports.deleteUser = async (req, res, next) => {
    // permission
    _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await User.destroy({ where: { id: req.body.id } })
        res.send("ok")
    } catch (error) {
        res.send(error.message)
    }
}

exports.setAnswer = async (req, res, next) => {
    // permission
    _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const user_security = await UserSecurity.findOne({ where: { user_id: req.body.user_id, question_id: req.body.question_id } })
        if (user_security) {
            // hashed answer
            bcrypt.hash(req.body.answer, 12).then(async hashedAnswer => {
                const update = {
                    answer: hashedAnswer
                }
                await UserSecurity.update(update, { where: { user_id: req.body.user_id, question_id: req.body.question_id } })
            })
        } else {
            bcrypt.hash(req.body.answer, 12).then(async hashedAnswer => {
                const newUserSecurity = UserSecurity.build({
                    user_id: req.body.user_id,
                    question_id: req.body.question_id,
                    answer: hashedAnswer
                })
                await newUserSecurity.save();
            })
        }
        res.send('ok');
    } catch (error) {
        console.log({ "message": error.message })
    }
}

exports.updateClinic = async (req, res, next) => {
    // permission
    _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            clinics: req.body.clinics,
        }

        await User.update(updates, { where: { id: req.body.id } })
        res.send("ok")
    } catch (error) {
        res.send(error.message)
    }
}