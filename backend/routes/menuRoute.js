const express=require("express");
const {getItems,postItems,updateItem,deleteItem}=require("../controller/menuController");
const upload = require("../middleware/upload");
const router=express.Router();

router.get('/allItems',getItems);
router.post('/addNewItem',upload.single("image"),postItems);
router.put('/updateItem/:id',upload.single("image"),updateItem);
router.delete('/deleteItem/:id',deleteItem);

module.exports=router;