const Menu=require("../model/menuItems");
const uploadToCloudinary=require("../controller/uploadCloudinary");
const cloudinary=require("../config/cloudinary");

// for get
const getItems=async(req,res)=>{
    try {
        const allItems=await Menu.find();
        res.status(200).json({
            message:"All items fetched",allItems
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// for post
const postItems=async (req,res) => {
    const {itemName,category,price,description,type}=req.body;
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }
        const result = await uploadToCloudinary(req.file.buffer);
        const items=await Menu.create({
            itemName,
            category,
            price,
            description,
            type,
            image:result.secure_url,
            public_id: result.public_id
        })
        res.status(201).json({
            message:"Item added sucessfully",items
        })
    } catch (error) {
        console.log("FULL ERROR:",error);
        res.status(500).json({ error: error.message });
    }
}

// for update
const updateItem=async (req,res) => {
    try {
        const { itemName, category, price, description, type } = req.body;
        const item=await Menu.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        let imageUrl = item.image;
        let public_id = item.public_id;
        if (req.file) {
            // delete old image
            if (item.public_id) {
                await cloudinary.uploader.destroy(item.public_id);
            }

            const result = await uploadToCloudinary(req.file.buffer);
            imageUrl = result.secure_url;
            public_id = result.public_id;
        }
        const updatedItem = await Menu.findByIdAndUpdate(
        req.params.id,
        {
            itemName,
            category,
            price,
            description,
            type, // ✅ ensure it's included
            image: imageUrl,
            public_id
        },
        { new: true }
        );
        res.status(201).json(updatedItem);
    } catch (error) {
        console.log("FULL ERROR:",error);
        res.status(500).json({ error: error.message });
    }
}

// for delete
const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Menu.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // delete image from cloudinary
    if (item.public_id) {
      await cloudinary.uploader.destroy(item.public_id);
    }

    await Menu.findByIdAndDelete(id);

    res.status(200).json({ message: "Item deleted successfully" });

  } catch (error) {
    console.log("FULL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
module.exports={getItems,postItems,updateItem,deleteItem};