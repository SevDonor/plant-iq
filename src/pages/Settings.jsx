import { useState } from 'react';
import DeviceCard from '../components/DeviceCard';

function Settings({ data, onSaveSettings, onPumpToggle, actionBusy, pumpBusy }) {
  const [thresholds, setThresholds] = useState(data.plant.thresholds);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaveMessage('');
    await onSaveSettings({ thresholds });
    setSaveMessage('Đã lưu cấu hình ngưỡng cảnh báo.');
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <form onSubmit={handleSubmit} className="rounded-card border border-slate-100 bg-white/88 p-6 shadow-card">
        <h2 className="text-2xl font-black text-slate-950">Cài đặt cây</h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">Cập nhật thông tin và ngưỡng cảnh báo cho Plant-IQ.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ReadOnly label="Tên cây" value={data.plant.name} />
          <ReadOnly label="Tên khoa học" value={data.plant.scientificName} />
          {Object.entries(thresholds).map(([key, value]) => (
            <label key={key} className="grid gap-2 text-sm font-black text-slate-700">
              {thresholdLabel(key)}
              <input
                type="number"
                value={value}
                onChange={(event) =>
                  setThresholds({ ...thresholds, [key]: Number(event.target.value) })
                }
                className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 font-semibold outline-none focus:border-emerald-400"
              />
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={actionBusy}
          className="mt-6 min-h-12 rounded-2xl bg-emerald-600 px-6 font-black text-white shadow-soft transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {actionBusy ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
        {saveMessage ? (
          <p className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
            {saveMessage}
          </p>
        ) : null}
      </form>

      <aside className="space-y-6">
        <div className="rounded-card border border-sky-100 bg-white/88 p-5 shadow-card">
          <h3 className="text-xl font-black text-slate-950">Cấu hình Firebase</h3>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Trạng thái dữ liệu hiện tại: <span className="text-emerald-700">{data.mode}</span>.
            Thêm biến trong `.env` để dùng Firebase Realtime Database thật.
          </p>
        </div>
        <DeviceCard device={data.device} onPumpToggle={onPumpToggle} busy={pumpBusy} />
      </aside>
    </section>
  );
}

function ReadOnly({ label, value }) {
  return (
    <div className="grid gap-2 text-sm font-black text-slate-700">
      {label}
      <div className="min-h-12 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 font-semibold text-slate-600">
        {value}
      </div>
    </div>
  );
}

function thresholdLabel(key) {
  const labels = {
    soilMoistureMin: 'Độ ẩm đất min',
    soilMoistureMax: 'Độ ẩm đất max',
    tempMin: 'Nhiệt độ min',
    tempMax: 'Nhiệt độ max',
    airHumidityMin: 'Độ ẩm không khí min',
    airHumidityMax: 'Độ ẩm không khí max',
    lightMin: 'Ánh sáng min',
    lightMax: 'Ánh sáng max',
  };
  return labels[key] || key;
}

export default Settings;
