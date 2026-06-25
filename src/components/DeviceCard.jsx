import { Cpu, Power, Radio, Wifi } from 'lucide-react';

function DeviceCard({ device, onPumpToggle, busy }) {
  const isOnline = device.status === 'online';

  return (
    <article className="rounded-card border border-slate-100 bg-white/88 p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">Thiết bị ESP32</p>
          <h3 className="mt-1 text-xl font-black text-slate-900">{device.id}</h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${
            isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      <dl className="mt-5 grid gap-3 text-sm">
        <Info icon={Wifi} label="Tín hiệu" value={device.signal || 'Không rõ'} />
        <Info
          icon={Radio}
          label="Cập nhật cuối"
          value={new Date(device.lastSeen).toLocaleString('vi-VN')}
        />
        <Info icon={Cpu} label="Firmware" value={device.firmware || 'N/A'} />
      </dl>

      <button
        type="button"
        onClick={() => onPumpToggle(!device.pump)}
        disabled={busy}
        className={`mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black transition ${
          device.pump
            ? 'bg-amber-500 text-white hover:bg-amber-600'
            : 'bg-emerald-600 text-white hover:bg-emerald-700'
        } disabled:opacity-60`}
      >
        <Power size={18} aria-hidden="true" />
        {busy ? 'Đang cập nhật...' : device.pump ? 'Đang tưới' : 'Bật bơm nước'}
      </button>
    </article>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
      <dt className="flex items-center gap-2 font-semibold text-slate-500">
        <Icon size={17} aria-hidden="true" />
        {label}
      </dt>
      <dd className="text-right font-black text-slate-900">{value}</dd>
    </div>
  );
}

export default DeviceCard;
