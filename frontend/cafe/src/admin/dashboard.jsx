import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  CalendarDays, 
  UtensilsCrossed, 
  Users, 
  Clock, 
  UserPlus, 
  CheckCircle, 
} from 'lucide-react';
export default function CafeHeavenDashboard() {
  // Static values replacing state metrics
  const totalTables = 25;
  const occupiedTables = 18;
  const availableTables = totalTables - occupiedTables;
  const {bookings}=useOutletContext();
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
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
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "2026-08-06"
  };

  const todaysBookings = bookings.filter(
    (item) => item.bookingDate === getTodayString()
  ).length;

  return (
    <div className="p-6 md:p-8 space-y-8 bg-gray-50 min-h-full">
        {/* 3. DASHBOARD MAIN CONTENT */}
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header Title Bar */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Floor & Booking Overview</h2>
                <p className="text-sm text-gray-500">Excluding automated third-party online deliveries.</p>
              </div>
            </div>

            {/* 📊 STATS CARDS (Top Section) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { title: "Total Reservations", value: bookings.length, icon: CalendarDays, desc: "All-time bookings", color: "text-[#0A4D8C] bg-blue-50" },
                { title: "Today's Bookings", value:todaysBookings, icon: CheckCircle, desc: "Remaining schedule", color: "text-[#6DBE45] bg-green-50" },
                { title: "Total Customers", value: bookings.length, icon: Users, desc: "Loyalty members registered", color: "text-purple-600 bg-purple-50" },
                { title: "Peak Floor Hours", value: "7PM - 9PM", icon: Clock, desc: "High occupancy zone", color: "text-orange-600 bg-orange-50" },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{stat.title}</span>
                      <h3 className="text-2xl font-extrabold text-gray-900">{stat.value}</h3>
                      <p className="text-xs text-gray-400 font-medium">{stat.desc}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${stat.color}`}>
                      <Icon size={22} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 🔹 MAIN CONTENT 2-COLUMN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* LEFT SIDE: UPCOMING RESERVATIONS */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Upcoming Bookings Panel</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Live floor arrivals listing</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                        <th className="py-4 px-6">Guest ID / Contact</th>
                        <th className="py-4 px-6">Name</th>
                        <th className="py-4 px-6 text-center">Party Size</th>
                        <th className="py-4 px-6">Arrival Time</th>
                        <th className="py-4 px-6 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                      {bookings.map((res)=>{
                        const shortId=res._id.slice(-6).toUpperCase();
                        return(
                        <tr key={res._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className={`text-xs font-bold
                               ${res.status==="cancelled" ? "text-[#0A4D8C] line-through" :"text-[#0A4D8C]"}
                               ${res.status==="completed" ? "text-blue-300":""}
                               `}>
                              RES-{shortId}
                            </div>
                            <div className="text-xs text-gray-400">{res.phoneNumber}</div>
                          </td>
                          <td className={`py-4 px-6 font-semibold 
                              ${res.status === "cancelled" 
                                ? "text-rose-700 line-through" 
                                : res.status === "completed" 
                                ? "text-gray-500" 
                                : "text-gray-900"
                              }
                            `}>
                              {res.name}
                          </td>
                          <td className={`py-4 px-6 text-center font-medium 
                            ${res.status==="cancelled" ? "text-gray-700 line-through" :"text-gray-700"}
                            ${res.status==="completed" ? "text-gray-400":""}
                            `}>
                            {res.guests}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5
                               font-semibold
                               ${res.status==="cancelled" ? "text-gray-600 line-through" :"text-gray-600"}
                               `}>
                              <Clock size={14} className='text-gray-400'/>
                              {res.bookingTime}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex justify-center">
                              
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(res.status)}`}
                              >
                                {/* Dot */}
                                <span className={`w-2 h-2 rounded-full ${getDotColor(res.status)}`} />

                                {/* Text */}
                                {res.status.charAt(0).toUpperCase() + res.status.slice(1).toLowerCase()}
                              </span>

                            </div>
                          </td>
                        </tr>
                        )
                      }
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RIGHT SIDE: TODAY'S SUMMARY & QUICK ACTIONS */}
              <div className="space-y-6">
                
                {/* Today's Summary Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 text-base mb-4">Today's Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <span className="text-sm text-gray-500 font-medium">Total bookings today</span>
                      <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{bookings.length} Lists</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <span className="text-sm text-gray-500 font-medium">Available Floor Tables</span>
                      <span className="text-sm font-bold text-[#6DBE45] bg-green-50 px-2 py-0.5 rounded">{availableTables} Left</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-medium">Occupied Tables</span>
                      <span className="text-sm font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">{occupiedTables} Active</span>
                    </div>
                  </div>

                  {/* Simple Data Visual Bar */}
                  <div className="w-full bg-gray-100 h-2 rounded-full mt-6 overflow-hidden flex">
                    <div className="bg-[#0A4D8C]" style={{ width: `${(occupiedTables/totalTables)*100}%` }}></div>
                    <div className="bg-[#6DBE45]" style={{ width: `${(availableTables/totalTables)*100}%` }}></div>
                  </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 text-base mb-4">Quick Operator Actions</h3>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    <div className="w-full flex items-center gap-3 p-3 text-left border border-gray-100 rounded-xl hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors cursor-default">
                      <div className="p-2 bg-blue-50 text-[#0A4D8C] rounded-lg">
                        <UserPlus size={16} />
                      </div>
                      <span>Create Reservation Entry</span>
                    </div>
                    
                    <div className="w-full flex items-center gap-3 p-3 text-left border border-gray-100 rounded-xl hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors cursor-default">
                      <div className="p-2 bg-green-50 text-[#6DBE45] rounded-lg">
                        <UtensilsCrossed size={16} />
                      </div>
                      <span>Manage Floor Menu Cards</span>
                    </div>

                    <div className="w-full flex items-center gap-3 p-3 text-left border border-gray-100 rounded-xl hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors cursor-default">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <Users size={16} />
                      </div>
                      <span>View Loyalty Customers</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
    </div>
  );
}