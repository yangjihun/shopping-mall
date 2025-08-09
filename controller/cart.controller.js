const Cart = require('../model/Cart');

const cartController = {};
cartController.addItemToCart = async(req,res) => {
    try{
        const {userId} = req;
        const {productId, size, qty} = req.body;

        let cart = await Cart.findOne({userId});
        // 카트 없으면 카트 추가
        if (!cart) {
            cart = new Cart({userId});
            await cart.save();
        }
        // 카트 안에 이미 들어가 있는지
        const existItem = cart.items.find((item)=>item.productId.equals(productId) && item.size === size);
        if (existItem) throw new Error('아이템이 이미 카트에 존재합니다');
        // 카트에 아이템 추가
        cart.items = [...cart.items, {productId, size, qty}];
        await cart.save();
        res.status(200).json({status:'success', data:cart, cartItemQty:cart.items.length});
    } catch(error){
        res.status(400).json({status:'fail', error: error.message});
    }
}

module.exports = cartController;