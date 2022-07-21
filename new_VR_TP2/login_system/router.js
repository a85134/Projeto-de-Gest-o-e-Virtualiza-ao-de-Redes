const e = require("express");

var express= require("express");
var router = express.Router();

const credential={
    email:"camila@gmail.com",
    password:"123"
}

//login user

router.post('/login',(req,res)=>{
    if(req.body.email==credential.email && req.body.password == credential.password){
        req.session.user =req.body.email;
        res.end("login sucess")
    }
    else{
        res.end("Invalid Username")
    }
});

module.exports = router;