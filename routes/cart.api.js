const express = require('express');
const authController = require('../controller/auth.controller');
const cartController = require('../controller/cart.controller');
const router = express.Router();

router.post('/', authController.authenticate, cartController.addItemToCart);

module.exports = router;