const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        company:{
            type:String,
            required: true
        },
        position:{
            type:String,
            required: true
        },
        minSalary:{
            type:Number,
            required: true,
        },
        role:{
            type:String,
            enum:["pending","interviewed","declined"],
            default:"pending"
        },
        opening:{
            type:Number,
            required: true,
        },
        description:{
            type:String,
            required: true,
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    },
{timestamps:true}
);

module.exports = mongoose.model('Job',jobSchema);