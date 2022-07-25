const jwt = require('jsonwebtoken')
const helperStatus = require('../utils/status.js')

require('dotenv').config();

function jwtGenerator(username ,user_id,isAdmin) {
    const payload = {
        user_id : user_id ,
        username : username ,
        is_admin : isAdmin
    }
   // console.log(payload)
    return jwt.sign(payload,process.env.SECRET_KEY , {expiresIn:"1hr"}) 
}
module.exports = jwtGenerator
