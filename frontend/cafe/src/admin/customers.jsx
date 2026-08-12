import React, { useState } from 'react';
import { 
  Search, 
  Plus,  
  Calendar,
  Clock,
  ChevronDown, 
  ArrowUpDown, 
  Award, 
  Phone, 
  Mail, 
  Users 
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
export default function CustomerManagement() {
  const {bookings,setBookings}=useOutletContext();

  const filterTabs=['All Customers', 'Frequent', 'New', 'VIP'];
  const [category,setSelectCategory]=useState("All Customers");
  const API=import.meta.env.VITE_BACKEND_URL;

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
  const customerMap = {};
  bookings.forEach((booking) => {
    const key = booking.email;

    if (!customerMap[key]) {
      // First time → create entry
      customerMap[key] = {
        ...booking,
        totalVisits: 1, // start from 1 (not 0)
      };
    } else {
      // Duplicate → increase count
      customerMap[key].totalVisits += 1;
    }
  });
  const customers = Object.values(customerMap);
  const filteredData=category==="All Customers" ? customers:customers.filter((c)=>c.customerType===category.toLowerCase());


  const handleCustomerType=async (id,customerType)=>{
    try {
      const res=await axios.put(`${API}/updateBookingData/${id}`,{customerType:customerType});
      console.log(res.data);
      setBookings((prevItem)=>
        prevItem.map((item)=>item._id===id ? {...item,customerType} : item)
      );
    } catch (error) {
      console.log(error);
    }
  }

  const getCustomerType=(customerType)=>{
    switch (customerType) {
      case 'frequent':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200/80 hover:bg-emerald-100/70';
      case 'vip':
        return 'bg-amber-50 text-amber-900 border-amber-200/80 hover:bg-amber-100/70';
      case 'new':
        return 'bg-blue-50 text-blue-900 border-blue-200/80 hover:bg-blue-100/70';
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 1. HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customer Management</h1>
            <p className="text-sm text-slate-500 mt-1">View, track, and manage your cafe's loyalty and guest network.</p>
          </div>
        </div>

        {/* 2. TOP CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
           {filterTabs.map((tab)=>(
            <button
              key={tab}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap cursor-pointer transition-all 
                ${category===tab? "bg-[#0A4D8C] text-white" : "bg-gray-200 text-gray-700"}
                `}
              onClick={()=>setSelectCategory(tab)}
            >
              {tab}
            </button>
           ))}
          </div>
        </div>

        {/* 3. MAIN CONTENT CONTAINER */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          
          {/* DESKTOP TABLE VIEW (Hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Customer Name</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4 cursor-pointer hover:text-slate-700">
                    <div className="flex items-center gap-1.5">
                      Total Visits
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 cursor-pointer hover:text-slate-700">
                    <div className="flex items-center gap-1.5">
                      Last Visit
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className='py-3.5 px-4 text-center'>Type</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredData.length >0 ?(
                   filteredData.map((customer) => { 
                    const name=customer.name.
                    split(' ')
                    .map((word)=>word
                    .charAt(0).toUpperCase()+
                    word.slice(1)).join(' ');

                    const avtarName=customer.name.
                    split(' ')
                    .map((word)=>word
                    .charAt(0).toUpperCase());
                    const dateStr=customer.bookingDate;
                    const formattedDate = new Date(dateStr).toLocaleDateString('en-GB');
                    return(
                  <tr 
                    key={customer._id} 
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Name & Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm text-white shrink-0 shadow-sm"
                          style={{ backgroundColor: '#0A4D8C' }}
                        >
                          {avtarName}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">{name}</span>
                            {customer.totalVisits >= 20 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                <Award className="w-3 h-3" /> Top
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-4 px-4">
                      <div className="space-y-1 text-slate-600">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {customer.phoneNumber}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {customer.email}
                        </div>
                      </div>
                    </td>

                    {/* Total Visits */}
                    <td className="py-4 px-4 font-medium text-slate-700">
                      <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg text-xs font-semibold">
                        {customer.totalVisits} visits
                      </span>
                    </td>

                    {/* Last Visit */}
                    <td className="py-4 px-4 text-slate-600 text-xs">
                      {formattedDate}
                    </td>

                    <td className='py-4 px-4 text-center'>
                    <div className="relative inline-flex items-center">
                      {/* Styled Dropdown */}
                      <select 
                        value={customer.customerType}
                        className={`
                        appearance-none text-xs sm:text-sm font-semibold text-center
                        pl-7 pr-7 py-1
                        rounded-full border shadow-sm
                        outline-none cursor-pointer 
                        focus:ring-2 focus:ring-offset-1 
                        transition-all duration-200 ease-in-out
                        ${getCustomerType(customer.customerType)}
                        `}
                        onChange={(e)=>handleCustomerType(customer._id,e.target.value)}
                      >
                        <option value="frequent" className="bg-white text-gray-900 font-medium py-1">Frequent</option>
                        <option value="new" className="bg-white text-gray-900 font-medium py-1">New</option>
                        <option value="vip" className="bg-white text-gray-900 font-medium py-1">VIP</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 text-gray-400 pointer-events-none" />
                    </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <div className="flex justify-center"> 
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(customer.status)}`}
                        >
                          {/* Dot */}
                          <span className={`w-2 h-2 rounded-full ${getDotColor(customer.status)}`} />

                          {/* Text */}
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </td>
                  </tr>
                    )
                }
                )
                ):(
                 <tr>
                  <td colSpan="6" className="text-center py-6">
                    No results found
                  </td>
                </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS VIEW (Shown only on small screens) */}
          <div className="grid grid-cols-1 divide-y divide-slate-100/80 md:hidden bg-slate-50/50">
            {filteredData.length > 0 ? (
              filteredData.map((customer) => {
                // Fix: Handle single names cleanly without crashing avatar logic
                const nameParts = customer.name.trim().split(/\s+/);
                const formattedName = nameParts
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                  .join(' ');
                const avatarInitials = nameParts
                  .slice(0, 2)
                  .map((w) => w.charAt(0).toUpperCase())
                  .join('');

                return (
                  <div 
                    key={customer._id} 
                    className="p-4 space-y-3 bg-white hover:bg-slate-50/80 transition-all duration-200"
                  >
                    {/* Top Header: Avatar, Name, Phone & Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar with Gradient */}
                        <div 
                          className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm bg-gradient-to-br from-[#0A4D8C] to-[#06335e] ring-2 ring-slate-100"
                        >
                          {avatarInitials}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-semibold text-slate-900 text-sm truncate">{formattedName}</h4>
                            {customer.totalVisits >= 20 && (
                              <span title="Loyal Customer">
                                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                              </span>
                            )}
                          </div>
                          
                          <a 
                            href={`tel:${customer.phoneNumber}`} 
                            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors mt-0.5"
                          >
                            <Phone size={11} className="text-slate-400" />
                            <span>{customer.phoneNumber}</span>
                          </a>
                        </div>
                      </div>

                      {/* Status Badge with Dot Inside */}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border shadow-2xs shrink-0 ${getStatusBadge(customer.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(customer.status)}`} />
                        {customer.status}
                      </span>
                    </div>

                    {/* Middle Row: Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50/80 p-3 rounded-xl border border-slate-100/80 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-white rounded-lg border border-slate-100 shadow-2xs text-slate-500">
                          <Calendar size={13} />
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Visits</span>
                          <span className="font-semibold text-slate-800">{customer.totalVisits} times</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-white rounded-lg border border-slate-100 shadow-2xs text-slate-500">
                          <Clock size={13} />
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Last Seen</span>
                          <span className="font-semibold text-slate-800">{customer.bookingDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Type Selector & Action Bar */}
                    <div className="flex items-center justify-between pt-1 gap-2">
                      <span className="text-xs font-medium text-slate-500">Tier / Type</span>
                      
                      <div className="relative inline-flex items-center">
                        <select 
                          value={customer.customerType}
                          onChange={(e) => handleCustomerType(customer._id, e.target.value)}
                          className={`
                            appearance-none text-xs font-semibold
                            pl-3 pr-7 py-1.5 rounded-lg border shadow-2xs
                            outline-none cursor-pointer tracking-wide
                            transition-all duration-150 ease-in-out
                            focus:ring-2 focus:ring-offset-1 focus:ring-slate-300
                            ${getCustomerType(customer.customerType)}
                          `}
                        >
                          <option value="frequent" className="bg-white text-slate-800 font-medium py-1">Frequent</option>
                          <option value="new" className="bg-white text-slate-800 font-medium py-1">New</option>
                          <option value="vip" className="bg-white text-slate-800 font-medium py-1">VIP</option>
                        </select>
                        <ChevronDown size={13} className="absolute right-2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-white">
                <p className="text-sm font-medium text-slate-500">No results found</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}