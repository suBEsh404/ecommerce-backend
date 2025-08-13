const express = require('express')
const {z} = require('zod')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Router} = require('express')
const { userModel, productModel, cartsModel, orderModel} = require('../config/db')
const {userAuth} = require('../config/auth')
const USER_JWT_SECRET = process.env.USER_JWT_SECRET
const app = express();
userRoutes = Router();

userRoutes.post('/signup',async function(req, res){
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
        await userModel.create({
            firstName,
            lastName,
            email,
            password : hashedPass
        })
        
        res.json({
            message : "User Registered"
        })
    }catch(e){
        console.log(hashedPass)
        return res.status(403).json({
            message : "Error Creating User"
        })
    }
});

userRoutes.post('/login',async function(req, res){
    const {email, password} = req.body;
    const fetchData = await userModel.findOne({
        email
    })
    if(!fetchData){
        return res.status(403).json({
            message: "Admin Not Found!, Please signUp first"
        })
    }
    const checkPass = await bcrypt.compare( password,fetchData.password);
    if(!checkPass){
        return res.status(403).json({
            message : "Invalid Credentials"
        })
    };
        const token = jwt.sign({
            _id : fetchData._id 
        },USER_JWT_SECRET)

        await userModel.updateOne({
            _id : fetchData._id
        },{
            token : token
        })
        res.json({
            token : token
        })
});

userRoutes.post('/cart',userAuth,async function(req, res){
    const userID = req.id;
    const productID = req.body.productID;
    const quantity = req.body.quantity;
    const productIncrement = await cartsModel.findOne({
        userID,
        "items.productID": productID
    })
    console.log(productIncrement)

    if(!productIncrement){
        await cartsModel.updateOne({
            userID,
        },{$push : {items:{productID, quantity}}}),
        {$upsert : true}

        res.json({
            message : "Product added to cart"
        })
        return
    }else{
        const productQuantityUpdated = await cartsModel.findOneAndUpdate({
            userID,
            "items.productID": productID
        },{
            $inc: { "items.$.quantity": quantity }
        },{
            new :true
        }
    )   
    res.json({
        message : productQuantityUpdated
    })
}

});

userRoutes.get('/cart',userAuth,async function(req, res){
    const userID = req.id;
    const allProduct = await cartsModel.find({userID});
    res.json({
        allProduct
    })
});

userRoutes.delete('/cart/:productID',userAuth,async function(req, res){
    const userID = req.id;
    const productID = req.params.productID

    const updatedProduct = await cartsModel.findOneAndUpdate({
        userID,
        "items.productID" : productID
    },{$pull:{items: {productID}}},
    {
        new : true
    })
    console.log(updatedProduct)
    if(!updatedProduct){
        return res.status(403).json({
            message : "Product not found!"
        })
    }
    res.json({
        updatedProduct
    })
});


userRoutes.post('/orders',userAuth,async function(req, res){
    const userID = req.id;
    const {productID, quantity, price, totalAmount} = req.body;
    try{
    await orderModel.create({
        userID,
        items:[{
            productID,
            quantity,
            price
        }],
        totalAmount
    })
    res.json({
        message : "Order Created"
    })
    }catch(e){
        return req.status(403).json({
            message : "Error creating Order!"
        })
    }

    

});

userRoutes.get('/orders',userAuth,async function(req, res){
    const userID = req.id;
    const allOrders = await orderModel.find({userID});
    if(!allOrders){
        return res.status(403).json({
            message : "No orders"
        })
    }
    res.json({
        allOrders
    })
});

module.exports = {
    userRoutes
}
