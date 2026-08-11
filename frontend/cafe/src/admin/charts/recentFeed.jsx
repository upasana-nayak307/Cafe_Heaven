import {Clock} from 'lucide-react';
export default function RecentActiveFeed({recentBookings,STATUS_BADGES}){
    return(
        <>
        <div className="flex items-center justify-between mb-4">
            <div>
                <h3 className="font-bold text-slate-900 text-base">Recent Table Bookings</h3>
                <p className="text-xs text-slate-500">Latest reservation activity</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">Live Feed</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentBookings.map((booking) => {
                const statusConfig = STATUS_BADGES[booking.status];
                const StatusIcon = statusConfig.icon;

                return (
                <div key={booking._id} className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-2 hover:bg-slate-100/60 transition-colors">
                    <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">T-{booking.tableNumber}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                        <StatusIcon size={10} />
                        {booking.status}
                    </span>
                    </div>

                    <div>
                    <h4 className="font-semibold text-slate-900 text-xs truncate">{booking.name}</h4>
                    <p className="text-[11px] text-slate-500">{booking.guests}</p>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                    <Clock size={10} />
                    <span>{booking.bookingTime}</span>
                    </div>
                </div>
                );
            })}
        </div>
        </>
    )
}