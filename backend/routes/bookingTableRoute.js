const express=require("express");
const {getUser,postUser,updateUser}=require("../controller/bookTableController");

const router=express.Router();

router.get("/bookingLists",getUser);

router.post("/bookingData",postUser);

router.put("/updateBookingData/:id",updateUser)

module.exports=router;