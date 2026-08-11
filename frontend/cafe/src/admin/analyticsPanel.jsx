import React from 'react';
import { 
  Users, 
  Calendar, 
  Crown, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronRight,
  Award,
  CheckCircle
} from 'lucide-react';

import { useOutletContext } from 'react-router-dom';
import { useState} from 'react';
import { isToday,isThisWeek,isThisMonth } from 'date-fns';
import LineChartGraph from './charts/lineChart';
import BarChartGraph from './charts/barChart';
import PieChartGraph from './charts/pieChart';
import SummaryCard from './charts/summaryCards';
import RecentActiveFeed from './charts/recentFeed';

// Color Palette for Pie Chart & Badges
const TYPE_COLORS = {
  vip: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', fill: '#f59e0b', dot: 'bg-amber-400' },
  frequent: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', fill: '#10b981', dot: 'bg-emerald-400' },
  new: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', fill: '#3b82f6', dot: 'bg-blue-400' }
};

const STATUS_BADGES = {
  confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: AlertCircle },
  cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle },
  completed: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: CheckCircle
  }
};
const FILTER_TABS=["All","today","this month","this week"];
export default function AnalyticsPanel() {
  const {bookings}=useOutletContext();
  const [category,setCategory]=useState("All");

  // filterization
  const filteredBookings=React.useMemo(()=>{
    if(category==="All") return bookings;
    if(category==="today"){
      return bookings.filter(b =>
      isToday(new Date(b.bookingDate+ "T00:00:00"))
    );
    }
    if(category==="this week"){
      return bookings.filter(b =>
      isThisWeek(new Date(b.bookingDate+ "T00:00:00"), { weekStartsOn: 1 })
    );
    }
    if(category==="this month"){
      return bookings.filter(b =>
      isThisMonth(new Date(b.bookingDate+ "T00:00:00"))
    );
    }
    return bookings;
  },[bookings,category])
  const uniqueCustomers = new Set(filteredBookings.map(b => b.phoneNumber)).size;
  const confirmed=filteredBookings.filter((b)=>b.status==="confirmed").length;
  const vipCount = filteredBookings.filter((b) => b.customerType === "vip").length;
  const now = new Date();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(now.getDate() - 14);
  const currentWeek = filteredBookings.filter(b => {
    const date = new Date(b.createdAt);
    return date >= sevenDaysAgo && date <= now;
  });

  const previousWeek = filteredBookings.filter(b => {
    const date = new Date(b.createdAt);
    return date >= fourteenDaysAgo && date < sevenDaysAgo;
  });
  const current = currentWeek.length;
  const previous = previousWeek.length;
  const trend = previous === 0
  ? 0
  : ((current - previous) / previous) * 100;
  const isUp = trend >= 0;

  // recent booking 
  const recentBookings = [...filteredBookings]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 4); // show only latest 4

  // for lineChart
  const bookingsOverTime = React.useMemo(() => {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const map = {};

  filteredBookings.forEach(b => {
    const date = new Date(b.bookingDate);
    const day = days[date.getDay()];

    if (!map[day]) {
      map[day] = { time: day, bookings: 0 };
    }

    map[day].bookings += 1;
  });

  return days.map(day => map[day] || { time: day, bookings: 0 });

  }, [filteredBookings]);

  // for pieChart
  const customerTypesData = React.useMemo(() => {
  const map = {
    vip: 0,
    frequent: 0,
    new: 0
  };

  filteredBookings.forEach(b => {
    if (map[b.customerType] !== undefined) {
      map[b.customerType]++;
    }
  });

  return [
    { name: "VIP", value: map.vip, type: "vip" },
    { name: "Frequent", value: map.frequent, type: "frequent" },
    { name: "New", value: map.new, type: "new" }
  ];
  }, [filteredBookings]);

  // barChart
  const visitDistribution = React.useMemo(() => {
    const ranges = {
      "1 Visit": 0,
      "2-5 Visits": 0,
      "6-15 Visits": 0,
      "16+ Visits": 0
    };

    filteredBookings.forEach(b => {
      const visits = b.totalVisits || 1;

      if (visits === 1) ranges["1 Visit"]++;
      else if (visits <= 5) ranges["2-5 Visits"]++;
      else if (visits <= 15) ranges["6-15 Visits"]++;
      else ranges["16+ Visits"]++;
    });

    return Object.keys(ranges).map(key => ({
      range: key,
      count: ranges[key]
    }));
  }, [filteredBookings]);
  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* 1. HEADER & GLOBAL FILTERS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Analytics Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Real-time performance metrics and customer insights for your cafe.
            </p>
          </div>

          {/* Filter Bar (Static Visuals) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Date Range Selector */}
            <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200/80 shadow-inner max-w-full overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {FILTER_TABS.map((cat) => {
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shrink-0 whitespace-nowrap capitalize cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      isActive
                        ? "bg-white-600 text-slate-950 shadow-md shadow-indigo-600/25"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. TOP SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Bookings"
            value={filteredBookings.length}
            trend={trend.toFixed(1)}
            isUp={isUp}
            icon={Calendar}
            iconBg="bg-blue-50 text-blue-600"
          />
          <SummaryCard
            title="Total Customers"
            value={uniqueCustomers}
            trend={trend.toFixed(1)}
            isUp={isUp}
            icon={Users}
            iconBg="bg-emerald-50 text-emerald-600"
          />
          <SummaryCard
            title="Confirmed Bookings"
            value={confirmed}
            trend={trend.toFixed(1)}
            isUp={isUp}
            icon={CheckCircle}
            iconBg="bg-violet-50 text-violet-600"
          />
          <SummaryCard
            title="VIP Customers"
            value={vipCount}
            trend={trend.toFixed(1)}
            isUp={isUp}
            icon={Crown}
            iconBg="bg-amber-50 text-amber-600"
          />
        </div>

        {/* 3. CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Line Chart: Bookings & Revenue */}
          <LineChartGraph bookingsOverTime={bookingsOverTime}/>

          {/* Pie Chart: Customer Types */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <PieChartGraph customerTypesData={customerTypesData} TYPE_COLORS={TYPE_COLORS}/>
          </div>

        </div>

        {/* 4. SECONDARY CHARTS & TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <BarChartGraph visitDistribution={visitDistribution}/>

          {/* Top Customers Table */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Top Customers</h3>
                  <p className="text-xs text-slate-500">Ranked by total visits</p>
                </div>
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                  View All <ChevronRight size={13} />
                </button>
              </div>

              {/* Static Table View */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pl-1">Customer</th>
                      <th className="pb-3 text-center">Visits</th>
                      <th className="pb-3">Last Visit</th>
                      <th className="pb-3 text-right pr-1">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredBookings.map((customer) => {
                      const style = TYPE_COLORS[customer.customerType] || TYPE_COLORS.new;
                      const initials = customer.name.split(' ').map(n => n[0]).join('');
                      return (
                        <tr key={customer._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 pl-1">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-900 flex items-center gap-1 truncate">
                                  {customer.name}
                                  {customer.visits >= 20 && <Award size={13} className="text-amber-500 shrink-0" />}
                                </div>
                                <div className="text-[11px] text-slate-400">{customer.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-center font-semibold text-slate-800">
                            {customer.totalVisits}
                          </td>
                          <td className="py-3 text-slate-500">{customer.bookingDate}</td>
                          <td className="py-3 text-right pr-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[13px] font-semibold border ${style.bg} ${style.text} ${style.border}`}>
                              {customer.customerType.charAt(0).toUpperCase() + customer.customerType.slice(1).toLowerCase()}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* 5. RECENT ACTIVITY FEED */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <RecentActiveFeed recentBookings={recentBookings} STATUS_BADGES={STATUS_BADGES}/>
        </div>
      </div>
    </div>
  );
}