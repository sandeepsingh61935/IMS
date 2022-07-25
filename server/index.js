const express = require('express') ;
const cors = require('cors') ; 
const app = express() ; 
app.use(express.json()) ; 
app.use(cors()) ;


//routes
const authRoute = require('./routes/auth') ;
app.use('/api/user/auth',authRoute) ;


app.listen(3000,()=>{
    console.log('server is up and running on port 3000') ; 
});
