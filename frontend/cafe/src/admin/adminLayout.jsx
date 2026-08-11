import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import TopHeader from "./navbar";
import { Outlet, useLocation } from "react-router-dom";
import BookTableDialog from "../components/bookTable";
import axios from "axios";

export default function AdminLayout() {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const hideSearchRoutes = ["/admin/analyticsBoard", "/admin/profile"];

  const shouldShowSearch =
    !hideSearchRoutes.includes(location.pathname);

  let placeholder = "";
  if (location.pathname === "/admin") {
    placeholder = "Search by guest name or reservation ID";
  } 
  else if (location.pathname === "/admin/menu") {
    placeholder = "Search item by name";
  }
  else if (location.pathname === "/admin/reservations") {
    placeholder = "Search name, phone, ID...";
  }
  else if (location.pathname === "/admin/customers") {
    placeholder = "Search by name, phone or email...";
  }

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("adminToken");
      
      try {
        const res = await axios.get("http://localhost:8080/api/bookingLists", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBookings(res.data);
      } catch (error) {
        console.log("Facing issue in fetching: ", error);
      }
    };
    
    fetchBookings();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">

      {/* 🔹 MOBILE SIDEBAR BACKDROP */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* 🔹 SIDEBAR WRAPPER (Responsive Drawer for Mobile/Tablet) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setMobileSidebarOpen(false)} />
      </div>

      {/* 🔹 MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Pass mobile toggle function to top header */}
        <TopHeader 
          placeholder={placeholder} 
          onMenuButtonClick={() => setMobileSidebarOpen(true)} 
          showSearch={shouldShowSearch}
        />

        <main className="flex-1 overflow-y-auto min-w-0">
          <Outlet context={{ bookings, setBookings }} />
        </main>

      </div>
      <BookTableDialog bookings={bookings} setBookings={setBookings} isOpen={false} />
    </div>
  );
}