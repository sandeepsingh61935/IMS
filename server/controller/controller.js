const db = require("../dbconnect")
const dbUser = db.user ;
const statushelper = require('../utils/status')
const validity_check = require('./validation');
const jwtGenerator = require('../utils/jwtGenerator');
const bcrypt = require('bcrypt') ; 
const redis = require('redis')
const express = require('express') ;
require("dotenv").config()
const jwt = require('jsonwebtoken')
const { valid } = require("@hapi/joi");
const  config  = require('./config');
express().use(express.json()) ;

// setting up producer to push message to topic 'topic1'
const kafka = require('kafka-node')
const Producer = kafka.Producer
const Kclient = new kafka.KafkaClient(config.kafka_server)
const producer = new Producer(Kclient)   


//create and connect redis client
client = redis.createClient(6379 , (err,res)=>{
    console.log(res) ;
}) ;



//create a user 
exports.create = async (req,res)=>{
 // Validate request
 // validity_check.validinfo returns valid object representing a valid user
 try{ var user = validity_check.validinfo(req.body) ;}
      //console.log(user.value.username) ;}
 catch(error) { return res.status(statushelper.status.error).send(error.message + "sefsef") ;}
  user.value.created_at  = new Date() ;
 let hash =  bcrypt.hashSync(user.value.password, 10) ;
 user.value.password = hash ;
  // Save User in the database
 // console.log(user) ;
  await dbUser.create(user.value)
    .then(data => {
        //creating payload
        payloads = [
          { topic: 'topic1', messages: [data.username ,data.id,data.is_admin,Date.now()] }
        ];
        //pushing payload to broker
        producer.on('ready', function () {
        producer.send(payloads, function (err, info) {
            console.log(info);
        });
        });
        producer.on('error', function (err) {
        throw err ;
        })
        const jwtToken =jwtGenerator(data.username ,data.id,data.is_admin) ;
          return res.send(jwtToken +"\n" + "user id " + data.id) 
    })
    .catch(err => {
      return res.status(statushelper.status.error).send({
        message:
          err.message || "Some error occurred while registering."
      });
    });
  }
// retrieve all users with few filters
exports.findAll =  async (req, res) => {
  await dbUser.findAll({
    where : req.query
  })
  .then(data => {
     return res.status(statushelper.status.success).send(data) ;
  })
  .catch(err => {
      return res.status(statushelper.status.error).send({
      message:
        err.message
    });
  })
};
// find a single user with an id 
exports.findOne = (req, res) => {
    const id = req.params.id;
   // console.log(id)
    return client.get(id,async (err,cache)=>{
                if(err) return res.status(statushelper.status.error).send(statushelper.errorMessage)
                if(cache){
                    console.log("fetching from cache")
                    return res.status(statushelper.status.success).send(cache) ;
                }
                else  {
                    dbUser.findByPk(id)
                    .then(data => {
                          //console.log(typeof data) ;
                               client.setex(id, 3600,JSON.stringify(data)) ;
                                return res.send(data) ;
                    })
               }
            });
};
//update a user by  an id 
exports.update = async (req, res) => {
    const id = req.params.id;
    const token = req.header("token") ;
    const payload = jwt.verify(token,process.env.SECRET_KEY) ;
    req.body.updated_by =  payload.username;
    req.body.updated_at = new Date() ;
    console.log(req.body)
     await dbUser.update(req.body, {
      where:[{ id: id }],
      defaults:{id:id}
    })
      .then(num => {
        if (num == 1) {
          console.log(num)
          return new Promise((resolve,reject)=>{    
            client.del(id,(err, result)=>{ 
              if(err) reject(err) ; 
              res.send({
                message: "User was updated successfully.",
                data: req.body 
              });
              resolve(res)
            })
          })
          
        } else {
          return res.send({
            message: `Cannot update user with id=${id}. Maybe User was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        console.log(err.message) ;
        return res.status(statushelper.status.error).send({
          message: err.message
        });
      });
};

exports.login =async (req,res)=> {
        const { email , password} = req.body 
        var condition = {
            email : email 
        }
      
          dbUser.findAll({ where: condition })
          .then(data => {
            if(!data[0].dataValues) return res.status(statushelper.status.notfound).send("email or password is incorrect") ;
            const isValidPassword =  bcrypt.compare(password,data.password) ;
            if(!isValidPassword) return res.status(statushelper.status.notfound).send("email or password is incorrect") ;
            const token = jwtGenerator(data[0].dataValues.username,data[0].dataValues.id,data[0].dataValues.is_admin)  ;
            return res.status(statushelper.status.success).json({message:statushelper.successMessage , token : token,data:data});
          }).catch(err => {
              return res.status(statushelper.status.error).send(err.message) ;
          })
}

