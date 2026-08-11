const mongoose=require("mongoose");

// create schema
const menuSchema=new mongoose.Schema({
    itemName:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    available:{
        type:Boolean,
        default:true
    },
    type:{
        type:String,
        enum:["veg","non-veg"],
        default:"veg"
    }
},{timestamps:true});

// create model
module.exports=mongoose.model("Menu",menuSchema);