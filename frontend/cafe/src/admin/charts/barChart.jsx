import CustomTooltip from "./customToolTip"
import { 
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
export default function BarChartGraph({visitDistribution}){
    return(
        <>
        {/* Bar Chart: Visit Frequency */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="mb-4">
                <h3 className="font-bold text-slate-900 text-base">Visit Distribution</h3>
                <p className="text-xs text-slate-500">Frequency of customer visits</p>
            </div>

            <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
        </>
    )
}
