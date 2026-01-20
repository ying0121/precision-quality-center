const express = require('express');
const router = express.Router()

const ProductCategoryController = require('../../app/controllers/settings/ProductCategoryController');

router.get('/', ProductCategoryController.productCategoryPage);
router.post('/read', ProductCategoryController.readProductCategories);
router.post('/create', ProductCategoryController.createProductCategory);
router.post('/update', ProductCategoryController.updateProductCategory);
router.post('/delete', ProductCategoryController.deleteProductCategory);

module.exports = router;
