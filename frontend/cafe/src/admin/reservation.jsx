import React, { useState } from 'react';
import axios from "axios";
import {
  Plus,
  Armchair,
  Users,
  Clock,
  Phone,
  Edit2,
  Trash2,
  AlertCircle,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export default function ReservationsPage() {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getDotColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-emerald-500';
      case 'pending': return 'bg-amber-500';
      case 'completed': return 'bg-slate-500';
      case 'cancelled': return 'bg-rose-500';
      default: return 'bg-gray-400';
    }
  };

  const { bookings, setBookings } = useOutletContext();

  const [category, setCategory] = useState("All");
  const FILTER_TABS = ['All', 'Today', 'Upcoming', 'Completed', 'Cancelled'];
  const API = import.meta.env.VITE_BACKEND_URL;

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const filterReservation = bookings.filter((item) => {
    const status = item.status?.toLowerCase();

    if (category === 'All') return true;
    if (category === 'Completed') return status === 'completed';
    if (category === 'Cancelled') return status === 'cancelled';

    let itemDateStr = item.date || item.bookingDate;
    if (!itemDateStr) return false;
    
    itemDateStr = itemDateStr.replaceAll('-', '/'); 
    const todayStr = getTodayString();

    if (category === 'Today') {
      return itemDateStr === todayStr;
    }

    if (category === 'Upcoming') {
      return itemDateStr > todayStr || status === 'upcoming' || status === 'confirmed';
    }

    return true;
  });
  
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/api/updateBookingData/${id}`, { status });
    } catch (error) {
      console.error(error);
    }
    setBookings((prevItem) =>
      prevItem.map((item) => item._id === id ? { ...item, status } : item)
    );
  };

  const updateTable = async (id, tableNo) => {
    try {
      await axios.put(`${API}/api/updateBookingData/${id}`, { tableNumber: tableNo });
    } catch (error) {
      console.error(error);
    }
    setBookings((prevItem) =>
      prevItem.map((item) => item._id === id ? { ...item, tableNumber: tableNo } : item)
    );
  };
  
  const nextBooking = bookings
    .filter(item => {
      const status = item.status?.toLowerCase();
      return status !== "completed" && status !== "cancelled";
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.bookingDate?.replaceAll('-', '/')} ${a.bookingTime}`);
      const dateB = new Date(`${b.bookingDate?.replaceAll('-', '/')} ${b.bookingTime}`);
      return dateA - dateB;
    })[0];

  // Helper to safely format booking date
  const formatBannerDate = (dateStr) => {
    if (!dateStr) return '';
    const formatted = new Date(dateStr.replaceAll('-', '/'));
    return isNaN(formatted) ? dateStr : formatted.toLocaleDateString('en-GB');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 bg-gray-50 min-h-screen max-w-7xl mx-auto">
      
      {/* 🔹 HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Reservation Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage, track, and optimize customer table bookings
          </p>
        </div>
      </div>

      {/* 🔹 ADVANCED BANNER: NEXT UPCOMING HIGHLIGHT */}
      <div className="bg-gradient-to-r from-[#0A4D8C] to-[#0d5ca8] rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-3.5 z-10">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-blue-200">
              Next Upcoming Reservation
            </span>
            <h4 className="text-base sm:text-lg font-bold">
              {nextBooking ? `${nextBooking.name} — ${nextBooking.guests}` : "No upcoming reservations"}
            </h4>
            
            {/* FIXED BANNER DATE DISPLAY */}
            <p className="text-xs text-blue-100/80 mt-0.5">
              {nextBooking ? (
                <>
                  Scheduled for <span className="font-semibold text-white">{formatBannerDate(nextBooking.bookingDate)}</span> at <span className="font-semibold text-white">{nextBooking.bookingTime}</span>
                </>
              ) : (
                "No upcoming bookings scheduled"
              )}
            </p>
          </div>
        </div>
        
        {nextBooking ? (
          <div className="flex items-center gap-3 z-10 self-start md:self-auto">
            <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-medium">
              # Table {nextBooking.tableNumber || "--"} Prepared
            </span>
          </div>
        ) : (
          <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-medium">
            No table prepared
          </span>
        )}

        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 🔹 CONTROLS SECTION: FILTERS */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setCategory(tab)}
              type="button"
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border cursor-pointer shrink-0 transition-all ${
                category === tab
                  ? 'bg-[#0A4D8C] text-white border-[#0A4D8C] shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 MAIN CONTENT CONTAINER */}
      {filterReservation.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center text-gray-400 flex flex-col items-center justify-center gap-3 shadow-sm min-h-[300px]">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <AlertCircle size={36} className="text-gray-300" />
          </div>
          <div>
            <p className="text-base sm:text-lg font-semibold text-gray-700">No reservations found</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Try adjusting your search criteria or filter options.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW */}
          <div className="grid grid-cols-1 gap-3.5 md:hidden">
            {filterReservation.map((item) => {
              const id = item._id.slice(-6).toUpperCase();
              const formattedDate = formatBannerDate(item.bookingDate);
              return (
                <div
                  key={id}
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3 relative"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">{id}</span>
                      <h3 className={`font-bold 
                        ${item.status === "cancelled" ? "text-red-500 line-through" : "text-gray-900"} 
                        ${item.status === "completed" ? "text-blue-500 line-through" : "text-gray-600"}
                        text-base`}>{item.name}</h3>
                    </div>

                    <div className="relative inline-flex items-center">
                      <span 
                        className={`absolute left-3 w-2 h-2 rounded-full pointer-events-none 
                          z-10 transition-colors duration-200 ${getDotColor(item.status)}`} 
                      />
                      <select 
                        value={item.status}
                        className={`
                          appearance-none text-xs sm:text-sm font-semibold 
                          pl-7 pr-7 py-1
                          rounded-full border shadow-sm
                          outline-none cursor-pointer 
                          focus:ring-2 focus:ring-offset-1 
                          transition-all duration-200 ease-in-out
                          ${getStatusBadge(item.status)}
                        `}
                        onChange={(e) => updateStatus(item._id, e.target.value)}
                      >
                        <option value="pending" className="bg-white text-gray-900 font-medium">Pending</option>
                        <option value="confirmed" className="bg-white text-gray-900 font-medium">Confirmed</option>
                        <option value="completed" className="bg-white text-gray-900 font-medium">Completed</option>
                        <option value="cancelled" className="bg-white text-gray-900 font-medium">Cancelled</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[#0A4D8C] shadow-2xs hover:bg-blue-100/60 hover:border-blue-300 transition-all duration-150">
                    <Armchair className="w-3.5 h-3.5 text-[#0A4D8C] shrink-0" />
                    <span className="text-xs font-bold text-blue-900/60 uppercase tracking-tight">T-</span>
                    <input
                      type="number"
                      placeholder="--"
                      value={item.tableNumber || ""}
                      onChange={(e) => updateTable(item._id, e.target.value)}
                      className="w-9 bg-transparent font-bold text-xs sm:text-sm text-[#0A4D8C] 
                      focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-300 rounded 
                      px-1 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 py-2 border-y border-gray-50 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{item.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{item.guests}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{formattedDate} at {item.bookingTime}</span>
                    </div>
                  </div>

                  {item.specialRequest && (
                    <p className="text-xs text-gray-500 italic bg-gray-50/80 p-2 rounded-lg">
                      "{item.specialRequest}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* DESKTOP VIEW */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="py-4 px-6">Customer Name</th>
                    <th className="py-4 px-4">Phone Number</th>
                    <th className="py-4 px-4 text-center">Guests</th>
                    <th className="py-4 px-4 text-center">Date & Time</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-4 text-center">Table No</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm">
                  {filterReservation.map((item) => {
                    const id = item._id.slice(-6).toUpperCase();
                    const formattedDate = formatBannerDate(item.bookingDate);
                    return (
                      <tr key={id} className="hover:bg-gray-50/70 transition-colors group">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className={`font-semibold 
                            ${item.status === "cancelled" ? "text-red-500 line-through" : "text-gray-900"}
                            ${item.status === "completed" ? "text-blue-500 line-through" : "text-gray-600"}
                            `}>{item.name}</div>
                          <div className="text-[11px] text-gray-400 font-mono">RES-{id}</div>
                        </td>

                        <td className={`py-4 px-4 whitespace-nowrap font-medium text-xs sm:text-sm
                          ${item.status === "cancelled" || item.status === "completed" ? "line-through text-gray-400" : "text-gray-600"}`}
                        >
                          {item.phoneNumber}
                        </td>

                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-semibold">
                            <Users className="w-3.5 h-3.5 text-gray-500" />
                            {item.guests}
                          </span>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-medium text-gray-800 text-xs text-center sm:text-sm">{formattedDate}</div>
                          <div className="text-xs text-gray-400 flex items-center justify-center gap-1 mt-0.5">
                            <Clock size={12} />
                            {item.bookingTime}
                          </div>
                        </td>

                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <div className="relative inline-flex items-center">
                            <span 
                              className={`absolute left-3 w-2 h-2 rounded-full pointer-events-none 
                                z-10 transition-colors duration-200 ${getDotColor(item.status)}`} 
                            />
                            <select 
                              value={item.status}
                              className={`
                                appearance-none text-xs sm:text-sm font-semibold 
                                pl-7 pr-7 py-1
                                rounded-full border shadow-sm
                                outline-none cursor-pointer 
                                focus:ring-2 focus:ring-offset-1 
                                transition-all duration-200 ease-in-out
                                ${getStatusBadge(item.status)}
                              `}
                              onChange={(e) => updateStatus(item._id, e.target.value)}
                            >
                              <option value="pending" className="bg-white text-gray-900 font-medium">Pending</option>
                              <option value="confirmed" className="bg-white text-gray-900 font-medium">Confirmed</option>
                              <option value="completed" className="bg-white text-gray-900 font-medium">Completed</option>
                              <option value="cancelled" className="bg-white text-gray-900 font-medium">Cancelled</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 text-gray-400 pointer-events-none" />
                          </div>
                        </td>

                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[#0A4D8C] shadow-2xs hover:bg-blue-100/60 hover:border-blue-300 transition-all duration-150">
                            <Armchair className="w-3.5 h-3.5 text-[#0A4D8C] shrink-0" />
                            <span className="text-xs font-bold text-blue-900/60 uppercase tracking-tight">T-</span>
                            <input
                              type="number"
                              placeholder="--"
                              value={item.tableNumber || ""}
                              onChange={(e) => updateTable(item._id, e.target.value)}
                              className="w-9 bg-transparent font-bold text-xs sm:text-sm text-[#0A4D8C] 
                              focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-300 rounded 
                              px-1 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                              [&::-webkit-inner-spin-button]:appearance-none transition-all"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}