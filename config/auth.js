const jwt = require('jsonwebtoken')
const USER_JWT_SECRET = process.env.USER_JWT_SECRET
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET
async function userAuth(req,res,next){
    const token = req.headers.token;
    const userId = jwt.verify(token,USER_JWT_SECRET)
    if(!userId){
        return res.status(403).json({
            message : "Invalid token"
        })
    }else{
        req.id = userId._id
        next();
    }
}

async function adminAuth(req,res,next){
    const token = req.headers.token;
    const userId = jwt.verify(token,ADMIN_JWT_SECRET)
    if(!userId){
        return res.status(403).json({
            message : "Invalid token"
        })
    }else{
        req.id = userId._id
        next();
    }
}

module.exports={
    userAuth,
    adminAuth
}


