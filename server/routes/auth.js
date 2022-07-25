const express = require('express') ;
const router  = express.Router() ;
const authorization = require('../middleware/authorization');
const dbcontroller = require('../controller/controller')
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
//middlware

// register
router.post('/register',dbcontroller.create) ;
//login
router.post('/login',dbcontroller.login) ;
// get user by an id 
router.get('/user/:id',dbcontroller.findOne) ;
// get all users based upon a filter
router.get('/users',dbcontroller.findAll) ;
// verify token 
//router.get('/is-verify',authorization,dbcontroller.isverify) ;
// update using an id
router.put('/update/:id',authorization,dbcontroller.update)


module.exports = router ;





































// // register 
// router.post('/register',authorization, async(req,result)=>
// {   
//     const {error} = validity_check.validinfo(req.body) ;
//    if(error) return result.status(helperStatus.status.error).send(error.message) ;
//     var encryptPass='' ;
//     try{
//         // console.log('sdkfjahsd f') ;
//         //step1: destructure the req.body
//           const {first_name , last_name , username , password, phone_number, email, is_active, is_admin}  = req.body ; 
//           //console.log(first_name) ;
//     //     //step 2:chec if user exists if not throw error
        
//              pgClient.query('select * from user_table where email=$1',[email], async (err,res)=>{
//                 //console.log(res) ;
//                 if(res.rows.length != 0 ) return result.status(helperStatus.status.conflict).send("User already exists") ;
//               let hash =  bcrypt.hashSync(password, 10) ;
//                 console.log(hash) ;
//               var newuser =  await pgClient.query("insert into user_table (first_name , last_name , username , password, phone_number, email, is_active, is_admin) values($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",[first_name , last_name , username , hash, phone_number, email, is_active, is_admin]) ;
//                 // step 5: then finally generate jwt token
//                 const jwtToken =jwtGenerator(newuser.rows[0].id,newuser.rows[0].is_admin) ;
//                 result.send(jwtToken) ;
//             });
        
        
//     }
//     catch(error){
//         console.error(error.message);
//         res.status(helperStatus.status.error).send(error.message) ;
//     }
// });
// //login
// router.post('/login',async (req, result)=>{
//     try{
//         const { email , password} = req.body 
//         //result.send(email);
//         await pgClient.query('select * from user_table where email=$1',[email],async (err,res)=>{
//             if(res.rows.length === 0 ) return result.status(helperStatus.status.notfound).send("email or password is incorrect") ;
//             const isValidPassword =await bcrypt.compare(password,res.rows[0].password) ;
//             if(!isValidPassword) return result.status(helperStatus.status.notfound).send("email or password is incorrect") ;
//             const token = jwtGenerator(res.rows[0].id)  ;
//             result.status(helperStatus.status.success).json({message:helperStatus.successMessage , token : token});
//         });
//     }
//     catch(error){
//         console.error(error.message);
//         res.status(helperStatus.status.error).send(error.message) ;
//     }
// });

// // is verified
// router.get('/is-verify', authorization, async (req,res)=>{
//     try {
//         res.status(helperStatus.status.success).json(true) ;
//     } catch (error) {
//         res.status(helperStatus.status.unauthorized).send(error.message) ;
//     }
// }) ;

// // get an user  by use   /////id 
// router.get('/user/:id' ,async (req,result)=>{
//     var id = req.params.id ; 
//     return client.get(id,async (err,data)=>{
        
//         if(err) return result.status(helperStatus.status.error).send(helperStatus.errorMessage)
//         if(data){
//             return result.status(helperStatus.status.success).send(data) ;
//         }
//         else  {
//             console.log("fetching data") ;
//             await pgClient.query("select * from user_table where id =$1",[id],(err,res)=>{
//                 if(err) return result.status(helperStatus.errorMessage).send(helperStatus.errorMessage) ;
//                 client.setex(id, 3600,res.rows[0].username) ;
//                  return result.send(res.rows[0].username) ;
//             })  ;
//         }
//     });
        
       
// }) ;

// //get all users 
// router.get('/users', async (req,result)=>{
//     // console.log(req.query) ;
//     //console.log(req.query )  ;
//     const {is_admin,is_active,phone_number,username} = req.query;
    
//     //filer for phonenumber 
//     if(typeof phone_number !=='undefined' ) {
//         pgClient.query("select * from user_table where phone_number = $1 ",[phone_number],async(err,res)=>{
//             if(err) return result.send(err.message ) ; 
//             result.send(res) ; 
//             return ;    
//         })
//     }
//     //filter for username  
//     if(typeof username !=='undefined' ) {
//         pgClient.query("select * from user_table where username = $1 ",[username],async(err,res)=>{
//             if(err) return result.status(helperStatus.status.notfound).send(err.message ) ; 
//             result.send(res) ; 
//             return ;    
//         })
//     }
//     //filter for is_admin and is_active
//     if(typeof is_admin !== 'undefined'  &&  typeof is_active !=='undefined'){
//         pgClient.query("select * from user_table where is_admin=$1 AND is_active=$2",[is_admin,is_active],async(err,res)=>{
//             if(err) return result.send(err.message) ;
//             console.log(res) ;
//             result.send(res) ;
//             return ;
//         })
//     }
   
//     // console.log(typeof username === 'undefined');
//     if(typeof is_admin === 'undefined'  &&  typeof is_active ==='undefined' &&
//     typeof phone_number === 'undefined'  &&  typeof user_name ==='undefined'){
//        // console.log(typeof is_admin) ;
//         pgClient.query("select * from user_table ",async (err,res)=>{
//             console.log('sefes')
//             if(err) return result.send(err.message) ;
//             result.send(res) ;
//         })  ; 
//     }
    
// }) ;

// //update a user using id
// // update only selected attributes
// router.put('/update/:id' ,authorization, async (request , response )=>{
//   let {id} = request.params.id ;
//   let { username} = request.body ;
//   let {error} = validity_check.validupdateinfo(request.body) ;
//   if(error) return response.status(helperStatus.status.error).send(error.message) ;
//   var is_admin ; 
//   pgClient.query(
//     "UPDATE user_table SET username = $1   WHERE id = $2",
//     [username ,id],
//     (error, results) => {
//       if (error) {
//          response.status(helperStatus.status.error).send(error.message) ;
//          return ;
//       }
//       //cache invalidation
//     //  client.del(id);
//      //client.setex(id,3600,username)
//       response.status(helperStatus.status.success).send("User modified") ;
//     });
// });












