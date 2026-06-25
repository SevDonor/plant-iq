import { useMemo, useState } from 'react';
import { Droplets, Lightbulb, Thermometer, Waves } from 'lucide-react';
import SensorChart from '../components/SensorChart';

const filters = ['24 giờ', '7 ngày', '30 ngày'];

function Statistics({ history, reminders }) {
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  const averages = useMemo(() => {
    const count = history.length || 1;
    const sum = history.reduce(
      (acc, row) => ({
        temperature: acc.temperature + row.temperature,
        airHumidity: acc.airHumidity + row.airHumidity,
        soilMoisture: acc.soilMoisture + row.soilMoisture,
        light: acc.light + row.light,
      }),
      { temperature: 0, airHumidity: 0, soilMoisture: 0, light: 0 },
    );

    return {
      temperature: (sum.temperature / count).toFixed(1),
      humidity: Math.round((sum.airHumidity + sum.soilMoisture) / (count * 2)),
      light: Math.round(sum.light / count),
      watering: reminders.filter((item) => item.type === 'watering').length,
    };
  }, [history, reminders]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-950">Thống kê cảm biến</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Theo dõi xu hướng nhiệt độ, độ ẩm và ánh sáng.</p>
        </div>
        <div className="flex rounded-2xl border border-emerald-100 bg-white p-1 shadow-soft">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`min-h-10 rounded-xl px-4 text-sm font-black transition ${
                activeFilter === filter ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-emerald-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Average icon={Thermometer} label="Nhiệt độ TB" value={`${averages.temperature}°C`} />
        <Average icon={Waves} label="Độ ẩm TB" value={`${averages.humidity}%`} />
        <Average icon={Lightbulb} label="Ánh sáng TB" value={`${averages.light} lx`} />
        <Average icon={Droplets} label="Số lần tưới" value={averages.watering} />
      </div>

      <div className="rounded-card border border-slate-100 bg-white/88 p-6 shadow-card">
        <h3 className="mb-4 text-xl font-black text-slate-950">Biểu đồ line chart</h3>
        <SensorChart data={history} mode="large" />
      </div>
    </section>
  );
}

function Average({ icon: Icon, label, value }) {
  return (
    <article className="rounded-card border border-slate-100 bg-white/88 p-5 shadow-card">
      <Icon size={24} className="text-emerald-600" aria-hidden="true" />
      <p className="mt-3 text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
    </article>
  );
}

export default Statistics;
