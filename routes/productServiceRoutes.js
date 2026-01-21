const express = require('express');
const router = express.Router()

const ProductServiceController = require('../app/controllers/ProductServiceController');

router.get('/', ProductServiceController.productServicePage);
router.post('/read', ProductServiceController.readProductServices);
router.post('/read-categories', ProductServiceController.readCategories);
router.post('/chosen', ProductServiceController.chosenProductService);
router.post('/create', ProductServiceController.createProductService);
router.post('/update', ProductServiceController.updateProductService);
router.post('/delete', ProductServiceController.deleteProductService);

router.post('/upload-image', ProductServiceController.uploadImage);
router.post('/delete-image', ProductServiceController.deleteImage);

module.exports = router;
