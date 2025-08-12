const express = require('express')
const {Router} = require('express')
const app = express();
adminRoutes = Router();
adminRoutes.post('/signup', function(req, res){
    const firstName = req.body.firstName
});

adminRoutes.post('/login', function(req, res){
});

adminRoutes.get('/products', function(req, res){
});

adminRoutes.get('/products:id', function(req, res){
});

adminRoutes.post('/products', function(req, res){
    
});

adminRoutes.put('/products:id', function(req, res){
});

adminRoutes.delete('/products:id', function(req, res){
});
module.exports = {
    adminRoutes
}
app.listen(3000);
