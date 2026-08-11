const mongoose=require("mongoose");
// create schema

const bookTableSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    bookingTime:{
        type:String,
        required:true
    },
    bookingDate:{
        type:String,
        required:true
    },
    guests:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending","confirmed","cancelled","completed"],
        default:"pending"
    },
    tableNumber:{
        type:Number,
        default:0
    },
    totalVisits:{
        type:Number,
        default:1
    },
    customerType:{
        type:String,
        enum:["frequent","new","vip"],
        default:"new"
    },
    specialRequest:{
        type:String
    }
},{timestamps:true});

// creating model
module.exports=mongoose.model("BookTable",bookTableSchema);