// import zod, jwt, anddatabses
const zod = require('zod');
const jwt = require('jsonwebtoken');
const { User,Todo } = require('../db/index');
require('dotenv').config({path:'../.env'});

const secret=(process.env.SECRET).toString();

//build user schema using zod
const userSchema = zod.object({
    uname: zod.string().min(3),
    pass: zod.string().min(7)
});

const todoSchema=zod.object({
    title:zod.string().min(3).max(255)
});

function inputValidationMiddleware(req,res,next){
    //using safeparse
    const result=userSchema.safeParse(req.body);
    if(result.success){
        next();
    }
    else{
        res.status(400).json({msg:"Invalid inputs"});
    }
}

async function signupMiddleware(req,res,next){
    //input validation done just check if same user exits 
    const uname=req.body.uname;
    const user=await User.findOne({uname});
    if(user){
        res.status(400).json({msg:"User already exists"});
    }
    else{
        next();
    }
} 

async function signinMiddleware(req,res,next){
    const user=User.findOne({uname:req.body.uname});
    if(user){
        next();
    }
    else{
        res.status(400).json({msg:"User does not exist"});
    }
}

async function validateTokenMiddleware(req,res,next){
    const token=req.headers["authorization"];
    if(token){
        jwt.verify(token,secret, async (err,data)=>{
            if(err){
                res.status(401).json({msg:"Unauthorized, invalid token signer dont match"});
            }else{
                //check ifuname i token and db match
                const uname=data.uname;
                const user=await User.findOne({uname:uname});
                if(user){
                    next();
                }
                else{
                    res.status(401).json({msg:"Unauthorized, user does not exist"});
                }
            }
        })
    }else{
        res.status(401).json({msg:"Unauthorized, please provide jwt token"});
    }
}

async function addTodoMiddleware(req,res,next){
    const result=todoSchema.safeParse(req.body);
    if(result.success){
        next();
    }
    else{
        res.status(400).json({msg:"Invalid inputs"});
    }
}

//export
module.exports={inputValidationMiddleware, signupMiddleware, signinMiddleware, validateTokenMiddleware, addTodoMiddleware};