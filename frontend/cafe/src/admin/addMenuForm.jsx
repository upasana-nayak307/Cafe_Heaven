import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, 
  UploadCloud, 
  X, 
  IndianRupee,
  Utensils,
  Tag,
  AlignLeft,
  PlusCircle,
  ChevronDown,
  Pizza,
  Cake,
  UtensilsCrossed,
  Croissant,
  Flame,
  Soup,
  Leaf
} from 'lucide-react';
import axios from 'axios';

export default function AddItemForm({ onClose, editItem }) {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    { name: "Coffee", icon: Coffee },
    { name: "Pizza", icon: Pizza },
    { name: "Desserts", icon: Cake },
    { name: "Bakery", icon: Croissant },
    { name: "Burger", icon:UtensilsCrossed},
    { name: "Starter", icon:Flame},
    { name : "Pasta", icon:Soup}
  ];

  const API=import.meta.env.VITE_BACKEND_URL;

  const [menuData, setMenuData] = useState({
    itemName: "",
    price: "",
    category: "",
    type: "veg",
    image: null,
    description: ""
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setMenuData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setMenuData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (editItem) {
      setMenuData({
        itemName: editItem.itemName || "",
        price: editItem.price || "",
        category: editItem.category || "",
        type: editItem.type || "veg",
        image: editItem.image || null,
        description: editItem.description || ""
      });
      setSelectedCategory(editItem.category || "");
    }
  }, [editItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("itemName", menuData.itemName);
    formData.append("category", menuData.category);
    formData.append("price", menuData.price);
    formData.append("type", menuData.type);
    formData.append("description", menuData.description);
    
    if (menuData.image && typeof menuData.image !== 'string') {
      formData.append("image", menuData.image);
    }

    try {
      if (editItem) {
        const update = await axios.put(
          `${API}/updateItem/${editItem._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("Updated item:", update.data);
      } else {
        const res = await axios.post(
          `${API}/addNewItem`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("Added item:", res.data);
      }

      setMenuData({
        itemName: "",
        category: "",
        price: "",
        type: "veg",
        image: null,
        description: ""
      });
      setSelectedCategory("");
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    /* BACKDROP ANIMATION */
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* MODAL ANIMATION */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER WITH ICON BRANDING */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0A4D8C] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <Coffee className="w-5 h-5 text-[#6DBE45]" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-wide">
                {editItem ? "Edit Menu Item" : "Add New Menu Item"}
              </h3>
              <p className="text-xs text-blue-100/80 font-normal">Cafe Heaven Admin Dashboard</p>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
            onClick={onClose}
          >
            <X size={18} />
          </motion.button>
        </div>

        {/* FORM BODY */}
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>

          {/* 1. ITEM NAME FIELD */}
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Utensils className="w-3.5 h-3.5 text-[#0A4D8C]" />
              Item Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              name="itemName"
              value={menuData.itemName}
              onChange={handleChange}
              placeholder="e.g. Caramel Macchiato"
              required
              className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15 transition-all"
            />
          </div>

          {/* 2. PRICE & CATEGORY DROPDOWN GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* PRICE INPUT */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <IndianRupee className="w-3.5 h-3.5 text-[#0A4D8C]" />
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <IndianRupee className="w-4 h-4" />
                </span>
                <input 
                  type="number"
                  name="price"
                  value={menuData.price}
                  onChange={handleChange}
                  placeholder="249"
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15 transition-all"
                />
              </div>
            </div>

            {/* CATEGORY DROPDOWN */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Tag className="w-3.5 h-3.5 text-[#0A4D8C]" />
                Category <span className="text-red-500">*</span>
              </label>
              
              <div className="relative w-full">
                <button 
                  type="button" 
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm flex justify-between items-center hover:bg-white focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15 transition-all"
                  onClick={() => setDropDownOpen(!dropDownOpen)}                
                >
                  <span className={selectedCategory ? "text-gray-800 font-medium" : "text-gray-400"}>
                    {selectedCategory || "Select category"}
                  </span>
                  <motion.div
                    animate={{ rotate: dropDownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} className="text-gray-400" />
                  </motion.div>
                </button>

                {/* ANIMATED DROPDOWN MENU */}
                <AnimatePresence>
                  {dropDownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute mt-1.5 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-10 py-1 origin-top"
                    >
                      {categories.map((item) => {
                        const CategoryIcon = item.icon;
                        return (
                          <motion.div
                            key={item.name}
                            whileHover={{ x: 3 }}
                            onClick={() => {
                              setSelectedCategory(item.name);
                              setMenuData((prev) => ({ ...prev, category: item.name }));
                              setDropDownOpen(false);
                            }}  
                            className="px-4 py-2.5 text-sm text-gray-700 hover:bg-[#0A4D8C]/10 hover:text-[#0A4D8C] cursor-pointer flex items-center gap-2.5 font-medium transition-colors group"
                          >
                            <CategoryIcon className="w-4 h-4 text-gray-400 group-hover:text-[#0A4D8C]" />
                            {item.name}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>

          {/* 3. FOOD TYPE SELECTION (VEG / NON-VEG) */}
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#0A4D8C]" />
              Food Type <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Veg Option */}
              <button
                type="button"
                onClick={() => setMenuData((prev) => ({ ...prev, type: "veg" }))}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  menuData.type === "veg"
                    ? "bg-emerald-50 border-emerald-600 text-emerald-800 ring-1 ring-emerald-600/30"
                    : "bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="w-3.5 h-3.5 border-[1.5px] border-emerald-600 flex items-center justify-center rounded-[2px] bg-white">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full" />
                </span>
                Vegetarian
              </button>

              {/* Non-Veg Option */}
              <button
                type="button"
                onClick={() => setMenuData((prev) => ({ ...prev, type: "non-veg" }))}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  menuData.type === "non-veg"
                    ? "bg-rose-50 border-rose-600 text-rose-800 ring-1 ring-rose-600/30"
                    : "bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="w-3.5 h-3.5 border-[1.5px] border-rose-600 flex items-center justify-center rounded-[2px] bg-white">
                  <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-rose-600" />
                </span>
                Non-Vegetarian
              </button>
            </div>
          </div>

          {/* 4. DESCRIPTION FIELD */}
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <AlignLeft className="w-3.5 h-3.5 text-[#0A4D8C]" />
              Description
            </label>
            <textarea 
              rows={3}
              name="description"
              value={menuData.description}
              onChange={handleChange}
              placeholder="Freshly brewed espresso with steamed milk and vanilla syrup..."
              className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/15 transition-all resize-none"
            />
          </div>

          {/* 5. IMAGE UPLOAD */}
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <UploadCloud className="w-3.5 h-3.5 text-[#0A4D8C]" />
              Upload Image <span className="text-gray-400 font-normal uppercase">(Optional)</span>
            </label>

            <label className="border-2 border-dashed border-gray-200 hover:border-[#0A4D8C]/50 bg-gray-50/50 hover:bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all group">
              <UploadCloud className="w-7 h-7 text-gray-400 group-hover:text-[#0A4D8C] transition-colors mb-1" />
              <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900">
                {menuData.image 
                  ? (typeof menuData.image === 'string' ? 'Image File Selected' : menuData.image.name) 
                  : "Click to upload menu image"}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">
                PNG, JPG or WEBP (Max 5MB)
              </span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                name="image"
                onChange={handleChange}
              />
            </label>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
              Cancel
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#6DBE45] hover:bg-[#5ca33a] shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              {editItem ? "Update item" : "Add item"}
            </motion.button>
          </div>

        </form>

      </motion.div>
    </motion.div>
  );
}