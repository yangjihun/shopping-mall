const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const orderController = require('../controller/order.controller');

router.post('/', authController.authenticate, orderController.createOrder);

router.get('/', authController.authenticate, orderController.getOrder);

module.exports=router;