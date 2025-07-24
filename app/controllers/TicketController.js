
const nodemailer = require('nodemailer');

const sequelize = require('sequelize');
const Clinic = require('../models/Clinic');
const Ticket = require('../models/Ticket');
const User = require('../models/User');

const util_permission = require('../utilities/permission')

const permission_name = ["TICKETS"]

const sendEmail = async (params, res) => {
    // initialize mailer
    var mail = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
    })

    params.layout = "blank_layout"

    //render survey email file.
    res.render("../views/email/ticket_email.hbs", params, (err, data) => {
        if (err) {
            return { status: 'error', err: err }
        } else {
            // mail configuration
            const options = {
                from: "noreply@precisionq.com",
                to: params.emails.join(","),
                subject: params.subject,
                html: data
            }

            // send email
            mail.sendMail(options, async err => {
                if (err) {
                    return { status: 'failed', err: err }
                } else {
                    return { status: 'success' }
                }
            })
        }
    })
}

exports.ticketPage = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission)
    if (!_status) return res.render('403')

    res.render('tickets')
}

exports.createTicket = async (req, res, next) => {
    // permission
    _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newRecord = Ticket.build({
            user_id: req.body.user_id,
            clinic_id: req.body.clinic_id,
            type: req.body.type,
            reason: req.body.reason,
            message: req.body.message,
            assigned_to: req.body.assigned_to,
            backup_assigned: req.body.backup_assigned,
            priority: req.body.priority,
            status: req.body.status
        });
        // Save the new record to the database
        await newRecord.save()

        // get added id
        const id = newRecord.id
        // get added record including name for assigned_to
        const the_ticket = await Ticket.findOne({
            include: [{
                model: User,
                as: 'user',
                required: false,
                attributes: ['fname', 'lname', 'email']
            }, {
                model: Clinic,
                required: false,
                attributes: [
                    [sequelize.col('name'), 'clinic_name'],
                    [sequelize.col('acronym'), 'clinic_acronym'],
                    [sequelize.col('email'), 'clinic_email']
                ]
            }, {
                model: User,
                as: 'assignedUser',
                required: false,
                attributes: ['fname', 'lname', 'email']
            }],
            where: {
                id: id
            },
            order: [
                ['createdAt', 'DESC']
            ]
        })

        // send email
        const result = await sendEmail({
            reason: the_ticket.reason,
            message: the_ticket.message,
            assigned_to: the_ticket.assignedUser.fname + " " + the_ticket.assignedUser.lname,
            from: the_ticket.user.fname + " " + the_ticket.user.lname,
            emails: [the_ticket.clinic.dataValues.clinic_email, the_ticket.assignedUser.email, the_ticket.user.email],
            status: the_ticket.status == 1 ? "Open" : (the_ticket.status == 2 ? "In Progress" : "Closed"),
            case: the_ticket.clinic.dataValues.clinic_acronym + id.toString(),
            created_at: new Date(the_ticket.createdAt).toLocaleDateString(),
            updated_at: new Date(the_ticket.updatedAt).toLocaleDateString(),
            root_url: process.env.HOST_URL + process.env.PREFIX_URL,
            subject: "Case : #" + the_ticket.clinic.dataValues.clinic_acronym + id.toString() + " " + the_ticket.reason + " - New precisionq.com",
            mail_status: ""
        }, res)

        res.status(200).json({ status: 'success', email_status: result });
    } catch (error) {
        res.status(500).json({ status: 'error', email_status: null, error: error });
    }
}

exports.readTicket = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        let where = {}
        if (req.body.clinic_id > 0) {
            where.clinic_id = req.body.clinic_id
        }
        if (req.body.assigned_to > 0) {
            where.assigned_to = req.body.assigned_to
        }
        if (req.body.status > 0) {
            where.status = req.body.status
        }
        const tickets = await Ticket.findAll({
            include: [{
                model: User,
                as: 'user',
                required: false,
                attributes: ['fname', 'lname']
            }, {
                model: Clinic,
                required: false,
                attributes: [[sequelize.col('name'), 'clinic_name'], [sequelize.col('acronym'), 'clinic_acronym']]
            }, {
                model: User,
                as: 'assignedUser',
                required: false,
                attributes: ['fname', 'lname']
            }],
            where: where,
            order: [
                ['createdAt', 'DESC']
            ]
        })
        res.send({ data: tickets })
    } catch (error) {
        console.log("Message => ", error.message)
    }
}

exports.readTicketById = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const ticket = await Ticket.findOne({ where: { id: req.body.id } })
        res.send({ "message": "ok", data: ticket })
    } catch (error) {
        console.log({ "message": error.message })
    }
}

