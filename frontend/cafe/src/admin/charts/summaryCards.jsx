import { TrendingUp, TrendingDown, } from 'lucide-react';
export default function SummaryCard({ title, value, trend, isUp, icon: Icon, iconBg }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</span>
        <div className={`p-2 rounded-xl ${iconBg}`}>
          <Icon size={18} />
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{value ?? '--'}</div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-1 text-xs">
            <span className={`inline-flex items-center font-semibold ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isUp ? <TrendingUp size={13} className="mr-0.5" /> : <TrendingDown size={13} className="mr-0.5" />}
              {isUp ? '+' : ''}{trend}%
            </span>
            <span className="text-slate-400">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );
}