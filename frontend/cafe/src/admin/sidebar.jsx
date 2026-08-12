import { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  CalendarDays, 
  UtensilsCrossed, 
  Users, 
  BarChart3, 
  Coffee,
  X,
  User
} from 'lucide-react';

export default function Sidebar({ onClose }) {
  const [userData, setUserData] = useState(null);
  const API=import.meta.env.VITE_BACKEND_URL;

  // Fetch logged-in user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      try {
        const res = await axios.get(`${API}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.user) {
          setUserData(res.data.user);
        }
      } catch (error) {
        console.error('Error fetching sidebar user profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const defaultAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256";
  const userRoleFormatted = userData?.role === 'manager' ? 'Store Manager' : 'Administrator';

  return (
    <aside className="w-64 h-full min-h-screen bg-white border-r border-gray-100 flex flex-col justify-between shrink-0">

      {/* TOP SECTION */}
      <div>
        {/* Logo & Close Button Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0A4D8C] rounded-xl flex items-center justify-center text-white shrink-0">
              <Coffee size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Cafe Heaven</h1>
              <span className="text-xs text-gray-400">Floor Operations</span>
            </div>
          </div>

          {/* Close button for mobile screen drawer */}
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer hover:bg-gray-100 lg:hidden transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* NAV LINKS */}
        <div className="p-3 space-y-1">
          <NavLink 
            to="/admin" 
            end 
            onClick={onClose}
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                isActive ? "bg-[#0A4D8C] text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink 
            to="/admin/reservations" 
            onClick={onClose}
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                isActive ? "bg-[#0A4D8C] text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <CalendarDays size={18} />
            Reservations
          </NavLink>

          <NavLink 
            to="/admin/menu" 
            onClick={onClose}
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                isActive ? "bg-[#0A4D8C] text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <UtensilsCrossed size={18} />
            Menu
          </NavLink>

          <NavLink 
            to="/admin/customers" 
            onClick={onClose}
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                isActive ? "bg-[#0A4D8C] text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <Users size={18} />
            Customers
          </NavLink>

          <NavLink 
            to="/admin/analyticsBoard" 
            onClick={onClose}
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                isActive ? "bg-[#0A4D8C] text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <BarChart3 size={18} />
            Analytics
          </NavLink>

          <NavLink 
            to="/admin/profile" 
            onClick={onClose}
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                isActive ? "bg-[#0A4D8C] text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <User size={18} />
            Profile
          </NavLink>
        </div>
      </div>

      {/* DYNAMIC BOTTOM PROFILE */}
      <div className="p-4 border-t border-gray-100 flex items-center gap-3 bg-white">
        <img
          src={userData?.avatarUrl}
          alt={userData?.name || "Admin"}
          className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-slate-100"
        />
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-gray-900 truncate">
            {userData?.name || 'Admin'}
          </p>
          <p className="text-xs text-[#6DBE45] font-medium truncate">
            {userRoleFormatted}
          </p>
        </div>
      </div>

    </aside>
  );
}