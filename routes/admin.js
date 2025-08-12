const express = require('express')
const {z} = require('zod')
const bcrypt = require('bcrypt')
const {Router} = require('express')
const {adminModel , productModel, cartsModel, orderModel} = require('../config/db')
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

    const hashedPass = await bcrypt.hash(password, 5);
    try{
        await adminModel.create({
            firstName,
            lastName,
            email,
            hashedPass
        })

        res.json({
            message : "Admin Registered"
        })
    }catch(e){
        return res.status(403).json({
            message : "Error Creating Admin"
        })
    }


});

adminRoutes.post('/login', function(req, res){
});

adminRoutes.get('/products', function(req, res){

});

adminRoutes.post('/products', function(req, res){
    
});

adminRoutes.get('/products:id', function(req, res){
});


adminRoutes.put('/products:id', function(req, res){
});

adminRoutes.delete('/products:id', function(req, res){
});
module.exports = {
    adminRoutes
}
app.listen(3000);
