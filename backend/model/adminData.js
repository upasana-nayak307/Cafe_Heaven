const mongoose=require("mongoose");

const adminSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl:{
      type:String,
      default:""
    },
    role: {
      type: String,
      enum: ["admin", "manager"],
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    }
},{timestamps:true});

module.exports=mongoose.model("Admin",adminSchema);