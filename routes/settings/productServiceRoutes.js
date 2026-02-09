const express = require('express');
const router = express.Router();

const ProductServiceController = require('../../app/controllers/settings/ProductServiceController');

function handleUploadError(err, req, res, next) {
    if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ status: 'error', message: 'File too large. Max 100MB per file.' });
        }
        return res.status(400).json({ status: 'error', message: err.message || 'Upload failed' });
    }
    next();
}

router.get('/', ProductServiceController.productServicePage);
router.post('/read', ProductServiceController.readProductServices);
router.post('/create', ProductServiceController.uploadProductServiceFiles, handleUploadError, ProductServiceController.createProductService);
router.post('/update', ProductServiceController.uploadProductServiceFiles, handleUploadError, ProductServiceController.updateProductService);
router.post('/delete', ProductServiceController.deleteProductService);

module.exports = router;
