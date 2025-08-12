const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const{ userRoutes, adminRoutes } = require('./index')
const app = express();

app.use('/user',userRoutes)
app.use('/admin',adminRoutes)
app.use('/product',productRoutes)
app.use('/order',userRoutes)

async function main(){
    await mongoose.connect('MONGO_URL')
    app.listen(3000);
};
main();
