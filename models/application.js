const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required: true
        },
        phoneNo:{
            type:String,
            required: true
        },
        age:{
            type:Number,
            required: true,
        },
        gender:{
            type:String,
            enum:["male","female"],
            required:true
        },
        email:{
            type:String,
            required: true,
        },
        job:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        },
        appliedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    },
{timestamps:true}
);

module.exports = mongoose.model('application',applicationSchema);