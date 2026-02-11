const path = require('path');
const fs = require('fs');
const multer = require('multer');
const ProductService = require('../models/ProductService');
const ProductCategory = require('../models/settings/ProductCategory');
const PayType = require('../models/settings/PayType');
const PaymentCycle = require('../models/settings/PaymentCycle');
const BillingCycleCategory = require('../models/settings/BillingCycleCategory');
const util_permission = require('../utilities/permission');

const permission_name = ['PRODUCT_SERVICES'];

const IMAGES_DIR = './public/assets/images/product_service';
const VIDEOS_DIR = './public/assets/videos/product_service';
const IMAGES_PATH_PREFIX = 'assets/images/product_service';
const VIDEOS_PATH_PREFIX = 'assets/videos/product_service';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = file.fieldname === 'video' ? VIDEOS_DIR : IMAGES_DIR;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname) || (file.mimetype && file.mimetype.startsWith('video/') ? '.mp4' : '.jpg');
        cb(null, uniqueSuffix + ext);
    }
});

const fileFilter = function (req, file, cb) {
    if (file.fieldname === 'video') {
        if (!file.mimetype || !file.mimetype.startsWith('video/')) {
            return cb(new Error('Only video files are allowed'), false);
        }
        return cb(null, true);
    }
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
};

const uploadProductServiceFiles = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024  // 100MB max per file (for video)
    }
}).fields([
    { name: 'images', maxCount: 10 },
    { name: 'video', maxCount: 1 }
]);

exports.uploadProductServiceFiles = uploadProductServiceFiles;

exports.productServicePage = async (req, res, next) => {
    const _permission = 2 * 3 * 5 * 7;
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403');
    res.render('product_service');
};

exports.readProductServices = async (req, res, next) => {
    const _permission = 3;
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send('');

    try {
        const list = await ProductService.findAll({
            include: [
                { model: ProductCategory, attributes: ['id', 'name'], required: false },
                { model: PayType, attributes: ['id', 'type_name'], required: false },
                { model: PaymentCycle, attributes: ['id', 'cycle_name'], required: false },
                { model: BillingCycleCategory, attributes: ['id', 'category_name'], required: false }
            ],
            order: [['name', 'ASC']]
        });
        res.status(200).json({ data: list });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

function buildImagesString(req) {
    const existing = (req.body.existing_images || '').split(',').map(s => s.trim()).filter(Boolean);
    const newFiles = (req.files && req.files.images) ? req.files.images : [];
    const newPaths = newFiles.map(f => IMAGES_PATH_PREFIX + '/' + f.filename);
    return existing.concat(newPaths).join(',') || null;
}

function buildVideoString(req) {
    if (req.files && req.files.video && req.files.video[0]) {
        return VIDEOS_PATH_PREFIX + '/' + req.files.video[0].filename;
    }
    const existing = (req.body.existing_video || '').trim();
    return existing || null;
}

function deleteStoredFile(storedPath) {
    if (!storedPath || typeof storedPath !== 'string') return;
    const fullPath = path.join(__dirname, '..', '..', 'public', storedPath.trim());
    try {
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    } catch (err) {
        console.error('Error deleting file:', fullPath, err.message);
    }
}

exports.createProductService = async (req, res, next) => {
    const _permission = 2;
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send('');

    try {
        const imagesStr = buildImagesString(req);
        const videoStr = buildVideoString(req);
        await ProductService.create({
            type: req.body.type,
            category_id: req.body.category_id,
            name: req.body.name,
            short_description: req.body.short_description || null,
            long_description: req.body.long_description || null,
            base_price: req.body.base_price,
            currency: req.body.currency || 'USD',
            is_subscription: req.body.is_subscription === 'true' || req.body.is_subscription === '1',
            pay_type_id: req.body.pay_type_id || null,
            payment_cycle_id: req.body.payment_cycle_id || null,
            billing_cycle_category_id: req.body.billing_cycle_category_id || null,
            discount_type: req.body.discount_type || 'none',
            discount_value: req.body.discount_value || 0,
            tax_required: req.body.tax_required !== 'false' && req.body.tax_required !== '0',
            status: req.body.status || 'active',
            images: imagesStr,
            videos: videoStr
        });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.updateProductService = async (req, res, next) => {
    const _permission = 5;
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send('');

    try {
        const imagesStr = buildImagesString(req);
        const videoStr = buildVideoString(req);
        const current = await ProductService.findOne({ where: { id: req.body.id } });
        if (current) {
            const oldImages = (current.images || '').split(',').map(s => s.trim()).filter(Boolean);
            const newImagesList = (imagesStr || '').split(',').map(s => s.trim()).filter(Boolean);
            oldImages.forEach(oldPath => {
                if (!newImagesList.includes(oldPath)) {
                    deleteStoredFile(oldPath);
                }
            });
            const oldVideo = (current.videos || '').trim() || null;
            if (oldVideo && oldVideo !== (videoStr || '').trim()) {
                deleteStoredFile(oldVideo);
            }
        }
        await ProductService.update(
            {
                type: req.body.type,
                category_id: req.body.category_id,
                name: req.body.name,
                short_description: req.body.short_description || null,
                long_description: req.body.long_description || null,
                base_price: req.body.base_price,
                currency: req.body.currency || 'USD',
                is_subscription: req.body.is_subscription === 'true' || req.body.is_subscription === '1',
                pay_type_id: req.body.pay_type_id || null,
                payment_cycle_id: req.body.payment_cycle_id || null,
                billing_cycle_category_id: req.body.billing_cycle_category_id || null,
                discount_type: req.body.discount_type || 'none',
                discount_value: req.body.discount_value || 0,
                tax_required: req.body.tax_required !== 'false' && req.body.tax_required !== '0',
                status: req.body.status || 'active',
                images: imagesStr,
                videos: videoStr
            },
            { where: { id: req.body.id } }
        );
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.deleteProductService = async (req, res, next) => {
    const _permission = 7;
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.status(403).send('');

    try {
        const current = await ProductService.findOne({ where: { id: req.body.id } });
        if (current) {
            const imagePaths = (current.images || '').split(',').map(s => s.trim()).filter(Boolean);
            imagePaths.forEach(storedPath => deleteStoredFile(storedPath));
            const videoPath = (current.videos || '').trim();
            if (videoPath) deleteStoredFile(videoPath);
        }
        await ProductService.destroy({ where: { id: req.body.id } });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
