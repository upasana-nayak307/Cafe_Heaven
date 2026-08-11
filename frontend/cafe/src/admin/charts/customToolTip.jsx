export default function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl border border-slate-800">
        <p className="font-semibold mb-1 text-slate-300">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-slate-100 font-bold">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}