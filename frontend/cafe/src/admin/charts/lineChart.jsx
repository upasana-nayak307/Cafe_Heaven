import { 
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import CustomTooltip from './customToolTip';
export default function LineChartGraph({bookingsOverTime}){
    return(
        <>
        {/* Line Chart: Bookings & Revenue */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <div>
                <h3 className="font-bold text-slate-900 text-base">Bookings & Revenue Trend</h3>
                <p className="text-xs text-slate-500">Daily breakdown for selected period</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                THIS WEEK
                </span>
            </div>

            <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#0A4D8C" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#0A4D8C' }} 
                    activeDot={{ r: 6 }} 
                    />
                </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
        </>
    )
}