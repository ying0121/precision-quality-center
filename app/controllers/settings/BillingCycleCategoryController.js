
const BillingCycleCategory = require('../../models/settings/BillingCycleCategory');
const util_permission = require('../../utilities/permission');

const permission_name = ["SETTING_BILLING_CYCLE_CATEGORY"];

exports.billingCycleCategoryPage = async (req, res, next) => {
    // permission
    const _permission = 2 * 3 * 5 * 7; // create && read && update && delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    res.render('settings/billing_cycle_category');
};

exports.readBillingCycleCategories = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const categories = await BillingCycleCategory.findAll({ order: [['category_name', 'ASC']] });
        res.status(200).json({ data: categories });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.createBillingCycleCategory = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newRecord = BillingCycleCategory.build({
            category_code: req.body.category_code,
            category_name: req.body.category_name,
            description: req.body.description,
            status: req.body.status,
        });

        await newRecord.save();
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.updateBillingCycleCategory = async (req, res, next) => {
    // permission
    const _permission = 5; // update
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            category_code: req.body.category_code,
            category_name: req.body.category_name,
            description: req.body.description,
            status: req.body.status,
        };
        
        await BillingCycleCategory.update(updates, { where: { id: req.body.id } });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.deleteBillingCycleCategory = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await BillingCycleCategory.destroy({ where: { id: req.body.id } });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
