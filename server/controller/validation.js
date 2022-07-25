const Joi = require('@hapi/joi') ;

function validinfo(data){
    const schema = Joi.object({
        first_name : Joi.string().required(),
        last_name : Joi.string().required(),
        username : Joi.string().required(),
        password : Joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(6).required(),
        phone_number : Joi.string().length(10).pattern(/^[0-9]+$/).required() ,
        email : Joi.string().min(6).required().email() ,
        is_active :Joi.boolean().required(),
        is_admin : Joi.boolean().required()
    });
    return schema.validate(data) ;
}
function validupdateinfo(data){
    const schema = Joi.object({
        first_name : Joi.string(),
        last_name : Joi.string(),
        username : Joi.string(),
        password : Joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(6),
        phone_number : Joi.string().length(10).pattern(/^[0-9]+$/),
        email : Joi.string().min(6).email() ,
        is_active :Joi.boolean(),
        is_admin : Joi.boolean()
    });
    return schema.validate(data) ;
}
module.exports = {validinfo,validupdateinfo};