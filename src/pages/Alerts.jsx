import { AlertTriangle, BellRing, CheckCircle2, Droplets, Leaf, Thermometer, Zap } from 'lucide-react';
import AlertCard from '../components/AlertCard';
import { derivePlantAlerts } from '../firebase/plantService';

const levelMeta = {
  good: {
    icon: CheckCircle2,
    badge: 'bg-emerald-100 text-emerald-700',
    border: 'border-emerald-100',
  },
  warning: {
    icon: AlertTriangle,
    badge: 'bg-amber-100 text-amber-700',
    border: 'border-amber-100',
  },
  danger: {
    icon: AlertTriangle,
    badge: 'bg-rose-100 text-rose-700',
    border: 'border-rose-100',
  },
};

function Alerts({ data, alerts, onNavigate, onPumpToggle, pumpBusy }) {
  const activeAlerts = alerts?.length ? alerts : derivePlantAlerts(data.currentSensor, data.plant.thresholds);
  const deviceAlerts = data.device.status === 'online'
    ? []
    : [{ id: 'device-offline', title: 'Thiết bị ESP32 offline', level: 'danger' }];
  const allAlerts = [...deviceAlerts, ...activeAlerts];
  const criticalCount = allAlerts.filter((alert) => alert.level === 'danger').length;
  const warningCount = allAlerts.filter((alert) => alert.level === 'warning').length;

  return (
    <section className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="rounded-card border border-slate-100 bg-white/88 p-6 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-rose-600">Cảnh báo hệ thống</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Tình trạng cần chú ý</h2>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
                Cảnh báo tập trung vào bất thường cảm biến, thiết bị và hành động khẩn cấp. Lịch tưới, bón phân và kiểm tra lá nằm ở mục Chăm sóc.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
              <Summary label="Nghiêm trọng" value={criticalCount} tone="danger" />
              <Summary label="Cần chú ý" value={warningCount} tone="warning" />
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {allAlerts.map((alert) => (
              <AlertRow
                key={alert.id}
                alert={alert}
                sensor={data.currentSensor}
                onNavigate={onNavigate}
                onPumpToggle={onPumpToggle}
                pumpBusy={pumpBusy}
              />
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-card border border-emerald-100 bg-white/88 p-5 shadow-card">
            <h3 className="text-xl font-black text-slate-950">Trạng thái nhanh</h3>
            <div className="mt-4 grid gap-3">
              <Metric icon={Droplets} label="Độ ẩm đất" value={`${data.currentSensor.soilMoisture}%`} />
              <Metric icon={Thermometer} label="Nhiệt độ" value={`${data.currentSensor.temperature}°C`} />
              <Metric icon={Zap} label="Ánh sáng" value={`${data.currentSensor.light} lx`} />
              <Metric icon={BellRing} label="Thiết bị" value={data.device.status === 'online' ? 'Online' : 'Offline'} />
            </div>
          </div>

          <div className="rounded-card border border-slate-100 bg-white/88 p-5 shadow-card">
            <h3 className="text-xl font-black text-slate-950">Phân biệt</h3>
            <div className="mt-4 grid gap-3">
              <AlertCard alert={{ level: 'warning', title: 'Cảnh báo: xử lý bất thường ngay' }} />
              <AlertCard alert={{ level: 'info', title: 'Chăm sóc: lịch nhắc việc định kỳ' }} />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function AlertRow({ alert, sensor, onNavigate, onPumpToggle, pumpBusy }) {
  const meta = levelMeta[alert.level] ?? levelMeta.good;
  const Icon = meta.icon;
  const needsWater = alert.id === 'soil-low';

  return (
    <article className={`rounded-2xl border bg-white/84 p-4 shadow-soft ${meta.border}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${meta.badge}`}>
            <Icon size={20} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-slate-950">{alert.title}</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">{alertDescription(alert, sensor)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          {needsWater ? (
            <button
              type="button"
              onClick={() => onPumpToggle(true)}
              disabled={pumpBusy}
              className="min-h-10 rounded-2xl bg-emerald-600 px-4 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              Tưới ngay
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onNavigate('detail')}
            className="min-h-10 rounded-2xl bg-slate-100 px-4 text-sm font-black text-slate-700 transition hover:bg-slate-200"
          >
            Xem cây
          </button>
        </div>
      </div>
    </article>
  );
}

function Summary({ label, value, tone }) {
  const toneClass = tone === 'danger' ? 'text-rose-700 bg-rose-50' : 'text-amber-700 bg-amber-50';
  return (
    <div className={`rounded-2xl px-4 py-3 ${toneClass}`}>
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-black uppercase">{label}</p>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="flex items-center gap-2 text-sm font-bold text-slate-500">
        <Icon size={17} aria-hidden="true" />
        {label}
      </span>
      <span className="font-black text-slate-950">{value}</span>
    </div>
  );
}

function alertDescription(alert, sensor) {
  const descriptions = {
    'soil-low': `Độ ẩm đất hiện tại ${sensor.soilMoisture}%, thấp hơn ngưỡng an toàn.`,
    'temp-high': `Nhiệt độ hiện tại ${sensor.temperature}°C, nên kiểm tra vị trí đặt cây.`,
    'light-low': `Ánh sáng hiện tại ${sensor.light} lx, cây có thể cần gần cửa sổ hơn.`,
    'plant-good': 'Không phát hiện bất thường từ cảm biến hiện tại.',
    'device-offline': 'Không nhận được trạng thái online từ thiết bị.',
  };
  return descriptions[alert.id] || 'Kiểm tra chi tiết cây và cảm biến liên quan.';
}

export default Alerts;
