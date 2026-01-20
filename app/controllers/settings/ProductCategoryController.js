
const ProductCategory = require('../../models/settings/ProductCategory');
const util_permission = require('../../utilities/permission');

const permission_name = ["SETTING_PRODUCT_CATEGORY"];

exports.productCategoryPage = async (req, res, next) => {
    // permission
    const _permission = 2 * 3 * 5 * 7; // create && read && update && delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    res.render('settings/product_category');
};

exports.readProductCategories = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const categories = await ProductCategory.findAll({ order: [['name', 'ASC']] });
        res.status(200).json({ data: categories });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.createProductCategory = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const newRecord = ProductCategory.build({
            name: req.body.name,
            description: req.body.description,
            type: req.body.type,
            status: req.body.status,
        });

        await newRecord.save();
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.updateProductCategory = async (req, res, next) => {
    // permission
    const _permission = 5; // update
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            name: req.body.name,
            description: req.body.description,
            type: req.body.type,
            status: req.body.status,
        };
        
        await ProductCategory.update(updates, { where: { id: req.body.id } });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.deleteProductCategory = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send("")

    try {
        await ProductCategory.destroy({ where: { id: req.body.id } });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
