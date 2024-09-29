const {Router}=require('express');
const {Todo,User}=require('../db/index');
const {inputValidationMiddleware,signupMiddleware, signinMiddleware, validateTokenMiddleware, addTodoMiddleware} = require('../middleware/userMiddleware');
require('dotenv').config({path:'../.env'});
const jwt=require('jsonwebtoken');
const router=Router();

const secret=(process.env.SECRET).toString();

//signup route
router.post('/signup', inputValidationMiddleware, signupMiddleware, async (req,res)=>{
    try {
        const user=new User(req.body);
        await user.save();
        res.status(200).json({msg:"User created successfully"});
    } catch (err) {
        res.status(500).json({msg:"Internal server error"});
    }
    
});

// sign in route
router.post("/signin",inputValidationMiddleware,signinMiddleware,(req,res)=>{
    const token=jwt.sign({uname:req.body.uname},secret);
    res.status(200).json({token});
});

//add todo route
router.post("/addtodo",validateTokenMiddleware, addTodoMiddleware, async (req,res)=>{
    const todo=new Todo({
        title:req.body.title
    });
    //fetch uname fromuser jwt token
    const token=req.headers["authorization"];
    //using decode only as we have already verified in middleware
    const uname=jwt.decode(token).uname;
    //appending the new todo to todo db
    //using async await
    try {
        await todo.save();
        //fetching the user from db
        const user=await User.findOne({uname:uname});
        //appending the todo to user
        user.todos.push(todo.id);
        await user.save();
        res.status(200).json({msg:"Todo added successfully"});
        
    } catch (err) {
        res.status(500).json({msg:"Internal server error"});
    }
});


//route to display all todos of a user
router.get("/todos",validateTokenMiddleware,async (req,res)=>{
    const token=req.headers["authorization"];
    const uname=jwt.decode(token).uname;
    const user=await User.findOne({uname:uname});
    const todosList=[];
    const len=user.todos.length;
    for(let i=0;i<len;i++){
        const todo=await Todo.findOne({id:user.todos[i]});
        todosList.push(todo);
    }
    res.status(200).json(todosList);
});

//route to update the status of a todo
router.get("/marktodo/:id",validateTokenMiddleware, async (req,res)=>{
    //check if course id user is trying to validate is present in his todos array if yes than change the status of the that todo to opposite of whats there
    const token=req.headers["authorization"];
    const uname=jwt.decode(token).uname;
    const user=await User.findOne({uname:uname});
    const todo=await Todo.findOne({id:req.params.id});
    if(todo){
        if(user.todos.includes(todo.id)){
            try {
                todo.status=!todo.status;
                await todo.save();
                res.status(200).json({msg:"Todo status updated successfully"});
            } catch (err) {
                res.status(500).json({msg:"Internal server error"});
            }
        }else{
            res.status(401).json({msg:"Unauthorized, todo id does not belong to user"});
        }
    }else{
        res.status(404).json({msg:"Todo not found"});
    }
})

module.exports=router;