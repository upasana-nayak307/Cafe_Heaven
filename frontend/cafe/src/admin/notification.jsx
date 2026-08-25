import React from 'react';
import { 
  CheckCheck, 
  Trash2, 
  CalendarCheck, 
  XCircle, 
  CheckCircle2, 
  Info 
} from 'lucide-react';

export default function NotificationPanel({ 
  isOpen, 
  setIsOpen, 
  notifications = [], 
  setNotifications 
}) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const handleMarkAllRead = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/notifications/mark-read`, { method: "PATCH" });
      if (typeof setNotifications === "function") {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/notifications`, { method: "DELETE" });
      if (typeof setNotifications === "function") {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="w-[calc(100vw-24px)] sm:w-[360px] max-w-[360px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden font-sans">
      {/* Header */}
      <div className="px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between border-b border-gray-50 bg-white">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[#111827] text-sm sm:text-base tracking-tight">
            Notifications
          </h3>
          <span className="px-2 py-0.5 text-[11px] sm:text-xs font-medium text-[#2563EB] bg-[#EFF6FF] rounded-full">
            {unreadCount} new
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button 
            type="button"
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-gray-400" />
            Mark all read
          </button>
          <button 
            type="button"
            onClick={handleClearAll}
            className="text-gray-400 hover:text-red-500 cursor-pointer p-0.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-gray-50 max-h-[340px] sm:max-h-[380px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">
            No notifications yet
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`px-4 sm:px-5 py-3 sm:py-4 flex items-start gap-3 ${
                item.read ? 'bg-white' : 'bg-[#F8FAFC]'
              }`}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                {renderIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-[13px] font-semibold text-[#1E293B]">
                    {item.title}
                  </h4>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0" />
                  )}
                </div>

                <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5 leading-snug">
                  {item.message}
                </p>

                <span className="inline-block mt-1.5 text-[10px] sm:text-[11px] text-[#94A3B8]">
                  {item.time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="py-3 text-center border-t border-gray-50 bg-white">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-xs font-semibold text-[#334155] hover:text-black cursor-pointer transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}