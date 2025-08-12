const express = require('express')
const {z, email} = require('zod')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Router} = require('express')
const {adminModel , productModel, cartsModel, orderModel} = require('../config/db')
const {userAuth, adminAuth} = require('../config/auth')
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET
const app = express();
adminRoutes = Router();
adminRoutes.post('/signup',async function(req, res){
    const dataValidation = z.object({
        firstName : z.string().min(3).max(50),
        lastName : z.string().min(3).max(50),
        email : z.string().min(3).max(50).email(),
        password : z.string().min(3).max(50)
    })
    const parsedData = dataValidation.safeParse(req.body);

    if(!parsedData.success){
        return res.status(403).json({
            message : "Invalid Validation"
        })
    }
    const {firstName, lastName, email, password} = req.body;
    const hashedPass = await bcrypt.hash(password, 5);
    try{
        await adminModel.create({
            firstName,
            lastName,
            email,
            password : hashedPass
        })
        
        res.json({
            message : "Admin Registered"
        })
    }catch(e){
        console.log(hashedPass)
        return res.status(403).json({
            message : "Error Creating Admin"
        })
    }
});

adminRoutes.post('/login',async function(req, res){
    const {email, password} = req.body;
    const fetchData = await adminModel.findOne({
        email
    })
    if(!fetchData){
        return res.status(403).json({
            message: "Admin Not Found!, Please signUp first"
        })
    }else{
        const token = jwt.sign({
            _id : fetchData._id 
        },ADMIN_JWT_SECRET)

        await adminModel.updateOne({
            _id : fetchData._id
        },{
            token : token
        })
        res.json({
            token : token
        })
    }
});



adminRoutes.post('/product',adminAuth,async function(req, res){
    const {name, description, price, category, stock, imgUrl} = req.body;
    const adminID = req.id;
    try{

    await productModel.create({
        name,
        description,
        price,
        category,
        stock,
        imgUrl,
        adminID
    })
    res.json({
        message : "Product Added!"
    })
    }catch(e){
        return res.status(403).json({
            message : "Error creating product!"
        })
    }
});

adminRoutes.get('/products', adminAuth, async function (req, res) {
    try {
        const confirmAdmin = await adminModel.findById(req.id);
        if (!confirmAdmin) {
            return res.status(403).json({ message: "You are not an Admin" });
        }

        const allProducts = await productModel.find({});
        if (allProducts.length === 0) {
            return res.status(404).json({ message: "No products!" });
        }

        res.json({ allProducts });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Error occurred" });
    }
});

adminRoutes.get('/products/:id',adminAuth,async function(req, res){
    const productID = req.params.id
    try {
        const confirmAdmin = await adminModel.findById(req.id);
        if (!confirmAdmin) {
            return res.status(403).json({ message: "You are not an Admin" });
        }
        
        const productDetails = await productModel.findById(productID);
        if(productDetails.length == 0 ){
            return res.status(403).json({
                message : "Product not found"
            })
        }else{
            res.json({
                productDetails
            })
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Error occurred" });
    }
});


adminRoutes.put('/products/:id',adminAuth,async function(req, res){
    const productID = req.params.id
    try {
        const confirmAdmin = await adminModel.findById(req.id);
        if (!confirmAdmin) {
            console.log(confirmAdmin)
            return res.status(403).json({ message: "You are not an Admin" });
        }
        const {name,description,price,category,stock,imgUrl } = req.body;
        const updatedProduct = await productModel.findOneAndUpdate({
            _id : productID
        },{
            name,
            description,
            price,
            category,
            stock,
            imgUrl,        
        },{new : true})

        res.json({
            message : "Product Updated Successfully",
    
            updatedProduct
        })
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Error occurred" });
    }

});

adminRoutes.delete('/products/:id',adminAuth,async function(req, res){
    const productID = req.params.id
    try {
        const confirmAdmin = await adminModel.findById(req.id);
        if (!confirmAdmin) {
            console.log(confirmAdmin)
            return res.status(403).json({ message: "You are not an Admin" });
        }
        
        const deletedProduct = await productModel.findByIdAndDelete(productID);

        res.json({
            message : "Product Deleted Successfully",
            deletedProduct
        })
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Error occurred" });
    }

});
module.exports = {
    adminRoutes
}

