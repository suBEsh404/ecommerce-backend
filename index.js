const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const{ userRoutes } = require('./routes/user')
const{ adminRoutes } = require('./routes/admin')
const app = express();
app.use(express.json())

app.use('/user',userRoutes)
app.use('/admin',adminRoutes)


async function main(){
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(5000);
    console.log("Server Running")

};
main();
