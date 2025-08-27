
const axios = require("axios")
const nodemailer = require('nodemailer');

const Survey = require('../models/Survey');
const SurveyView = require('../models/SurveyView');
const Language = require("../models/Language");
const SurveyCategory = require("../models/settings/SurveyCategory");
const SurveyType = require("../models/settings/SurveyType");
const SurveyQuestion = require("../models/settings/SurveyQuestion");
const SurveyFooter = require("../models/settings/SurveyFooter");
const SurveyFeedback = require("../models/settings/SurveyFeedback");
const SurveyExpiration = require("../models/settings/SurveyExpiration");
const Setting = require("../models/Setting");

const sequelize = require('sequelize');
const util_permission = require('../utilities/permission');
const kits = require("../utilities/kits");

const permission_name = ["SURVEY"];

// survey
exports.surveyPage = async (req, res, next) => {
    // permission
    const _permission = 2 * 3 * 5 * 7; // create && read && update && delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    try {
        const response = await axios.post(process.env.CONECTOR_URL + "/service/patient", { all: 'true' })
        const patients = response.data.data
        res.render("survey", { patients: patients })
    } catch (error) {
        console.log(error.message)
    }
};

exports.add = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newSurvey = Survey.build({
            language_id: req.body.language,
            type_id: req.body.type,
            cate_id: req.body.cate,
            name: req.body.name,
            desc: req.body.desc,
            page_length: req.body.page_length,
            status: req.body.status
        })
        await newSurvey.save();
        res.send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.read = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        let where = {}
        if (req.body.cate_id > 0) {
            where['cate_id'] = req.body.cate_id
        }
        if (req.body.lang_id > 0) {
            where['language_id'] = req.body.lang_id
        }
        let _surveys = []
        const s = await Survey.findAll({
            where: where,
            include: [{
                model: SurveyCategory,
                attributes: [[sequelize.col('name_en'), 'cate']],
                required: false,
            }, {
                model: SurveyType,
                attributes: [[sequelize.col('name_en'), 'type']],
                required: false,
            }, {
                model: Language,
                attributes: [[sequelize.col('english'), 'lang']],
                required: false,
            }]
        });

        // get completed
        for (var i = 0; i < s.length; i++) {
            let completed = await SurveyView.findOne({ where: { survey_id: s[i].id } })
            let _s = {
                id: s[i].id,
                cate_id: s[i].cate_id,
                name: s[i].name,
                desc: s[i].desc,
                language_id: s[i].language_id,
                language: s[i].language.dataValues.lang,
                status: s[i].status,
                page_length: s[i].page_length,
                cate: s[i].survey_category.dataValues.cate,
                type: s[i].survey_type.dataValues.type,
                type_id: s[i].type_id,
                completed: completed ? completed.completed : 0
            }
            _surveys.push(_s)
        }
        res.json({ data: _surveys });
    } catch (error) {
        res.send(error.message);
    }
}

exports.readOne = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        // read survey category information
        const survey_category = await Survey.findOne({
            where: { id: req.body.id },
            include: [{
                model: SurveyCategory,
                attributes: [[sequelize.col('name_en'), 'cate']],
                required: false,
            }, {
                model: SurveyType,
                attributes: [[sequelize.col('name_en'), 'type']],
                required: false,
            }, {
                model: Language,
                attributes: [[sequelize.col('english'), 'lang']],
                required: false,
            }]
        });

        res.json({ data: survey_category });
    } catch (error) {
        res.send(error.message);
    }
}

exports.update = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            language_id: req.body.language,
            type_id: req.body.type,
            cate_id: req.body.cate,
            name: req.body.name,
            desc: req.body.desc,
            page_length: req.body.page_length,
            status: req.body.status
        }
        // update role en name, es name and status
        await Survey.update(updates, { where: { id: req.body.id } })

        res.status(200).send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.delete = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await Survey.destroy({ where: { id: req.body.id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
}

// survey view
exports.survey_viewPage = async (req, res, next) => {
    const id = req.query.id;
    res.render("survey_view", { layout: 'survey_layout', survey_id: id });
}

exports.readSurveyView = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        let where = {}
        if (req.body.lang_id > 0) {
            where['lang_id'] = req.body.lang_id
        }
        where['survey_id'] = req.body.survey_id
        let views = await SurveyView.findAll({
            where: where,
            include: [{
                model: Language,
                attributes: [[sequelize.col('english'), 'lang']],
                required: false,
            }, {
                model: Survey,
                attributes: [[sequelize.col('name'), 'survey']],
                required: false,
            }]
        })
        res.send({ data: views })
    } catch (error) {
        res.send(error.message)
    }
}

exports.saveSurveyView = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const existed = await SurveyView.findOne({ where: { survey_id: req.body.survey_id, lang_id: req.body.lang_id } })
        if (existed) { // update
            const updates = {
                survey_id: req.body.survey_id,
                completed: req.body.completed,
                lang_id: req.body.lang_id,
                view: JSON.stringify(req.body.view) ?? "[]",
            }
            // update survey view
            await SurveyView.update(updates, { where: { id: existed.id } })
        } else { // add
            const newView = SurveyView.build({
                survey_id: req.body.survey_id,
                completed: req.body.completed,
                lang_id: req.body.lang_id,
                view: JSON.stringify(req.body.view),
            })
            await newView.save();
        }

        res.send("ok")
    } catch (error) {
        res.send(error.message)
    }
}

