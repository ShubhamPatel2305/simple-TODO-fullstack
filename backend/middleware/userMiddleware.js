// import zod, jwt, anddatabses
const zod = require('zod');
const jwt = require('jsonwebtoken');
const { User,Todo } = require('../db/index');

//build user schema using zod
const userSchema = zod.object({
    uname: zod.string().min(3).max(255),
    pass: zod.string().min(7).max(255)
});

function inputValidationMiddleware(req,res,next){
    //using safeparse
    const res=userSchema.safeParse(req.body);
    if(res.success){
        next();
    }
    else{
        res.status(400).json({msg:"Invalid inputs"});
    }
}

async function signupMiddleware(req,res,next){
    //input validation done just check if same user exits 
    const uname=req.body.uname;
    const user=User.findOne({uname});
    if(user){
        res.status(400).json({msg:"User already exists"});
    }
    else{
        next();
    }
} 

//export
module.exports={inputValidationMiddleware, signupMiddleware};