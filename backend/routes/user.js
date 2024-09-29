const {Router}=require('express');
const {Todo,User}=require('../db/index');
const {inputValidationMiddleware,signupMiddleware} = require('../middleware/userMiddleware');

const router=Router();

//signup route
router.post('/signup', inputValidationMiddleware, signupMiddleware, async (req,res)=>{
    const user=new User(req.body);
    await user.save();
    res.status(200).json({msg:"User created successfully"});
});

//export router

module.exports=router;