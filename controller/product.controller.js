const Product = require('../model/Product');
const PAGE_SIZE = 2;
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
        const cond = name ? {name: {$regex:name,$options:'i'}} : {};
        let query = Product.find(cond);
        let response = {status: "success"};
        if (page) {
            query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
            // 최종 몇개 페이지
            // 데이터 총 개수 / PAGE_SIZE
            const totalItemNum = await Product.countDocuments(cond);
            const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
            response.totalPageNum = totalPageNum;
        }

        const productList = await query.exec();
        response.data = productList;
        res.status(200).json(response);
    } catch(error){
        res.status(400).json({status:'fail',error:error.message});
    }
};

productController.updateProduct = async(req,res) => {
    try{
        const productId = req.params.id;
        const {
            sku,
            name,
            size, 
            image, 
            price, 
            description, 
            category, 
            stock, 
            status
        } = req.body;
        const product = await Product.findByIdAndUpdate(
            {_id: productId},
            {sku, name, size, image, price, description, category, stock, status},
            {new:true}
        );
        if (!product) throw new Error("item doesn't exist");
        res.status(200).json({status:'success', data: product})
    } catch(error){
        res.status(400).json({status:'faaail',error:error.message});
    }
}

module.exports = productController;