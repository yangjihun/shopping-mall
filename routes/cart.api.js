const express = require('express');
const authController = require('../controller/auth.controller');
const cartController = require('../controller/cart.controller');
const router = express.Router();

router.post('/', authController.authenticate, cartController.addItemToCart);

router.get('/', authController.authenticate, cartController.getCart);

router.put('/',authController.authenticate, cartController.updateCart)

module.exports = router;