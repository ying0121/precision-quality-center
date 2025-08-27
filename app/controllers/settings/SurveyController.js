
const Survey = require('../../models/Survey');
const SurveyType = require('../../models/settings/SurveyType');
const SurveyCategory = require('../../models/settings/SurveyCategory');
const SurveyQuestion = require('../../models/settings/SurveyQuestion');
const SurveyQuestionType = require('../../models/settings/SurveyQuestionType');
const SurveyFooter = require('../../models/settings/SurveyFooter');
const SurveyResponse = require('../../models/settings/SurveyResponse');
const Language = require("../../models/Language");
const EventStatus = require("../../models/EventStatus");

const util_permission = require('../../utilities/permission');
const sequelize = require('sequelize');

const permission_name = ["SETTING_SURVEY"];

exports.surveyPage = async (req, res, next) => {
    // permission
    const _permission = 2 * 3 * 5 * 7; // create && read && update && delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    res.render('settings/survey');
};

// survey category
exports.addSurveyCategory = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newSurveyCategory = SurveyCategory.build({
            name_en: req.body.name_en,
            name_es: req.body.name_es,
            e_status: req.body.e_status,
            status: req.body.status
        })
        await newSurveyCategory.save();
        res.send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.readSurveyCategory = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const survey_basics = await SurveyCategory.findAll({
            include: [{
                model: EventStatus,
                attributes: [[sequelize.col('display'), 'display']],
                required: false,
            }]
        });
        res.json({ data: survey_basics });
    } catch (error) {
        res.send(error.message);
    }
}

exports.readOneSurveyCategory = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        // read survey basic information
        const survey_basics = await SurveyCategory.findOne({
            where: { id: req.body.id },
            include: [{
                model: EventStatus,
                attributes: [[sequelize.col('display'), 'e_status']],
                required: false,
            }]
        });

        res.json({ data: survey_basics });
    } catch (error) {
        res.send(error.message);
    }
}

exports.updateSurveyCategory = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            name_en: req.body.name_en,
            name_es: req.body.name_es,
            e_status: req.body.e_status,
            status: req.body.status
        }
        // update role en name, es name and status
        await SurveyCategory.update(updates, { where: { id: req.body.id } })

        res.status(200).send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.deleteSurveyCategory = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await SurveyCategory.destroy({ where: { id: req.body.id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
}

// survey type
exports.addSurveyTypes = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newSurveyTypes = SurveyType.build({
            name_en: req.body.name_en,
            name_es: req.body.name_es,
            status: req.body.status
        })
        await newSurveyTypes.save();
        res.send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.readSurveyTypes = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const survey_types = await SurveyType.findAll();
        res.json({ data: survey_types });
    } catch (error) {
        res.send(error.message);
    }
}

exports.readOneSurveyTypes = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        // read survey type information
        const survey_types = await SurveyType.findOne({ where: { id: req.body.id } });

        res.json({ data: survey_types });
    } catch (error) {
        res.send(error.message);
    }
}

exports.updateSurveyTypes = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            name_en: req.body.name_en,
            name_es: req.body.name_es,
            status: req.body.status
        }
        // update role en name, es name and status
        await SurveyType.update(updates, { where: { id: req.body.id } })

        res.status(200).send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.deleteSurveyTypes = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await SurveyType.destroy({ where: { id: req.body.id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
}

// survey question
exports.addSurveyQuestion = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newSurveyQuestion = SurveyQuestion.build({
            survey_id: req.body.survey_id,
            language_id: req.body.language_id,
            text: req.body.text,
            choice_text: req.body.choice_text,
            required: req.body.required,
            status: req.body.status
        })
        await newSurveyQuestion.save();
        res.send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.readSurveyQuestion = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const survey_questions = await SurveyQuestion.findAll({
            include: [{
                model: Survey,
                attributes: [[sequelize.col('name'), 'survey']],
                required: false,
            }, {
                model: Language,
                attributes: [[sequelize.col('english'), 'lang']],
                required: false,
            }]
        });
        res.json({ data: survey_questions });
    } catch (error) {
        res.send(error.message);
    }
}

exports.readOneSurveyQuestion = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        // read survey question information
        const survey_question = await SurveyQuestion.findOne({
            where: { id: req.body.id },
            include: [{
                model: Survey,
                attributes: [[sequelize.col('name'), 'survey']],
                required: false,
            }]
        });

        res.json({ data: survey_question });
    } catch (error) {
        res.send(error.message);
    }
}

exports.updateSurveyQuestion = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            survey_id: req.body.survey_id,
            language_id: req.body.language_id,
            text: req.body.text,
            choice_text: req.body.choice_text,
            required: req.body.required,
            status: req.body.status
        }
        // update role category, en name, es name and status
        await SurveyQuestion.update(updates, { where: { id: req.body.id } })

        res.status(200).send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.deleteSurveyQuestion = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await SurveyQuestion.destroy({ where: { id: req.body.id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
}

// survey footer
exports.readSurveyFooter = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        // read survey footer information
        const survey_footer = await SurveyFooter.findOne({ where: { lang_id: req.body.lang_id } });

        res.json({ data: survey_footer });
    } catch (error) {
        res.send(error.message);
    }
}

