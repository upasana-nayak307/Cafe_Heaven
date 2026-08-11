const express=require("express");
const {signUp,logIn,getProfile,updateProfile}=require("../controller/authController");
const authMiddleWare=require("../controller/authMiddleWare");

const router=express.Router();

router.post('/login',logIn);
router.post('/signup',signUp);
router.get('/profile', authMiddleWare, getProfile);
router.put('/profile', authMiddleWare, updateProfile);

module.exports=router;