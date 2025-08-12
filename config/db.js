const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const Objectid = Schema.ObjectId;
mongoose.connect('process.env.MONGO_URL')

const users = new Schema({
    firstName : String,
    lastName : String,
    email : String,
    password : String,
    token : String
})

const admins = new Schema({
    firstName : String,
    lastName : String,
    email : String,
    password : String,
    token : String
})

const carts = new Schema({
    userID : Objectid,
    items : [{
        productID : Objectid,
        quantity : Number
    }],
    lastUpdated : {
        type : Date,
        default : Date.now
    }
})

const products = new Schema({
    name : String,
    description : String,
    price : Number,
    category : String,
    stock : Number,
    imgUrl : String,
    createdAt : Date,
    lastUpdates : {
        type : Date,
        default : Date,
    }
})

const orders = new Schema({
    userID : Objectid,
    items : [{
        productID : Objectid,
        quantity : Number,
        price : Number
    }],
    totalAmount : Number,
    purchaseDate : Date
})

const userModel = mongoose.model('users', users)
const adminModel = mongoose.model('admins', admins)
const productModel = mongoose.model('products', products)
const cartsModel = mongoose.model('carts', carts)
const orderModel = mongoose.model('orders', orders)

module.exports = {
    userModel,
    adminModel,
    productModel,
    cartsModel,
    orderModel
}