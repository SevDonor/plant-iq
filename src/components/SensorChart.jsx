import {
  Area,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
} from 'recharts';

function SensorChart({ data = [], mode = 'compact' }) {
  if (!data.length) {
    return (
      <div className="rounded-card border border-dashed border-emerald-200 bg-white/70 p-6 text-sm font-semibold text-slate-500">
        Chưa có dữ liệu lịch sử cảm biến.
      </div>
    );
  }

  const heightClass = mode === 'large' ? 'h-[340px] 3xl:h-[380px]' : 'h-[250px] sm:h-[285px] 3xl:h-[320px]';

  return (
    <div className={`w-full ${heightClass}`} role="img" aria-label="Biểu đồ cảm biến theo thời gian">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 16, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="temperatureFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.26} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="moistureFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.24} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 8" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              border: '1px solid #dbeafe',
              borderRadius: 16,
              boxShadow: '0 14px 30px rgba(15, 23, 42, 0.12)',
            }}
          />
          <Legend iconType="circle" />
          <Area
            type="monotone"
            dataKey="temperature"
            name="Nhiệt độ"
            stroke="#f97316"
            fill="url(#temperatureFill)"
            strokeWidth={3}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="soilMoisture"
            name="Độ ẩm đất"
            stroke="#22c55e"
            fill="url(#moistureFill)"
            strokeWidth={3}
            dot={false}
          />
          {mode === 'large' ? (
            <>
              <Area
                type="monotone"
                dataKey="airHumidity"
                name="Độ ẩm không khí"
                stroke="#3b82f6"
                fill="transparent"
                strokeWidth={2}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="light"
                name="Ánh sáng"
                stroke="#eab308"
                fill="transparent"
                strokeWidth={2}
                dot={false}
              />
            </>
          ) : null}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SensorChart;
