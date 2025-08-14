const Order = require('../model/Order');
const orderController = {};
const {randomStringGenerator} = require('../utils/randomStringGenerator');
const productController = require('./product.controller');

orderController.createOrder = async(req,res) => {
    try{
        const {userId} = req;
        const {shipTo, contact, totalPrice, orderList} = req.body;
        // 재고 확인 & 재고 업데이트
        const insufficientStockItems = await productController.checkItemListStock(orderList);
        if (insufficientStockItems.length > 0) {
            const errorMessage = insufficientStockItems.reduce(
                (total, item) => total+=item.message,
                ''
            );
            throw new Error(errorMessage);
        }
        const newOrder = new Order({
            userId,
            totalPrice,
            shipTo,
            contact,
            items: orderList,
            orderNum:randomStringGenerator()
        });

        await newOrder.save();
        res.status(200).json({status:'success',orderNum: newOrder.orderNum});
    } catch(error){
        res.status(400).json({status:'fail', error: error.message});
    }
}

orderController.getOrder = async(req,res) => {
    try{
        const {userId} = req;
        let order = await Order.find({userId})
            .populate({
                path: 'items.productId',
                model:'Product'
            });
        order = order.map(order => {
            const totalPrice = order.items.reduce((sum, item) => {
                return sum + (item.price * item.qty);
            }, 0);
            return {...order.toObject(), totalPrice};
        });
        res.status(200).json({status:'success', data:order});
    } catch(error){
        res.status(400).json({status:'fail', error:error.message});
    }
}

module.exports=orderController;