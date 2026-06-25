import { useEffect, useState } from 'react';
import { CalendarDays, Leaf, Pencil, Save, Thermometer, Waves, X } from 'lucide-react';
import DeviceCard from '../components/DeviceCard';
import ReminderCard from '../components/ReminderCard';
import SensorChart from '../components/SensorChart';
import { derivePlantAlerts } from '../firebase/plantService';

const inputControlClass = 'min-h-12 rounded-2xl border border-slate-200 bg-white px-4 font-semibold text-slate-800 outline-none transition focus:border-emerald-400';

function buildForm(plant) {
  return {
    name: plant.name || '',
    scientificName: plant.scientificName || '',
    species: plant.species || '',
    plantedDate: plant.plantedDate || '',
    ageMonth: plant.ageMonth || 0,
    stage: plant.stage || '',
    status: plant.status || 'good',
    statusText: plant.statusText || '',
    thresholds: { ...(plant.thresholds || {}) },
  };
}

function PlantDetail({ data, plant, onPumpToggle, pumpBusy, onSavePlant, actionBusy }) {
  const { currentSensor, sensorHistory, reminders, device } = data;
  const activePlant = plant || data.plant;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => buildForm(activePlant));
  const [saveMessage, setSaveMessage] = useState('');
  const alerts = derivePlantAlerts(currentSensor, activePlant.thresholds);

  useEffect(() => {
    if (!editing) setForm(buildForm(activePlant));
  }, [activePlant, editing]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaveMessage('');
    await onSavePlant(activePlant.id, {
      ...form,
      ageMonth: Number(form.ageMonth),
      thresholds: Object.fromEntries(
        Object.entries(form.thresholds).map(([key, value]) => [key, Number(value)]),
      ),
    });
    setEditing(false);
    setSaveMessage('Đã lưu thông tin cây.');
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="rounded-card border border-emerald-100 bg-white/88 p-6 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black uppercase tracking-wide text-emerald-600">Chi tiết cây</p>
              {editing ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <Field label="Tên cây">
                    <input
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      className={inputControlClass}
                      required
                    />
                  </Field>
                  <Field label="Tên khoa học">
                    <input
                      value={form.scientificName}
                      onChange={(event) => setForm({ ...form, scientificName: event.target.value })}
                      className={inputControlClass}
                      required
                    />
                  </Field>
                  <Field label="Loài / mô tả">
                    <input
                      value={form.species}
                      onChange={(event) => setForm({ ...form, species: event.target.value })}
                      className={inputControlClass}
                    />
                  </Field>
                  <Field label="Giai đoạn">
                    <input
                      value={form.stage}
                      onChange={(event) => setForm({ ...form, stage: event.target.value })}
                      className={inputControlClass}
                    />
                  </Field>
                </div>
              ) : (
                <>
                  <h2 className="mt-2 text-3xl font-black text-slate-950">{activePlant.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{activePlant.scientificName}</p>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">
                {alerts[0]?.title}
              </span>
              {editing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(buildForm(activePlant));
                      setEditing(false);
                    }}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 text-sm font-black text-slate-600 transition hover:bg-slate-200"
                  >
                    <X size={17} aria-hidden="true" />
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={actionBusy}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-60"
                  >
                    <Save size={17} aria-hidden="true" />
                    {actionBusy ? 'Đang lưu...' : 'Lưu'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-emerald-700 shadow-soft ring-1 ring-emerald-100 transition hover:bg-emerald-50"
                >
                  <Pencil size={17} aria-hidden="true" />
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {editing ? (
              <>
                <Field label="Ngày trồng">
                  <input
                    value={form.plantedDate}
                    onChange={(event) => setForm({ ...form, plantedDate: event.target.value })}
                    className={inputControlClass}
                  />
                </Field>
                <Field label="Tuổi cây (tháng)">
                  <input
                    type="number"
                    min="0"
                    value={form.ageMonth}
                    onChange={(event) => setForm({ ...form, ageMonth: event.target.value })}
                    className={inputControlClass}
                  />
                </Field>
                <Field label="Trạng thái">
                  <select
                    value={form.status}
                    onChange={(event) => setForm({ ...form, status: event.target.value })}
                    className={inputControlClass}
                  >
                    <option value="good">Đang khỏe</option>
                    <option value="warning">Cần chú ý</option>
                    <option value="danger">Nguy cấp</option>
                  </select>
                </Field>
                <Field label="Nhãn trạng thái">
                  <input
                    value={form.statusText}
                    onChange={(event) => setForm({ ...form, statusText: event.target.value })}
                    className={inputControlClass}
                  />
                </Field>
              </>
            ) : (
              <>
                <Info icon={CalendarDays} label="Ngày trồng" value={activePlant.plantedDate} />
                <Info icon={Leaf} label="Tuổi cây" value={`${activePlant.ageMonth} tháng`} />
                <Info icon={Waves} label="Độ ẩm đất" value={`${currentSensor.soilMoisture}%`} />
                <Info icon={Thermometer} label="Nhiệt độ" value={`${currentSensor.temperature}°C`} />
              </>
            )}
          </div>

          {saveMessage ? (
            <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
              {saveMessage}
            </p>
          ) : null}
        </form>

        <div className="rounded-card border border-slate-100 bg-white/88 p-6 shadow-card">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-black text-slate-950">Ngưỡng cảm biến</h3>
            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 text-sm font-black text-emerald-700 transition hover:bg-emerald-100"
              >
                <Pencil size={16} aria-hidden="true" />
                Chỉnh ngưỡng
              </button>
            ) : null}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Object.entries(editing ? form.thresholds : activePlant.thresholds).map(([key, value]) => (
              editing ? (
                <Field key={key} label={thresholdLabel(key)}>
                  <input
                    type="number"
                    value={value}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        thresholds: { ...form.thresholds, [key]: event.target.value },
                      })
                    }
                    className={inputControlClass}
                  />
                </Field>
              ) : (
                <div key={key} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-sm font-semibold text-slate-500">{thresholdLabel(key)}</span>
                  <span className="font-black text-slate-900">{value}</span>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="rounded-card border border-slate-100 bg-white/88 p-6 shadow-card">
          <h3 className="text-xl font-black text-slate-950">Lịch sử thay đổi sensor</h3>
          <SensorChart data={sensorHistory} mode="large" />
        </div>

        <div className="rounded-card border border-slate-100 bg-white/88 p-6 shadow-card">
          <h3 className="mb-4 text-xl font-black text-slate-950">Lịch chăm sóc của cây</h3>
          <div className="grid gap-3">
            {reminders.slice(0, 3).map((reminder) => (
              <ReminderCard key={reminder.id} reminder={reminder} compact />
            ))}
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <DeviceCard device={device} onPumpToggle={onPumpToggle} busy={pumpBusy} />
      </aside>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm font-black text-slate-700">
      {label}
      {children}
    </label>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-emerald-50 p-4">
      <Icon size={20} className="text-emerald-600" aria-hidden="true" />
      <p className="mt-3 text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}

function thresholdLabel(key) {
  const labels = {
    soilMoistureMin: 'Độ ẩm đất tối thiểu',
    soilMoistureMax: 'Độ ẩm đất tối đa',
    tempMin: 'Nhiệt độ tối thiểu',
    tempMax: 'Nhiệt độ tối đa',
    airHumidityMin: 'Độ ẩm không khí tối thiểu',
    airHumidityMax: 'Độ ẩm không khí tối đa',
    lightMin: 'Ánh sáng tối thiểu',
    lightMax: 'Ánh sáng tối đa',
  };
  return labels[key] || key;
}

export default PlantDetail;