exports.updateSurveyFooter = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const survey_footer = await SurveyFooter.findOne({ where: { lang_id: req.body.lang_id } });
        if (survey_footer) {
            const updates = {
                lang_id: req.body.lang_id,
                footer: req.body.footer,
            }
            // update footer
            await SurveyFooter.update(updates, { where: { lang_id: updates.lang_id } })
        } else {
            const newSurveyFooter = SurveyFooter.build({
                lang_id: req.body.lang_id,
                footer: req.body.footer
            })
            await newSurveyFooter.save();
        }
        res.send("ok");
    } catch (error) {
        res.send(error.message)
    }
}

// survey response
exports.addSurveyResponse = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newSurveyResponse = SurveyResponse.build({
            key: req.body.key,
            lang_id: req.body.lang_id,
            items: req.body.items,
            status: req.body.status,
            required: req.body.required,
        })
        await newSurveyResponse.save();

        res.send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.readSurveyResponse = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        let where = {}
        if (req.body.lang_id > 0) {
            where['lang_id'] = req.body.lang_id
        }
        const survey_responses = await SurveyResponse.findAll({
            where: where,
            include: [{
                model: Language,
                required: false,
            }]
        });
        res.json({ data: survey_responses });
    } catch (error) {
        res.send(error.message);
    }
}

exports.readOneSurveyResponse = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        // read survey response information
        const survey_response = await SurveyResponse.findOne({
            where: { id: req.body.id },
            include: [{
                model: Language,
                required: false,
            }]
        });

        res.json({ data: survey_response });
    } catch (error) {
        res.send(error.message);
    }
}

exports.updateSurveyResponse = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            key: req.body.key,
            lang_id: req.body.lang_id,
            items: req.body.items,
            status: req.body.status,
            required: req.body.required,
        }
        // update role en name, es name and status
        await SurveyResponse.update(updates, { where: { id: req.body.id } })

        res.status(200).send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.deleteSurveyResponse = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await SurveyResponse.destroy({ where: { id: req.body.id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
}

exports.updateSurveyResponseItem = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        let updates = {}
        if (req.body.lang == "en") {
            updates = {
                item_en: req.body.value,
            }
        } else {
            updates = {
                item_es: req.body.value,
            }
        }
        // update role en name, es name and status
        await SurveyResponse.update(updates, { where: { id: req.body.id } })

        res.status(200).send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

// survey question type
exports.addSurveyQuestionType = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newSurveyQuestionType = SurveyQuestionType.build({
            code: req.body.code,
            display_en: req.body.display_en,
            display_es: req.body.display_es,
            type: req.body.type,
            field_value: req.body.field_value
        })
        await newSurveyQuestionType.save();
        res.send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.readSurveyQuestionType = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const survey_ques_types = await SurveyQuestionType.findAll();
        res.json({ data: survey_ques_types });
    } catch (error) {
        res.send(error.message);
    }
}

exports.readOneSurveyQuestionType = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        // read survey question type information
        const survey_ques_type = await SurveyQuestionType.findOne({ where: { id: req.body.id } });

        res.json({ data: survey_ques_type });
    } catch (error) {
        res.send(error.message);
    }
}

exports.updateSurveyQuestionType = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            code: req.body.code,
            display_en: req.body.display_en,
            display_es: req.body.display_es,
            type: req.body.type,
            field_value: req.body.field_value
        }
        // update code, display for en and es, field value
        await SurveyQuestionType.update(updates, { where: { id: req.body.id } })

        res.status(200).send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.deleteSurveyQuestionType = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await SurveyQuestionType.destroy({ where: { id: req.body.id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
}

// event status
exports.addEventStatus = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newEventStatus = EventStatus.build({
            code: req.body.code,
            display: req.body.display,
            definition: req.body.definition
        })
        await newEventStatus.save();
        res.send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.readEventStatus = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const event_status = await EventStatus.findAll();
        res.json({ data: event_status });
    } catch (error) {
        res.send(error.message);
    }
}

exports.readOneEventStatus = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        // read survey question type information
        const event_status = await EventStatus.findOne({ where: { id: req.body.id } });

        res.json({ data: event_status });
    } catch (error) {
        res.send(error.message);
    }
}

exports.updateEventStatus = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            code: req.body.code,
            display: req.body.display,
            definition: req.body.definition
        }
        // update code, display for en and es, field value
        await EventStatus.update(updates, { where: { id: req.body.id } })

        res.status(200).send("ok");
    } catch (error) {
        res.send(error.message);
    }
}

exports.deleteEventStatus = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await EventStatus.destroy({ where: { id: req.body.id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
}
