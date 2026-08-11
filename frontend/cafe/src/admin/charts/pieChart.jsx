import { Tooltip, ResponsiveContainer,Pie,PieChart,Cell } from 'recharts';
export default function PieChartGraph({customerTypesData,TYPE_COLORS}){
    return(
        <>
        <div>
            <h3 className="font-bold text-slate-900 text-base">Customer Segments</h3>
            <p className="text-xs text-slate-500">Distribution by loyalty tier</p>
        </div>
        <div className="my-2 h-[190px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={customerTypesData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                >
                {customerTypesData.map((entry) => (
                    <Cell key={entry.name} fill={TYPE_COLORS[entry.type]?.fill || '#94a3b8'} />
                ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
            </ResponsiveContainer>
        </div>
        {/* Custom Legend */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
            {customerTypesData.map((type) => (
            <div key={type.name} className="flex flex-col items-center">
                <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${TYPE_COLORS[type.type]?.dot}`} />
                <span className="text-xs text-slate-500 font-medium">{type.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-800 mt-0.5">{type.value}</span>
            </div>
            ))}
        </div>
        </>
    )
}
function CustomPieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs shadow-xl border border-slate-800">
        <span className="font-semibold">{data.name}: </span>
        <span className="font-bold">{data.value}</span>
      </div>
    );
  }
  return null;
}