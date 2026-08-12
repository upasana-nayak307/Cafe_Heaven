import React, { useState, useEffect } from 'react';
import { 
  CheckCheck, 
  Trash2, 
  CalendarCheck, 
  XCircle, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

export default function NotificationPanel({ isOpen, setIsOpen }) {
  // ✅ 1. ALL HOOKS MUST RUN AT THE TOP LEVEL
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNewBooking = (data) => {
      const newNotification = {
        id: Date.now(),
        title: "New Reservation",
        message: `Table ${data.tableNumber || "-"} booked by ${data.name}`,
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

  // Action Handlers
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  // ✅ 2. CONDITIONAL RETURN MUST GO AFTER HOOKS
  if (!isOpen) return null;

  const renderIcon = (type) => {
    switch (type) {
      case 'booking':
        return <CalendarCheck className="w-[18px] h-[18px] text-[#10B981]" />;
      case 'cancelled':
        return <XCircle className="w-[18px] h-[18px] text-[#EF4444]" />;
      case 'completed':
        return <CheckCircle2 className="w-[18px] h-[18px] text-[#3B82F6]" />;
      default:
        return <Info className="w-[18px] h-[18px] text-[#F59E0B]" />;
    }
  };

  return (
    <div className="w-[360px] bg-white rounded-2xl shadow-lg border border-gray-100/80 overflow-hidden font-sans">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50 bg-white">
        <div className="flex items-center gap-2.5">
          <h3 className="font-semibold text-[#111827] text-base tracking-tight">
            Notifications
          </h3>
          <span className="px-2.5 py-0.5 text-xs font-medium text-[#2563EB] bg-[#EFF6FF] rounded-full">
            {notifications.filter(n => !n.read).length} new
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-gray-400" />
            Mark all read
          </button>
          <button 
            onClick={handleClearAll}
            className="text-gray-400 hover:text-red-500 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-gray-50 max-h-[380px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400">
            No notifications yet
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`px-5 py-4 flex items-start gap-3.5 ${
                item.read ? 'bg-white' : 'bg-[#F8FAFC]'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-100/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                {renderIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-[13px] font-semibold text-[#1E293B]">
                    {item.title}
                  </h4>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0" />
                  )}
                </div>

                <p className="text-xs text-[#64748B] mt-0.5 leading-snug">
                  {item.message}
                </p>

                <span className="inline-block mt-2 text-[11px] text-[#94A3B8]">
                  {item.time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="py-3.5 text-center border-t border-gray-50 bg-white">
        <button
          onClick={() => setIsOpen(false)}
          className="text-xs font-semibold text-[#334155] hover:text-black cursor-pointer transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}