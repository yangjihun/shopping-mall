const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const productController = require('../controller/product.controller');

router.post(
    '/',
    authController.authenticate,
    authController.checkAdminPermission,
    productController.createProduct
);

router.get('/', productController.getProducts);

router.put(
    '/:id',
    authController.authenticate,
    authController.checkAdminPermission,
    productController.updateProduct
);

router.get(
    '/:id',
    productController.getProductDetail
);

router.delete(
    '/:id',
    authController.authenticate,
    authController.checkAdminPermission,
    productController.deleteProduct
)

module.exports = router;