exports.readSurveyCateAndQuestion = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        let cate_questions = []
        // get survey cate
        let where = {}
        if (req.body.lang_id > 0) {
            where['language_id'] = req.body.lang_id
        }
        const surveys = await Survey.findAll({
            where: where
        });
        // get question
        for (cate of surveys) {
            const survey_questions = await SurveyQuestion.findAll({ where: { survey_id: cate.id, language_id: req.body.lang_id } })
            cate_questions.push({
                cate: cate,
                ques: survey_questions
            })
        }
        res.json({ data: cate_questions })
    } catch (error) {
        res.send(error.message);
    }
}

exports.readSurveyResponse = async (req, res, next) => {
}

// survey preview
exports.survey_previewPage = async (req, res, next) => {
    const id = req.query.id;

    try {
        // survey
        const survey = await Survey.findOne({ where: { id: id } })

        // survey footer
        const survey_footer = await SurveyFooter.findOne({ where: { lang_id: survey.language_id } });

        // expired survey day
        const expired_survey = await Setting.findOne({
            where: { code: "expired_survey" }
        })

        res.render("survey_preview", { layout: 'survey_layout', survey_id: id, survey_footer: survey_footer == null ? "" : survey_footer.footer, expired_survey: expired_survey.display, survey_status: 0, expired: 'undefined' });
    } catch (error) {
        console.log(error)
        res.send("error")
    }
}

// survey feedback
exports.feedback = async (req, res, next) => {
    const id = req.query.id;
    const expired_id = req.query.expired;

    if (expired_id == undefined || expired_id == null || expired_id.length != 32) {
        res.render("survey_preview", { layout: 'survey_layout', survey_id: 0, survey_footer: '', expired_survey: '', survey_status: 0, expired: 'invalid' });
        return
    }

    try {
        // survey
        const survey = await Survey.findOne({ where: { id: id } })

        // survey footer
        const survey_footer = await SurveyFooter.findOne({ where: { lang_id: survey.language_id } });

        // expired survey day
        const expired_survey = await Setting.findOne({
            where: { code: "expired_survey" }
        })

        // check if the survey feedback is avaliable
        const avaliable_feedback = await SurveyExpiration.findOne({ where: { expired_id: expired_id } })
        if (avaliable_feedback) { // existed in expired table
            if (avaliable_feedback.status == 0) { // not submitted
                const currDate = new Date(Date.now())
                const createdDate = new Date(avaliable_feedback.createdAt)

                if (parseInt(expired_survey.display) * 24 * 3600 * 1000 > (currDate - createdDate)) { // not expired
                    res.render("survey_preview", { layout: 'survey_layout', survey_id: id, survey_footer: survey_footer == null ? "" : survey_footer.footer, expired_survey: expired_survey.display, survey_status: 1, expired: expired_id });
                } else { // expired
                    res.render("survey_preview", { layout: 'survey_layout', survey_id: id, survey_footer: survey_footer == null ? "" : survey_footer.footer, expired_survey: expired_survey.display, survey_status: 1, expired: 'expired' });
                }
            } else { // submitted
                res.render("survey_preview", { layout: 'survey_layout', survey_id: id, survey_footer: survey_footer == null ? "" : survey_footer.footer, expired_survey: expired_survey.display, survey_status: 1, expired: 'submitted' });
            }
        } else { // not avaliable in expired table, it means this might deleted automatically or not added
            res.render("survey_preview", { layout: 'survey_layout', survey_id: id, survey_footer: survey_footer == null ? "" : survey_footer.footer, expired_survey: expired_survey.display, survey_status: 1, expired: 'invalid' });
        }
    } catch (error) {
        console.log(error)
        res.send("error")
    }
}

exports.surveyFeedback = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const survey_feedbacks = await SurveyFeedback.findAll();
        res.json({ data: survey_feedbacks });
    } catch (error) {
        res.send(error.message);
    }
}

exports.addSurveyFeedback = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const expired_id = req.body.expired
        // status = 1 because patient completed
        const updates = {
            status: 1
        }
        await SurveyExpiration.update(updates, { where: { expired_id: expired_id } })

        // save feedback
        const feedbacks = JSON.parse(req.body.feedback)
        for (var feedback of feedbacks) {
            const newRecord = SurveyFeedback.build({
                ques_id: feedback.ques_id,
                resp_id: feedback.resp_id,
                resp_type: feedback.resp_type,
                response: feedback.response,
            })

            // Save the new record to the database
            await newRecord.save()
        }

        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
}

exports.deleteSurveyFeedback = async (req, res, next) => {
}

// send email
exports.sendEmail = async (req, res, next) => {
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

    // get survey information
    const _survey = await Survey.findOne({ where: { id: req.body.id } })
    const _footer = await SurveyFooter.findOne({ where: { lang_id: _survey.language_id } })

    // make 32 sized random string for survey feedback expired id.
    const _feedback_expired_id = await kits.generateRandomString(32)

    const root_url = process.env.HOST_URL + process.env.PREFIX_URL
    const _url = root_url + `/feedback?id=${req.body.id}&expired=${_feedback_expired_id}`

    //render survey email file.
    res.render("../views/email/survey_email.hbs", { layout: 'blank_layout', root_url: root_url, url: _url, footer: _footer.footer, survey_name: _survey.name }, (err, data) => {
        // mail configuration
        const options = {
            from: "noreply@precisionq.com",
            to: req.body.emails,
            subject: `NOREPLY`,
            html: data
        }

        // send email
        mail.sendMail(options, async err => {
            if (err) {
                res.status(200).json({ status: 'error' })
            } else {
                // save this id for expired
                try {
                    const newRecord = SurveyExpiration.build({
                        expired_id: _feedback_expired_id,
                        route: _url,
                        status: 0
                    })
                    await newRecord.save()
                } catch (error) {
                    res.send(error.message)
                    return
                }

                res.status(200).json({ status: 'success' })
            }
        })
    })
}
