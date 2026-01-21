
const ProductService = require('../models/ProductService');
const ProductCategory = require('../models/settings/ProductCategory');
const util_permission = require('../utilities/permission');
const util_upload = require('../utilities/upload');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const permission_name = ["PRODUCT_SERVICES"];

// Configure multer for product service images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destination = './public/assets/images/product_service';
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }
        cb(null, destination);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, uniqueSuffix + extension);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('image');

exports.productServicePage = async (req, res, next) => {
    // permission
    const _permission = 2 * 3 * 5 * 7; // create && read && update && delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    if (!_status) return res.render('403')

    res.render('product_service');
};

exports.readProductServices = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);

    if (!_status) return res.status(403).send("")

    try {
        const productServices = await ProductService.findAll({ include: [ProductCategory], order: [['name', 'ASC']] });
        res.status(200).json({ data: productServices });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
exports.createProductService = async (req, res, next) => {
    // permission
    const _permission = 2; // create
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);

    if (!_status) return res.status(403).send("")

    try {
        const newRecord = ProductService.build({
            category_id: req.body.category_id,
            name: req.body.name,
            description: req.body.description,
            image: null,
            price: req.body.price,
            billing_type: req.body.billing_type,
            recurring_interval: req.body.recurring_interval,
            stock_quantity: req.body.stock_quantity || 0,
            usage_limit: req.body.usage_limit || 0,
            status: req.body.status,
        });

        await newRecord.save();
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
exports.updateProductService = async (req, res, next) => {
    // permission
    const _permission = 5; // update
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    
    if (!_status) return res.status(403).send("")

    try {
        const updates = {
            category_id: req.body.category_id,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            billing_type: req.body.billing_type,
            recurring_interval: req.body.recurring_interval,
            stock_quantity: req.body.stock_quantity || 0,
            usage_limit: req.body.usage_limit || 0,
            status: req.body.status,
        };
        
        await ProductService.update(updates, { where: { id: req.body.id } });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
exports.deleteProductService = async (req, res, next) => {
    // permission
    const _permission = 7; // delete
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    
    if (!_status) return res.status(403).send("")

    try {
        await ProductService.destroy({ where: { id: req.body.id } });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.uploadImage = async (req, res, next) => {
    // permission
    const _permission = 5; // update
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    
    if (!_status) return res.status(403).json({ status: 'error', message: 'Permission denied' });

    // Use multer to handle file upload
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // Multer error occurred
            return res.status(400).json({ status: 'error', message: err.message });
        } else if (err) {
            // Unknown error occurred
            return res.status(500).json({ status: 'error', message: err.message });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'No image file uploaded' });
        }

        const productId = req.body.id;
        const destination = './public/assets/images/product_service';

        try {
            const productService = await ProductService.findOne({ where: { id: productId } });
            
            if (!productService) {
                // Delete uploaded file if product not found
                fs.unlinkSync(path.join(destination, req.file.filename));
                return res.status(404).json({ status: 'error', message: 'Product/Service not found' });
            }

            // Delete old image if exists
            if (productService.image_url) {
                try {
                    await util_upload.deleteOldFile(productService.image_url, destination);
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }

            // Update with new image
            await ProductService.update({ image_url: req.file.filename }, { where: { id: productId } });
            res.status(200).json({ status: 'success', image: req.file.filename });
        } catch (error) {
            // Delete uploaded file on error
            if (req.file) {
                fs.unlinkSync(path.join(destination, req.file.filename));
            }
            res.status(500).json({ status: 'error', message: error.message });
        }
    });
};

exports.deleteImage = async (req, res, next) => {
    // permission
    const _permission = 5; // update
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
    
    if (!_status) return res.status(403).send("")

    const destination = './public/assets/images/product_service';
    const productId = req.body.id;

    try {
        const productService = await ProductService.findOne({ where: { id: productId } });
        
        if (!productService) {
            return res.status(404).json({ status: 'error', message: 'Product/Service not found' });
        }

        // Delete image file if exists
        if (productService.image_url) {
            try {
                await util_upload.deleteOldFile(productService.image_url, destination);
            } catch (err) {
                console.error('Error deleting image:', err);
            }
        }

        // Update database to remove image reference
        await ProductService.update({ image_url: null }, { where: { id: productId } });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.readCategories = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);

    if (!_status) return res.status(403).send("")

    try {
        const categories = await ProductCategory.findAll({ where: { status: 1 }, order: [['name', 'ASC']] });
        res.status(200).json({ data: categories });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.chosenProductService = async (req, res, next) => {
    // permission
    const _permission = 3; // read
    const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);

    if (!_status) return res.status(403).send("")

    try {
        const productService = await ProductService.findOne({ where: { id: req.body.id } });
        res.status(200).json({ data: productService });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
