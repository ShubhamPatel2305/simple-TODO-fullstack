const mongoose=require('mongoose');
const autoincrement = require('mongoose-sequence')(mongoose); // Pass mongoose as an argument

require('dotenv').config({path:'../.env'});

const uri=(process.env.MONGO_URI).toString();
mongoose.connect(uri).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log('Failed to connect to MongoDB', err);
});

const TodoSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        minlength:3,
        maxlength:255
    },
    status:{
        type:Boolean,
        required:true,
        default:false
    }
});

const UserSchema=mongoose.Schema({
    uname:{
        type:String,
        required:true,
        minlength:3,
        maxlength:255,
        unique:true
    },
    pass:{
        type:String,
        required:true,
        minlength:7,
        maxlength:255
    },
    todos:[
        {
            type:Number,
            ref:'todos',
            required:true
        }
    ]
})

// add an id as autoincrement starting from 1 
TodoSchema.plugin(autoincrement, {
    id: 'todo_counter',
    inc_field: 'id',
    start_seq:1
});

const Todo=mongoose.model('todos', TodoSchema);
const User=mongoose.model('users', UserSchema);

module.exports={Todo, User};
