import { Search, Bell, Menu, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import NotificationPanel from "./notification";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

export default function TopHeader({ placeholder, onMenuButtonClick, showSearch }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isInitialMount = useRef(true);

  // 1. Initialize State SAFELY from LocalStorage
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("cafe_notifications");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error reading notifications:", error);
      return [];
    }
  });

  // 2. Save to LocalStorage ONLY AFTER Initial Mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    try {
      localStorage.setItem("cafe_notifications", JSON.stringify(notifications));
    } catch (error) {
      console.error("Error saving notifications:", error);
    }
  }, [notifications]);

  // 3. Register Socket Handlers
  useEffect(() => {
    const handleNewBooking = (data) => {
      const newNotification = {
        id: Date.now(),
        title: "New Reservation",
        message: `Table ${data.tableNumber || "-"} booked by ${data.name || "Guest"}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: "booking",
      };

      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        localStorage.setItem("cafe_notifications", JSON.stringify(updated));
        return updated;
      });
    };

    const handleCancelledBooking = (data) => {
      const newNotification = {
        id: Date.now(),
        title: "Booking Cancelled",
        message: data.message || "A reservation was cancelled.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: "cancelled",
      };

      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        localStorage.setItem("cafe_notifications", JSON.stringify(updated));
        return updated;
      });
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
    <header className="h-16 sm:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-3 sm:px-6 md:px-8 flex-shrink-0 sticky top-0 z-30">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 mr-2">
        <button
          type="button"
          onClick={onMenuButtonClick}
          className="p-2 -ml-1 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors lg:hidden cursor-pointer shrink-0"
          aria-label="Open Navigation Sidebar"
        >
          <Menu size={22} />
        </button>

        {showSearch && (
          <div className="relative w-full max-w-[140px] sm:max-w-xs md:max-w-md">
            <Search
              className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              readOnly
              placeholder={placeholder}
              className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0A4D8C] focus:bg-white transition-all cursor-default truncate"
            />
          </div>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
        <Link to="/admin/profile" className="p-1 sm:p-0">
          <User size={18} className="text-gray-400 hover:text-gray-600 transition-colors" />
        </Link>
        
        {/* NOTIFICATION BUTTON */}
        <div className="relative">
          <button
            type="button"
            className="relative p-1.5 sm:p-2 text-gray-400 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
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

          <div className="fixed sm:absolute top-16 sm:top-full left-3 right-3 sm:left-auto sm:right-0 mt-2 z-50 flex justify-center sm:block">
            <NotificationPanel
              isOpen={open}
              setIsOpen={setOpen}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </div>
        </div>
      </div>
    </header>
  );
}