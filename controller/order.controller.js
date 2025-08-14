const Order = require('../model/Order');
const orderController = {};
const {randomStringGenerator} = require('../utils/randomStringGenerator');
const productController = require('./product.controller');
const PAGE_SIZE = 3;

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

orderController.getOrderList = async (req, res) => {
  try {
    let { page, orderNum } = req.query;
    page = Number(page);
    const cond = orderNum
      ? { orderNum: { $regex: orderNum, $options: 'i' } }
      : {};

    const totalItemNum = await Order.countDocuments(cond);
    const totalPageNum = Math.max(1, Math.ceil(totalItemNum / PAGE_SIZE));

    const orders = await Order.find(cond)
      .populate({ path: 'items.productId', model: 'Product' })
      .populate({ path: 'userId', model: 'User', select: 'email' })
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean();

    const data = orders.map((o) => {
      const totalPrice = (o.items || []).reduce(
        (sum, it) => sum + it.price * it.qty,
        0
      );
      return { ...o, totalPrice };
    });

    // 5) 응답
    return res.status(200).json({
      status: 'success',
      totalPageNum,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItemNum,
      data,
    });
  } catch (error) {
    console.error('[getOrderList] error:', error);
    return res.status(400).json({ status: 'fail', error: error.message });
  }
};


orderController.updateOrderList = async(req,res) => {
    try{
        const orderId = req.params.id;
        const {stat} = req.body;
        let order = await Order.findByIdAndUpdate(
            orderId,
            {status:stat},
            {new:true}
        );
        res.status(200).json({status:'success',data:order});
    } catch(error){
        res.status(400).json({status:'fail',error:error.message});
    }
}

module.exports=orderController;