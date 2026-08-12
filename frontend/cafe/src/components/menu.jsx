import axios from 'axios';
import { motion, useInView } from 'framer-motion';
import {ChevronDown, ChevronUp, Search, X, IndianRupee } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { HiSparkles } from 'react-icons/hi';

const Menu = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const categories = ["All", "Coffee", "Pizza", "Dessert", "Bakery", "Starter", "Burger"];
  const options = ["All", "Veg", "Non-veg"];

  // State Management
  const [category, setCategory] = useState("All");
  const [searchItem, setSearchItem] = useState("");
  const [dietFilter, setDietFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [menuData,setMenuData]=useState([]);
  const API=import.meta.env.VITE_BACKEND_URL;

  const INITIAL_LIMIT = 4;
  useEffect(()=>{
    const fetchData=async () => {
      try {
        const res=await axios.get(`${API}/allItems`);
        setMenuData(res.data.allItems);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  },[])

  // Combined Filtering Logic
  const filteredItems = menuData.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesSearch = item.itemName.toLowerCase().includes(searchItem.toLowerCase());
    
    // Convert both strings to lowercase for comparison
    const matchesDiet = 
      dietFilter === "All" || 
      item.type.toLowerCase() === dietFilter.toLowerCase();

    return matchesCategory && matchesSearch && matchesDiet;
  });

  // Limit displayed items unless "View All" is active or a filter is set
  const visibleItems = showAll || category !== "All" || searchItem !== "" || dietFilter !== "All"
    ? filteredItems 
    : filteredItems.slice(0, INITIAL_LIMIT);

  return (
    <section
      id="menu"
      data-testid="menu-section"
      ref={ref}
      className="py-24 md:py-32 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span
            data-testid="menu-label"
            className="text-sm uppercase tracking-[0.2em] font-medium text-[#6DBE45] mb-4 block"
          >
            Our Menu
          </span>
          <h2
            data-testid="menu-title"
            className="text-3xl sm:text-4xl lg:text-5xl tracking-tight font-serif text-[#05223D] mb-4"
          >
            Crafted with Love
          </h2>
          <p className="text-base font-sans leading-relaxed text-[#4A5568] max-w-2xl mx-auto">
            From artisan coffee to delectable treats, every item is prepared with premium ingredients and passion.
          </p>
        </motion.div>

        {/* Search Bar & Dietary Filter Toggle */}
        <div className="mb-10 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search coffee, pizza, desserts..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white rounded-2xl border border-stone-200 text-sm shadow-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0A4D8C]/20 focus:border-[#0A4D8C] transition-all"
            />
            {searchItem && (
              <button 
                onClick={() => setSearchItem("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Veg / Non-Veg Toggle Pills */}
          <div className="flex items-center bg-[#F1F1F1] p-1 rounded-2xl shadow-xs shrink-0 w-full sm:w-auto justify-center">
            {options.map((diet) => (
              <button
                key={diet}
                onClick={() => setDietFilter(diet)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  dietFilter === diet
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-[#F1F1F1] p-1 rounded-full gap-1 overflow-x-auto no-scrollbar max-w-full">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setCategory(tab);
                  setShowAll(false);
                }}
                className={`px-6 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  category === tab
                    ? "bg-[#0A4D8C] text-white shadow-md"
                    : "text-gray-600 hover:text-[#0A4D8C]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid or Empty State */}
        {visibleItems.length === 0 ? (
          <div className="text-center py-16 bg-stone-50 rounded-2xl border border-dashed border-stone-200 max-w-md mx-auto">
            <p className="text-stone-500 text-sm font-medium">No menu items found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchItem("");
                setDietFilter("All");
                setCategory("All");
              }}
              className="mt-4 text-xs text-[#0A4D8C] font-semibold underline hover:text-[#05223D] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleItems.map((item, index) => (
              <motion.div
                key={item.itemName}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-[#0A4D8C]/10 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 rounded-2xl overflow-hidden group flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  {item.image ? (
                    <div className="relative w-full h-44 overflow-hidden bg-stone-100">
                      <img
                        src={item.image}
                        alt={item.itemName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Category Badge */}
                      {item.category && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                          <span className="text-[11px] font-semibold text-[#05223D]">
                            {item.category}
                          </span>
                        </div>
                      )}

                      <HiSparkles className="absolute top-3 right-3 w-5 h-5 text-[#6DBE45] opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded-full p-0.5 shadow-xs" />
                    </div>
                  ) : (
                    <div className="p-5 pb-0 flex items-center justify-between">
                      {item.category && (
                        <span className="inline-flex items-center gap-1.5 bg-[#0A4D8C]/5 px-3 py-1 rounded-full text-xs font-semibold text-[#0A4D8C]">

                          {item.category}
                        </span>
                      )}
                      <HiSparkles className="w-5 h-5 text-[#6DBE45] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="flex items-start gap-2 mb-2">
                      {item.type && (
                        <span
                          className={`mt-1 w-4 h-4 border-[1.5px] ${
                            item.type === 'veg' ? 'border-emerald-600' : 'border-rose-600'
                          } flex items-center justify-center rounded-[2px] shrink-0 bg-white`}
                        >
                          {item.type === 'veg' ? (
                            <span className="w-2 h-2 bg-emerald-600 rounded-full" />
                          ) : (
                            <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-rose-600" />
                          )}
                        </span>
                      )}

                      <h3 className="text-lg font-serif font-semibold text-[#05223D] group-hover:text-[#0A4D8C] transition-colors leading-snug">
                        {item.itemName}
                      </h3>
                    </div>

                    <p className="text-xs text-[#4A5568] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Price
                  </span>
                  <p className="inline-flex items-center gap-0.5 text-lg font-bold font-mono tracking-tight text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <IndianRupee size={18} className="stroke-[2.5]" />
                    <span>{item.price}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {category === "All" && searchItem === "" && dietFilter === "All" && filteredItems.length > INITIAL_LIMIT && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#0A4D8C] text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white text-sm font-semibold transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer group"
            >
              <span>{showAll ? "Show Less" : "View All Menu"}</span>
              {showAll ? (
                <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              ) : (
                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;