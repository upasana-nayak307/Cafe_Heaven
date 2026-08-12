import { Search, Bell, Menu, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationPanel from "./notification";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

export default function TopHeader({ placeholder, onMenuButtonClick, showSearch }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNewBooking = (data) => {
      const newNotification = {
        id: Date.now(),
        title: "New Reservation",
        message: `Table ${data.tableNumber || "-"} booked by ${data.name || "Guest"}`,
        time: "Just now",
        read: false,
        type: "booking",
      };
      setNotifications((prev) => [newNotification, ...prev]);
    };

    const handleCancelledBooking = (data) => {
      const newNotification = {
        id: Date.now(),
        title: "Booking Cancelled",
        message: data.message || "A reservation was cancelled.",
        time: "Just now",
        read: false,
        type: "cancelled",
      };
      setNotifications((prev) => [newNotification, ...prev]);
    };

    socket.on("new-booking", handleNewBooking);
    socket.on("booking-cancelled", handleCancelledBooking);

    return () => {
      socket.off("new-booking", handleNewBooking);
      socket.off("booking-cancelled", handleCancelledBooking);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 sm:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 md:px-8 flex-shrink-0 sticky top-0 z-30">
      
      {/* LEFT SECTION: HAMBURGER & SEARCH */}
      <div className="flex items-center gap-3 flex-1">
        <button
          type="button"
          onClick={onMenuButtonClick}
          className="p-2 -ml-1 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors lg:hidden cursor-pointer"
          aria-label="Open Navigation Sidebar"
        >
          <Menu size={22} />
        </button>

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
          <User size={18} className="text-gray-400" />
        </a>
        
        {/* NOTIFICATION BUTTON */}
        <div className="relative">
          <button
            type="button"
            className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
          )}

          <div className="absolute right-0 top-full mt-2 z-50">
            <NotificationPanel
              isOpen={open}
              setIsOpen={setOpen}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-6 sm:h-8 w-px bg-gray-200"></div>

        {/* STATUS */}
        <a
          href="https://www.zomato.com/bhubaneswar/the-cafe-heaven-gajapati-nagar-bhubaneshwar"
          className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 hidden sm:inline-block"
        >
          ⚡ Zomato Feed Active
        </a>
      </div>
    </header>
  );
}