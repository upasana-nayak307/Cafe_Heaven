import React, { useEffect, useState } from 'react';
import AddItemForm from './addMenuForm';
import { AnimatePresence,motion } from 'framer-motion';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const CATEGORIES = ['Coffee', 'Pizza', 'Desserts', 'Bakery', 'Burger','Starter','Pasta'];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [open, setOpen] = useState(false);
  const [menuItems,setMenuItems]=useState([]);
  const [editItem,setEditItem]=useState(null);

  const fetchMenuData=async () => {
    try {
      const res=await axios.get("http://localhost:8080/api/allItems");
      console.log(res.data.allItems);
      setMenuItems(res.data.allItems);
    } catch (error) {
      console.log("FULL ERR: ",error);
    }
  }
  useEffect(()=>{
    fetchMenuData();
  },[])

  const toggle=async (id,currentStatus)=>{

    // updating the UI changes
    setMenuItems((prevItem)=>
      prevItem.map((item)=>item._id===id ? {...item,available:!item.available}:item)
    )

    // sending the changes to backend
    try {
      await axios.put(`http://localhost:8080/api/updateItem/${id}`,{available:!currentStatus});
    } catch (error) {
      console.log(error);
    }
  }
  const filteredMenuItems=selectedCategory==="All" ? menuItems : menuItems.filter((items)=>items.category===selectedCategory);

  const handleEdit=async(item)=>{
    setEditItem(item);
    setOpen(true);
  };

  const handleDeleteItem=async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/deleteItem/${id}`);
      fetchMenuData();
    } catch (error) {
      console.log("FULL ERR: ",error);
    }
  }

  const toTitleCase = (text) => {
  return text
    ?.trim()
    .toLowerCase()
    .split(/\s+/) // handles multiple spaces
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  };
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 bg-gray-50 min-h-screen max-w-7xl mx-auto">

      {/* 🔹 HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Menu Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Manage your cafe menu items easily
          </p>
        </div>

        <button 
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0A4D8C] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-medium hover:bg-[#083d70] active:scale-[0.98] transition-all text-sm sm:text-base shadow-sm" 
          onClick={() => {
            setOpen(true)
            setEditItem(null)
          }
          }
        >
          <Plus size={18} />
          Add New Item
        </button>
      </div>

      {/* 🔹 CATEGORY FILTERS (Scrollable on Mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border cursor-pointer shrink-0 transition-colors ${
            selectedCategory === 'All'
              ? 'bg-[#0A4D8C] text-white border-[#0A4D8C]'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Categories
        </button>

        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border cursor-pointer shrink-0 transition-colors ${
              selectedCategory === cat
                ? 'bg-[#0A4D8C] text-white border-[#0A4D8C]'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🔹 CONTENT AREA */}
      {filteredMenuItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center text-gray-400 flex flex-col items-center gap-2 shadow-sm">
          <AlertCircle size={36} className="text-gray-300" />
          <p className="text-base sm:text-lg font-medium">No menu items found</p>
        </div>
      ) : (
        <>
          {/* 📱 MOBILE VIEW: Stacked Cards (Visible < md breakpoint) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
          {filteredMenuItems.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className={`font-semibold text-sm ${item.available ? "text-gray-900" : "text-gray-400 line-through"}`}>
                    {toTitleCase(item.itemName)}
                  </h3>
                  <span className="inline-block mt-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] font-medium">
                    {item.category}
                  </span>
                </div>
                <span className="font-bold text-gray-900 text-sm">₹{item.price}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  {item.available ? (
                    <span className="inline-flex items-center gap-1 bg-green-50 text-[#6DBE45] px-2 py-0.5 rounded-full text-xs font-semibold border border-green-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6DBE45]"></span> Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-semibold border border-gray-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Out of Stock
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    type="button"
                    className="p-1.5 text-gray-500 hover:text-[#0A4D8C] hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    type="button"
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Item"
                    onClick={()=>handleDeleteItem(item._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* 💻 DESKTOP VIEW: Full Data Table (Visible ≥ md breakpoint) */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                    <th className="py-4 px-6">Item Name</th>
                    <th className="py-4 px-6 text-center">Category</th>
                    <th className="py-4 px-6 text-center">Price</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-center">Availability</th>
                    <th className="py-4 px-6 text-center">Type</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredMenuItems.map((item) => (        
                    <tr key={item._id} className="hover:bg-gray-50/70 transition-colors">
                      <td className={`py-4 px-6 font-semibold ${item.available ? "text-gray-900" : "text-gray-400 line-through"}`}>
                        {toTitleCase(item.itemName)}
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className={`p-4 font-medium ${item.available ? "text-gray-900" : "text-gray-400 line-through"} text-center`}>₹{item.price}</td>
                      <td className="p-4 text-center">
                        {item.available ? (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-[#6DBE45] px-2.5 py-1 rounded-full text-xs font-semibold border border-green-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6DBE45]"></span> Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full text-xs font-semibold border border-gray-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                            item.available ? 'bg-[#6DBE45]' : 'bg-gray-200'
                          }`}
                          onClick={()=>toggle(item._id,item.available)}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.available ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          
                          {/* Veg / Non-Veg Indicator */}
                          {item.type && (
                            <>
                              <span
                                className={`w-3.5 h-3.5 border-[1.5px] ${
                                  item.type === "veg"
                                    ? "border-emerald-600"
                                    : "border-rose-600"
                                } flex items-center justify-center rounded-[2px] shrink-0 bg-white`}
                              >
                                {item.type === "veg" ? (
                                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                                ) : (
                                  <span className="w-0 h-0 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent border-b-[4px] border-b-rose-600" />
                                )}
                              </span>

                              {/* Text outside */}
                              <p className="text-sm capitalize text-gray-700">
                                {item.type}
                              </p>
                            </>
                          )}

                        </div>
                      </td>
                      <td className="py-4 pr-6 pl-3 whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <button 
                            type="button"
                            disabled={!item.available}
                            className={`p-2 text-gray-500 hover:text-[#0A4D8C] hover:bg-blue-50 
                              rounded-lg transition-colors ${item.available ? "cursor-pointer" : "cursor-not-allowed"}`
                            }
                            title="Edit Item"
                            onClick={()=>handleEdit(item)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            type="button"
                            disabled={!item.available}
                            className={`p-2 text-gray-500 hover:text-red-600 ${item.available ? "cursor-pointer" : "cursor-not-allowed"}  hover:bg-red-50 rounded-lg transition-colors`}
                            title="Delete Item"
                            onClick={()=>handleDeleteItem(item._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
       )}

      {/* 🔹 FORM MODAL */}
      <AnimatePresence>
        {open && <AddItemForm isOpen={open} 
        editItem={editItem}
        onClose={() => {
          setOpen(false);
          fetchMenuData();
        }}
        />
        }
      </AnimatePresence>
    </div>
  );
}