
const Setting = require("../../models/Setting");
const util_permission = require('../../utilities/permission');

const permission_name = ["SETTING_GENERAL"];

exports.generalPage = async (req, res, next) => {
    // permission
    const _permission = 2 * 3 * 5 * 7; // create && read && update && delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    // get expired setting information
    try {
        const expired_survey = await Setting.findOne({
            where: { code: "expired_survey" }
        })

        res.render('settings/general', { expired_survey: expired_survey.display });
    } catch (error) {
        res.status(500).status({ message: error.message })
    }
};

exports.updateExpiredSurvey = async (req, res, next) => {
    // permission
    const _permission = 5; // write
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    try {
        const updates = {
            display: req.body.value
        }
        await Setting.update(updates, {
            where: {
                code: "expired_survey"
            }
        })
        res.send("ok");
    } catch (error) {
        res.send(error.message);
    }
}
