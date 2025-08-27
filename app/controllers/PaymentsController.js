
const util_permission = require('../utilities/permission');

const permission_name = ["PAYMENTS"];

exports.paymentsPage = async (req, res, next) => {
    // permission
    const _permission = 2 * 3 * 5 * 7; // create && read && update && delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    res.render('payments');
};
