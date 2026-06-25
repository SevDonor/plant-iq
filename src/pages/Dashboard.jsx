import { Activity, Droplets, Leaf, Power, Sun, Thermometer, Wind } from 'lucide-react';
import AlertCard from '../components/AlertCard';
import PlantStatusCard from '../components/PlantStatusCard';
import ReminderCard from '../components/ReminderCard';
import SensorCard from '../components/SensorCard';
import SensorChart from '../components/SensorChart';
import WeatherCard from '../components/WeatherCard';
import { derivePlantAlerts } from '../firebase/plantService';

const sensorConfig = [
  {
    key: 'temperature',
    title: 'Nhiệt độ',
    unit: '°C',
    icon: Thermometer,
    accent: 'orange',
  },
  {
    key: 'airHumidity',
    title: 'Độ ẩm không khí',
    unit: '%',
    icon: Droplets,
    accent: 'blue',
  },
  {
    key: 'soilMoisture',
    title: 'Độ ẩm đất',
    unit: '%',
    icon: Leaf,
    accent: 'green',
  },
  {
    key: 'light',
    title: 'Ánh sáng',
    unit: 'lx',
    icon: Sun,
    accent: 'amber',
  },
  {
    key: 'airQuality',
    title: 'Không khí',
    unit: 'AQI',
    icon: Wind,
    accent: 'violet',
  },
];

function Dashboard({ data, loading, error, onNavigate }) {
  const alerts = derivePlantAlerts(data.currentSensor, data.plant?.thresholds);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <section className="rounded-card border border-rose-100 bg-white/90 p-8 shadow-card" role="alert">
        <h2 className="text-xl font-black text-rose-700">Không tải được dữ liệu Firebase</h2>
        <p className="mt-2 text-sm font-semibold text-slate-600">
          Plant-IQ vẫn có thể chạy bằng mock data. Kiểm tra lại biến môi trường Firebase nếu bạn muốn dùng dữ liệu thật.
        </p>
      </section>
    );
  }

  if (!data.plant) {
    return (
      <section className="rounded-card border border-dashed border-emerald-200 bg-white/80 p-8 text-center shadow-card">
        <h2 className="text-xl font-black text-slate-900">Chưa có cây nào</h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">Thêm cây đầu tiên để bắt đầu theo dõi cảm biến.</p>
      </section>
    );
  }

  return (
    <div className="space-y-6 3xl:space-y-8">
      <div className="grid items-stretch gap-6 2xl:grid-cols-[minmax(0,0.96fr)_minmax(520px,1.04fr)] 3xl:gap-7">
        <WeatherCard weather={data.weather} />
        <PlantStatusCard plant={data.plant} onDetail={() => onNavigate('detail')} />
      </div>

      <section aria-labelledby="sensor-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 3xl:mb-5">
          <h2 id="sensor-heading" className="text-xl font-black text-slate-950">
            Chỉ số cảm biến hiện tại
          </h2>
          <span className="rounded-2xl border border-emerald-100 bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-soft">
            Chế độ: {data.mode === 'firebase' ? 'Firebase realtime' : 'Mock local'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-5 3xl:gap-5">
          {sensorConfig.map((item) => (
            <SensorCard
              key={item.key}
              title={item.title}
              value={data.currentSensor[item.key]}
              unit={item.unit}
              icon={item.icon}
              accent={item.accent}
              compact
              trend={data.sensorHistory.map((row) => ({ value: row[item.key] }))}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="mpu-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 3xl:mb-5">
          <h2 id="mpu-heading" className="text-xl font-black text-slate-950">
            Cảm biến gia tốc MPU6050
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5 3xl:gap-5">
          <SensorCard
            title="Gia tốc X"
            value={data.device?.mpu6050?.accel_x ?? 0}
            unit="g"
            icon={Activity}
            accent="rose"
            compact
            trend={[]}
          />
          <SensorCard
            title="Gia tốc Y"
            value={data.device?.mpu6050?.accel_y ?? 0}
            unit="g"
            icon={Activity}
            accent="emerald"
            compact
            trend={[]}
          />
          <SensorCard
            title="Gia tốc Z"
            value={data.device?.mpu6050?.accel_z ?? 0}
            unit="g"
            icon={Activity}
            accent="sky"
            compact
            trend={[]}
          />
          <SensorCard
            title="Bơm nước"
            value={data.device?.pump ? 'BẬT' : 'TẮT'}
            status={data.device?.pump ? 'Đang tưới' : 'Đang tắt'}
            unit=""
            icon={Power}
            accent={data.device?.pump ? 'blue' : 'orange'}
            compact
            trend={[]}
          />
          <SensorCard
            title="Mực nước"
            value={data.device?.waterLevel ?? 0}
            status={data.device?.waterLevel > 20 ? 'Bình thường' : 'Sắp hết'}
            unit="%"
            icon={Droplets}
            accent={data.device?.waterLevel > 20 ? 'blue' : 'rose'}
            compact
            trend={[]}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] 3xl:grid-cols-[1.15fr_0.85fr] 3xl:gap-7">
        <Panel title="Biểu đồ 24 giờ qua">
          <SensorChart data={data.sensorHistory} />
        </Panel>
        <Panel title="Cảnh báo hệ thống">
          <div className="grid gap-3">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
            {data.activity.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-black text-slate-500">{item.time}</span>
                <span className="text-sm font-semibold text-slate-700">{item.title}</span>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr] 3xl:gap-7">
        <Panel title="Lịch chăm sóc sắp tới" action="Xem tất cả" onAction={() => onNavigate('care')}>
          <div className="grid gap-3">
            {data.reminders.slice(0, 3).map((reminder) => (
              <ReminderCard key={reminder.id} reminder={reminder} compact />
            ))}
          </div>
        </Panel>
        <Panel title="Hoạt động hệ thống">
          <div className="grid gap-3">
            {data.activity.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-2xl bg-white/70 px-4 py-3">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                  {item.time}
                </span>
                <span className="text-sm font-semibold text-slate-700">{item.title}</span>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}

function Panel({ title, action, onAction, children }) {
  return (
    <section className="rounded-card border border-slate-100 bg-white/90 p-5 shadow-card 2xl:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
        {action ? (
          <button type="button" onClick={onAction} className="text-sm font-black text-emerald-600 hover:text-emerald-700">
            {action}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-40 animate-pulse rounded-card bg-white/72 shadow-soft" />
      ))}
    </div>
  );
}

export default Dashboard;