exports.updateTicket = async (req, res, next) => {
    // permission
    _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            user_id: req.body.user_id,
            clinic_id: req.body.clinic_id,
            type: req.body.type,
            reason: req.body.reason,
            message: req.body.message,
            assigned_to: req.body.assigned_to,
            backup_assigned: req.body.backup_assigned,
            priority: req.body.priority,
            status: req.body.status
        }
        await Ticket.update(updates, { where: { id: req.body.id } })

        // get added record including name for assigned_to
        const the_ticket = await Ticket.findOne({
            include: [{
                model: User,
                as: 'user',
                required: false,
                attributes: ['fname', 'lname', 'email']
            }, {
                model: Clinic,
                required: false,
                attributes: [
                    [sequelize.col('name'), 'clinic_name'],
                    [sequelize.col('acronym'), 'clinic_acronym'],
                    [sequelize.col('email'), 'clinic_email']
                ]
            }, {
                model: User,
                as: 'assignedUser',
                required: false,
                attributes: ['fname', 'lname', 'email']
            }],
            where: {
                id: req.body.id
            },
            order: [
                ['createdAt', 'DESC']
            ]
        })

        // send email
        const result = await sendEmail({
            reason: the_ticket.reason,
            message: the_ticket.message,
            assigned_to: the_ticket.assignedUser.fname + " " + the_ticket.assignedUser.lname,
            from: the_ticket.user.fname + " " + the_ticket.user.lname,
            emails: [the_ticket.clinic.dataValues.clinic_email, the_ticket.assignedUser.email, the_ticket.user.email],
            status: the_ticket.status == 1 ? "Open" : (the_ticket.status == 2 ? "In Progress" : "Closed"),
            case: the_ticket.clinic.dataValues.clinic_acronym + req.body.id.toString(),
            created_at: new Date(the_ticket.createdAt).toLocaleDateString(),
            updated_at: new Date(the_ticket.updatedAt).toLocaleDateString(),
            root_url: process.env.HOST_URL + process.env.PREFIX_URL,
            subject: "Case : #" + the_ticket.clinic.dataValues.clinic_acronym + req.body.id.toString() + " " + the_ticket.reason + " - precisionq.com",
            mail_status: "This Ticket was Updated!"
        }, res)

        res.status(200).json({ status: 'success', email_status: result });
    } catch (error) {
        res.status(500).json({ status: 'error', email_status: null, error: error });
    }
}

exports.deleteTicket = async (req, res, next) => {
    // permission
    _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        // get added record including name for assigned_to
        const old_ticket = await Ticket.findOne({
            include: [{
                model: User,
                as: 'user',
                required: false,
                attributes: ['fname', 'lname', 'email']
            }, {
                model: Clinic,
                required: false,
                attributes: [
                    [sequelize.col('name'), 'clinic_name'],
                    [sequelize.col('acronym'), 'clinic_acronym'],
                    [sequelize.col('email'), 'clinic_email']
                ]
            }, {
                model: User,
                as: 'assignedUser',
                required: false,
                attributes: ['fname', 'lname', 'email']
            }],
            where: {
                id: req.body.id
            },
            order: [
                ['createdAt', 'DESC']
            ]
        })

        // send email
        const result = await sendEmail({
            reason: old_ticket.reason,
            message: old_ticket.message,
            assigned_to: old_ticket.assignedUser.fname + " " + old_ticket.assignedUser.lname,
            from: old_ticket.user.fname + " " + old_ticket.user.lname,
            emails: [old_ticket.clinic.dataValues.clinic_email, old_ticket.assignedUser.email, old_ticket.user.email],
            status: old_ticket.status == 1 ? "Open" : (old_ticket.status == 2 ? "In Progress" : "Closed"),
            case: old_ticket.clinic.dataValues.clinic_acronym + req.body.id.toString(),
            created_at: new Date(old_ticket.createdAt).toLocaleDateString(),
            updated_at: new Date(old_ticket.updatedAt).toLocaleDateString(),
            root_url: process.env.HOST_URL + process.env.PREFIX_URL,
            subject: "Case : #" + old_ticket.clinic.dataValues.clinic_acronym + req.body.id.toString() + " " + old_ticket.reason + " - precisionq.com",
            mail_status: "This Ticket was Deleted!"
        }, res)

        await Ticket.destroy({ where: { id: req.body.id } })

        res.status(200).json({ status: 'success', email_status: result, old: old_ticket });
    } catch (error) {
        res.status(500).json({ status: 'error', email_status: null, error: error });
    }
}

exports.calculateCounts = async (req, res, next) => {
    // permission
    _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    // get open count
    const open = await Ticket.count({ where: { status: 1 } })
    // get in progress count
    const in_progress = await Ticket.count({ where: { status: 2 } })
    // get closed count
    const closed = await Ticket.count({ where: { status: 3 } })

    res.send({ open: open, in_progress: in_progress, closed: closed })
}
