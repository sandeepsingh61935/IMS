# Authorization :
 Using the JWT token as request header to verify whether the request is made by an admin user or not .Below is the gist of code to accomplish this  authorization:
 	```
	   const token = req.header("token") ;
       if(!token) res.status(helperStatus.status.unauthorized).send("Not authorized") ;
       const payload = jwt.verify(token,process.env.SECRET_KEY) ;
       if(!payload.token.is_admin) return res.status(helperStatus.status.unauthorized).send("Not authorized") ;
       req.user = payload.user ;
       req.is_admin = payload.is_admin;
	```
# Validation:

Using @hapi/joi library validation of data entry at the time of creating and updating a user is performed.
Here is the schema that validate the information :
```
const schema = Joi.object({
       first_name : Joi.string().required(),
       last_name : Joi.string().required(),
       username : Joi.string().required(),
       password : Joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(6).required(),
       phone_number :Joi.string().length(10).pattern(/^[0-9]+$/).required() ,
       email : Joi.string().min(6).required().email() ,
       is_active :Joi.boolean().required(),
       is_admin : Joi.boolean().required()
   });
   return schema.validate(data) ;
   ```
# HTTP Requests 
All API requests are made by sending a secure HTTPS request using one of the following methods, depending on the action being taken:
## POST : this action is taken in case of registering , login a user .
## PUT : Update a user
## GET : Get a list of users

```
  only admin can Register , include token of admin in header ---> (GET)  http://localhost:3000/api/user/auth/register
  LOGIN (POST): http://localhost:3000/api/user/auth/login
  QUERY(POST) egt all users with applied filter: http://localhost:3000/api/user/auth/users?is_admin=false&is_active=true 
  only admin can update(PUT)  : http://localhost:3000/api/user/auth/update/11
  get all users(GET) : http://localhost:3000/api/user/auth/users
```
# Password Encryption using bcrypt 
Password is encrypted using bcrypt library to ensure the security and in case http response is send with password.
Below a code snippet for encryption:
```
let hash =  bcrypt.hashSync(password, 10) ;
```
# JWT token generation and validation :
JWT token contains 3 parts : header , payload and hash of these two. In my case 
```
Payload :
const payload = {
       user_id : user_id ,
       usename : username ,
       is_admin : isAdmin
   }
```
This payload is signed using private key which is store at the server and this signature expires in 1hr.It means after 1 hour your session will be logged out and you have to login again to get in.Below a code snippet related to the same :
```
jwt.sign(payload,process.env.SECRET_KEY , {expiresIn:"1hr"})
```
# Database server : 
I have used Postgresql database  and to integrate Postgresql database pg package is required.
Once this is done, you require pg.Client class object that requires information like port , user, password, and database name and after that you will be able to connect your application to database server. Below a code snippet related to database :
```
var connectionString = "postgres://postgres:san35singh@localhost:5432/identity_database";
const pgClient = new pg.Client(connectionString) ;
pgClient.connect();
```
# Model:
```
module.exports = (sequelize,Sequelize)=>{
   var user= sequelize.define('users',{
     id:{
         field : 'id',
         type:Sequelize.INTEGER ,
         primaryKey : true ,
         autoIncrement : true
     },
     first_name:{
         field : 'first_name',
         type: Sequelize.STRING,
         allowNull: false,
     },
     last_name:{
         field : 'last_name',
         type: Sequelize.STRING,
         allowNull: false,
     },
     username:{
         field : 'username',
         type: Sequelize.STRING,
         allowNull: false,
         unique: true,
     },
     password:{
         field : 'password',
         type: Sequelize.STRING,
         allowNull: false,
         unique: false,
     },
     phone_number:{
         field : 'phone_number',
         type: Sequelize.STRING,
         allowNull: false,
         unique: true,
     },
     email:{
         field : 'email',
         type: Sequelize.STRING,
         allowNull: false,
         unique: true,
     },
     is_active:{
         field : 'is_active',
         type: Sequelize.BOOLEAN,
         allowNull: false,
         unique :false
     },
     is_admin:{
         field : 'is_admin',
         type: Sequelize.BOOLEAN,
         allowNull: false,
         unique: false,
     },updatedAt:{
          field: 'updatedat' ,
          type : Sequelize.DATE ,
      },
      updatedBy:{
        field: 'updatedby' ,
        type : Sequelize.DATE ,
    },
    createdAt:{
        field: 'createdat' ,
        type : Sequelize.DATE ,
    }
 }, {
   timestamps: false
 });
 return user ;
 
}
 ```
 


# HTTP Response Codes
Each response will be returned with one of the following HTTP status codes:
```
 success: 200,
 error: 500,
 notfound: 404,
 unauthorized: 401,
 conflict: 409,
 created: 201,
 bad: 400,
 nocontent: 204
```
# Record Filtering :

## For phone number :
```
http://localhost:3000/api/user/auth/user?phone_number = “8475834533” 
```
## For is_admin and is_active:
```
http://localhost:3000/api/user/auth/uses? is_admin = true & is_active=false 
```
## For Email Like : 
```
http://localhost:3000/api/user/auth/uses?Email =”asefae”
```

# Redis Cache and invalidation:
Redis Client: 
At port : 6379
```
client = redis.createClient(6379 , (err,res)=>{
   console.log(res) ;
}) ;
```
Username is cached with key as id  and ttl is 1hr (3600s):
```
client.setex(id, 3600,res.rows[0].username) ;
```

# Dependencies:
```
"dependencies":
{
   "@hapi/joi": "^17.1.1",
   "bcrypt": "^5.0.0",
   "body-parser": "^1.19.0",
   "cors": "^2.8.5",
   "dotenv": "^8.2.0",
   "express": "^4.17.1",
   "jsonwebtoken": "^8.5.1",
   "node-fetch": "^2.6.0",
   "nodemon": "^2.0.4",
   "pg": "^8.3.0",
   "postgresql": "0.0.1",
   "redis": "^3.0.2",
   "sequelize": "^6.3.3"
 }
 ```

