const jwt = require('jsonwebtoken')
const helperStatus = require('../utils/status.js')

require("dotenv").config()
module.exports = async (req,res,next)=>{
    try {
        const token = req.header("token") ;
        if(!token) res.status(helperStatus.status.unauthorized).send("Not Authorized") ;
        const payload = jwt.verify(token,process.env.SECRET_KEY) ;
        //console.log(payload)
        if(!payload.is_admin) return res.status(helperStatus.status.unauthorized).send("Not Authorized") ;
        req.user_id = payload.user_id ;
        req.is_admin = payload.is_admin;
        req.username = payload.username ;
        next() ;
    } catch (err) {
       //console.log(err.message) ; 
        return res.status(helperStatus.status.error).send(err.message) ;
    }
};
