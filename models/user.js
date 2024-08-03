// Hashing of password
const {createHmac, randomBytes} = require("crypto");

// JWT token Function
const {createToken} = require('../services/auth');

const mongoose = require('mongoose');

const user = new mongoose.Schema(
    {
        username:{
            type:String,
            required: true
        },
        email:{
            type:String,
            required: true,
            unique: true
        },
        password:{
            type:String,
            required: true,
        },
        salt:{
            type:String,
        },
        role:{
            type:String,
            enum:["User","Jober"],
            default:"User"
        }
    },
{timestamps:true}
);

user.pre('save',function(next){
    const u=this;
    if(!u.isModified('password')){
        return ;
    }
    // Hashing of the password
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256',salt).update(u.password).digest("hex");
    this.salt = salt;
    this.password = hashedPassword;

    next();
});

user.static('matchPasswordAndGenerateToken',async function(email,password){
    const u = await this.findOne({email});
    if(!u) throw new Error('User Not Found');

    const salt = u.salt;
    const hashedPassword = u.password;

    const userProvidedHash = createHmac('sha256',salt).update(password).digest("hex");

    if(hashedPassword !== userProvidedHash) throw new Error('User Not Found');  

    const token = await createToken(u);

    return token;
});

module.exports = mongoose.model('User',user);