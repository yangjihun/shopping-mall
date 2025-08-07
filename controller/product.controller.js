const Product = require('../model/Product');
const productController = {};
productController.createProduct = async(req,res) => {
    try{
        const {sku,name,size,image,category,description,price,stock,status} = req.body;
        const product = new Product({
            sku,
            name,
            size,
            image,
            category,
            description,
            price,
            stock,
            status
        });

        await product.save();
        res.status(200).json({status:'success',product});
    } catch(error){
        res.status(400).json({status:'fail',error:error.message});
    }
};

productController.getProducts = async(req,res) => {
    try{
        const {page,name} = req.query;
        // if (name) {
        //     const products = await Product.find({name:{$regex:name,$options:'i'}}) // i: 대소문자 구분 x
        // } else {
        //     const products = await Product.find({});
        // }
        const cond = name ? {name: {$regex:name,$options:'i'}} : {}
        let query = Product.find(cond);

        const productList = await query.exec();
        res.status(200).json({status:'success', data: productList});
    } catch(error){
        res.status(400).json({status:'fail',error:error.message});
    }
};


module.exports = productController;