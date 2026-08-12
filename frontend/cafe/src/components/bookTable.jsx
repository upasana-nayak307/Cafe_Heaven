import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ChevronDown} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function BookTableDialog({ isOpen, onClose,setBookings }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [openTime, setOpenTime] = useState(false);
  const [selectGuest, setSelectGuest]=useState(false);
  const [formData,setFormData]=useState({
    name:"",
    email:"",
    phoneNumber:"",
    bookingDate:"",
    bookingTime:"",
    guests:"2 Guests",
    specialRequest:""
  });

  const [errorMsg,setErrorMsg]=useState({});
  const API=import.meta.env.VITE_BACKEND_URL;
  const handleChange=async (e) => {
    const {name,value}=e.target;
    setFormData({...formData,[name]:value});
    setErrorMsg((prev)=>({
      ...prev,[name]:""
    }))
  };

  const handleSubmit=async (e) => {
    e.preventDefault();
    let newErrors={};
    const emailRegex = /\S+@\S+\.\S+/;
    const indianPhoneRegex = /^(?:(?:\+|00)91[\s-]*)?[6-9]\d{9}$/;
    if(!formData.name.trim()){
      newErrors.name="Name is required";
    }
    if(!formData.email){
      newErrors.email="Email is required";
    }
    else if(!emailRegex.test(formData.email)){
      newErrors.email="Please write a valid email address";
    }
    if(!formData.phoneNumber){
      newErrors.phoneNumber="Number is required";
    }else if(!indianPhoneRegex.test(formData.phoneNumber)){
      newErrors.phoneNumber="Please enter a valid 10-digit mobile number"
    }
    if(!formData.bookingTime){
      newErrors.bookingTime="Select the time";
    }
    if(!formData.bookingDate){
      newErrors.bookingDate="Select the date";
    }
    if(!formData.guests){
      newErrors.guests="Select the no of guests";
    }

    // 🚨 STOP HERE if errors exist
    if (Object.keys(newErrors).length > 0) {
      setErrorMsg(newErrors);
      return;
    }
    setErrorMsg({});
    try {
      console.log(formData);
      const res=await axios.post(`${API}/bookingData`,formData);
      console.log(res.data);
      if(typeof setBookings==="function"){
      setBookings((prev)=>[...prev, res.data.bookingList]);
      }
      setFormData({
      name:"",
      email:"",
      phoneNumber:"",
      bookingDate:"",
      bookingTime:"",
      guests:"2 Guests",
      specialRequest:""
    })
    setSelectedDate(null);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        console.log(error.response.data.errors);
        setErrorMsg(error.response.data.errors);
      }
      console.log(error);
    }
  }

  const bookingTime=[
    "9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM"
  ]
  const guestNumbers=[
    "1 Guest","2 Guests","3 Guests","4 Guests","5 Guests","6 Guests"
  ]

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of month (0 = Sunday)
  const firstDay = new Date(year, month, 1).getDay();

  // Total days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Total days in previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
    });
  }

  // Next month days (fill remaining grid)
  let nextDay = 1;
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push({
      day: nextDay++,
      isCurrentMonth: false,
    });
  }
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  
return (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 md:p-10 shadow-2xl hide-scrollbar"
        >

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>

          {/* Title */}
          <h2 className="mb-8 text-4xl font-semibold text-[#0B3C5D] font-serif">
            Book a Table
          </h2>

          <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* LEFT - CALENDAR */}
            <div>
              <label className="mb-3 block font-semibold text-[#0B3C5D]">
                Select Date
              </label>

              <div className="rounded-2xl border border-[#A3D193]/40 bg-gradient-to-br from-white to-[#F8FFF8] shadow-md p-5">

                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <button
                    onClick={handlePrevMonth}
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-[#EAF5EF] transition"
                    type="button"
                  >
                    <ChevronLeft size={16} className="text-[#0B3C5D]" />
                  </button>

                  <span className="font-semibold text-[#0B3C5D] tracking-wide">
                    {monthName} {year}
                  </span>

                  <button
                  type="button"
                    onClick={handleNextMonth}
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-[#EAF5EF] transition"
                  >
                    <ChevronRight size={16} className="text-[#0B3C5D]" />
                  </button>
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-400 mb-3">
                  {daysOfWeek.map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>
                {/* Dates */}
                <div className="grid grid-cols-7 text-center gap-y-1">
                  {calendarDays.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (item.isCurrentMonth) {
                          const day = item.day;
                          const monthNum = month + 1;

                          const formattedDate = `${year}-${monthNum
                          .toString()
                          .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
                          
                          setSelectedDate(day);

                          setFormData({
                            ...formData,
                            bookingDate: formattedDate
                          });
                        }
                      }}
                      className={`mx-auto h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all duration-200
                      ${
                        item.isCurrentMonth
                          ? selectedDate === item.day
                            ? "bg-[#A3D193] text-white shadow-md scale-105"
                            : "text-[#0B3C5D] hover:bg-[#EAF5EF]"
                          : "text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {item.day}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT - FORM */}
            <div className="space-y-5">

              {/* Name */}
              <div>
                <label className="block mb-2 font-medium text-[#0B3C5D]">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={`w-full rounded-2xl border px-5 py-3 outline-none transition focus:ring-2
                    ${errorMsg.email 
                      ? "border-rose-400 focus:border-rose-500 bg-rose-50 focus:ring-rose-200" 
                      : "border-gray-200 focus:border-[#0A4D8C] focus:ring-blue-100"
                    }`}
                />
                {errorMsg.name && (
                  <p className="mt-1 text-sm font-medium text-rose-500 flex items-center gap-1">
                    ⚠️ {errorMsg.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 font-medium text-[#0B3C5D]">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={`w-full rounded-2xl border px-5 py-3 outline-none transition focus:ring-2
                    ${errorMsg.email 
                      ? "border-rose-400 focus:border-rose-500 bg-rose-50 focus:ring-rose-200" 
                      : "border-gray-200 focus:border-[#0A4D8C] focus:ring-blue-100"
                    }`}
                />
                {errorMsg.email && (
                  <p className="mt-1 text-sm font-medium text-rose-500 flex items-center gap-1">
                    ⚠️ {errorMsg.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-2 font-medium text-[#0B3C5D]">Phone</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+91 9078544798"
                  className={`w-full rounded-2xl border px-5 py-3 outline-none transition focus:ring-2
                    ${errorMsg.email 
                      ? "border-rose-400 focus:border-rose-500 bg-rose-50 focus:ring-rose-200" 
                      : "border-gray-200 focus:border-[#0A4D8C] focus:ring-blue-100"
                    }`}
                />
                {errorMsg.phoneNumber && (
                  <p className="mt-1 text-sm font-medium text-rose-500 flex items-center gap-1">
                    ⚠️ {errorMsg.phoneNumber}
                  </p>
                )}
              </div>

              {/* Time */}
              <div className="relative">
                <label className="block mb-2 font-medium text-[#0B3C5D]">
                  Select Time
                </label>
                {/* Trigger */}
                <div
                  onClick={() => setOpenTime(!openTime)}
                  className="w-full rounded-2xl border border-gray-200 px-5 py-3.5 cursor-pointer flex justify-between items-center hover:border-gray-300 transition"
                >
                  <span className="text-[#0B3C5D]">
                    {formData.bookingTime || "Select time"}
                  </span>
                  <span className={`transition ${openTime ? "rotate-180" : ""}`}>
                    <ChevronDown size={16} className="text-gray-400"/>
                  </span>
                </div>
                {/* Dropdown */}
                {openTime && (
                  <div className="absolute z-50 mt-2 w-full rounded-2xl bg-white shadow-lg border border-[#A3D193]/60 max-h-60 overflow-y-auto hide-scrollbar">
                    {bookingTime.map((t) => (
                      <div
                        key={t}
                        onClick={() => {
                          setFormData({...formData,bookingTime:t})
                          setErrorMsg((prev) => ({
                            ...prev,
                            bookingTime: ""
                          }));
                          setOpenTime(false);
                        }}
                        className="px-5 py-3 cursor-pointer text-[#0B3C5D] hover:bg-[#EAF5EF] hover:text-[#0B3C5D] transition-all duration-200"
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                )}
                {errorMsg.bookingTime && <span className="text-xs font-medium text-rose-500 mt-1 flex items-center gap-1">
                {errorMsg.bookingTime}
              </span> }
              </div>

              {/* Guests */}
              <div className="relative">
                <label className="block mb-2 font-medium text-[#0B3C5D]">
                  Select guests
                </label>
                {/* Trigger */}
                <div
                  onClick={() => setSelectGuest(!selectGuest)}
                  className="w-full rounded-2xl border border-gray-200 px-5 py-3.5 cursor-pointer flex justify-between items-center hover:border-gray-300 transition"
                >
                  <span className="text-[#0B3C5D]">
                    {formData.guests}
                  </span>
                  <span className={`transition ${selectGuest ? "rotate-180" : ""}`}>
                    <ChevronDown size={16} className="text-gray-400"/>
                  </span>
                </div>
                {/* Dropdown */}
                {selectGuest && (
                  <div className="absolute z-50 mt-2 w-full rounded-2xl bg-white shadow-lg border border-[#A3D193]/60 max-h-60 overflow-y-auto hide-scrollbar">
                    {guestNumbers.map((g) => (
                      <div
                        key={g}
                        onClick={() => {
                          setFormData({...formData,guests:g})
                          setErrorMsg((prev)=>({
                            ...prev,guests:""
                          }))
                          setSelectGuest(false);
                        }}
                        className="px-5 py-3 cursor-pointer text-[#0B3C5D] hover:bg-[#EAF5EF] hover:text-[#0B3C5D] transition-all duration-200"
                      >
                        {g}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errorMsg.guests && <span className="text-xs font-medium text-rose-500 mt-1 flex items-center gap-1">
                {errorMsg.guests}
              </span> }
            </div> 
          </div> 

          {/* BOTTOM SECTION */}
          <div className="mt-6 space-y-6">

            {/* TEXTAREA */}
            <label className="block mb-2 font-medium text-[#0B3C5D]">Special Requests (optional)</label>
            <textarea
              rows={3}
              placeholder="Any dietary restrictions or special occasions?"
              value={formData.specialRequest}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-200 px-5 py-3.5 outline-none focus:border-[#0A4D8C]"
              name="specialRequest"
            />

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full rounded-full bg-[#0B3C5D] py-4 text-white font-semibold"
            >
              Confirm Booking
            </button>

          </div>
        </form>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
}