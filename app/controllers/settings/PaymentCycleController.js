
const PaymentCycle = require('../../models/settings/PaymentCycle');
const BillingCycleCategory = require('../../models/settings/BillingCycleCategory');
const util_permission = require('../../utilities/permission');

const permission_name = ["SETTING_PAYMENT_CYCLE"];

exports.paymentCyclePage = async (req, res, next) => {
    // permission
    const _permission = 2 * 3 * 5 * 7; // create && read && update && delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    res.render('settings/payment_cycle');
};

exports.readPaymentCycles = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const cycles = await PaymentCycle.findAll({ 
            include: [BillingCycleCategory],
            order: [['cycle_name', 'ASC']] 
        });
        res.status(200).json({ data: cycles });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.readBillingCycleCategories = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const categories = await BillingCycleCategory.findAll({ 
            where: { status: 1 },
            order: [['category_name', 'ASC']] 
        });
        res.status(200).json({ data: categories });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.createPaymentCycle = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newRecord = PaymentCycle.build({
            category_id: req.body.category_id,
            cycle_code: req.body.cycle_code,
            cycle_name: req.body.cycle_name,
            interval_value: req.body.interval_value || null,
            interval_unit: req.body.interval_unit || null,
            is_recurring: req.body.is_recurring,
            description: req.body.description,
            status: req.body.status,
        });

        await newRecord.save();
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.updatePaymentCycle = async (req, res, next) => {
    // permission
    const _permission = 5; // update
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            category_id: req.body.category_id,
            cycle_code: req.body.cycle_code,
            cycle_name: req.body.cycle_name,
            interval_value: req.body.interval_value || null,
            interval_unit: req.body.interval_unit || null,
            is_recurring: req.body.is_recurring,
            description: req.body.description,
            status: req.body.status,
        };
        
        await PaymentCycle.update(updates, { where: { id: req.body.id } });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.deletePaymentCycle = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await PaymentCycle.destroy({ where: { id: req.body.id } });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
