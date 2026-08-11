import { Search, Bell, Menu, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationPanel from "./notification";
import { useState } from "react";
export default function TopHeader({ placeholder, onMenuButtonClick,showSearch }) {
  const navigate=useNavigate();
  const handleClick=async () => {
    navigate('/admin/notifications')
  }
  const [open,setOpen]=useState(false);
  return (
    <header className="h-16 sm:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 md:px-8 flex-shrink-0 sticky top-0 z-30">
      
      {/* LEFT SECTION: HAMBURGER & SEARCH */}
      <div className="flex items-center gap-3 flex-1">
        
        {/* 🔹 HAMBURGER BUTTON (Visible only on mobile/tablet) */}
        <button
          type="button"
          onClick={onMenuButtonClick}
          className="p-2 -ml-1 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors lg:hidden cursor-pointer"
          aria-label="Open Navigation Sidebar"
        >
          <Menu size={22} />
        </button>

        {/* SEARCH INPUT */}
          {showSearch && (
            <div className="relative w-full max-w-[180px] sm:max-w-xs md:max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
              type="text"
              readOnly
              placeholder={placeholder}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0A4D8C] focus:bg-white transition-all cursor-default truncate"
              />
            </div>
          )}

      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">

        <a href="/admin/profile">
          <User size={18} className="text-gray-400"/>
        </a>
        
        {/* NOTIFICATION */}
        <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
        onClick={()=>setOpen(prev=>!prev)}
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#6DBE45] rounded-full ring-2 ring-white"></span>
        </button>
        {open && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
        )}    
        <div className="absolute right-2 top-full mt-2 z-50">
          <NotificationPanel isOpen={open} setIsOpen={setOpen} />
        </div> 
        

        {/* DIVIDER */}
        <div className="h-6 sm:h-8 w-px bg-gray-200"></div>

        {/* STATUS */}
        <a href="https://www.zomato.com/bhubaneswar/the-cafe-heaven-gajapati-nagar-bhubaneshwar" className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 hidden sm:inline-block">
          ⚡ Zomato Feed Active
        </a>
      </div>
    </header>
  );
}