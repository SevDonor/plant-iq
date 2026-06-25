import { useState } from 'react';
import { Plus } from 'lucide-react';
import ReminderCard from '../components/ReminderCard';

const reminderTypes = [
  { value: 'watering', label: 'Tưới nước' },
  { value: 'fertilizing', label: 'Bón phân' },
  { value: 'leaf-check', label: 'Kiểm tra lá' },
  { value: 'soil-change', label: 'Thay đất' },
];

function Care({ reminders, onCreateReminder, onUpdateReminder, onDeleteReminder, actionBusy }) {
  const [form, setForm] = useState({
    title: 'Tưới nước',
    type: 'watering',
    schedule: 'Mỗi ngày 07:00',
    note: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onCreateReminder({
      ...form,
      nextRun: 'Sắp tới',
      dueLabel: 'Mới tạo',
      enabled: true,
    });
    setForm({ title: '', type: 'watering', schedule: '', note: '' });
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <form onSubmit={handleSubmit} className="rounded-card border border-emerald-100 bg-white/88 p-6 shadow-card">
        <h2 className="text-2xl font-black text-slate-950">Tạo reminder mới</h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">Thiết lập lịch chăm sóc cây theo nhu cầu.</p>

        <div className="mt-6 grid gap-4">
          <Field label="Tên reminder">
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 font-semibold outline-none focus:border-emerald-400"
              required
            />
          </Field>
          <Field label="Loại reminder">
            <select
              value={form.type}
              onChange={(event) => setForm({ ...form, type: event.target.value })}
              className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 font-semibold outline-none focus:border-emerald-400"
            >
              {reminderTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Lịch">
            <input
              value={form.schedule}
              onChange={(event) => setForm({ ...form, schedule: event.target.value })}
              className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 font-semibold outline-none focus:border-emerald-400"
              required
            />
          </Field>
          <Field label="Ghi chú">
            <textarea
              value={form.note}
              onChange={(event) => setForm({ ...form, note: event.target.value })}
              className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-emerald-400"
            />
          </Field>
          <button
            type="submit"
            disabled={actionBusy}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 font-black text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            <Plus size={18} aria-hidden="true" />
            {actionBusy ? 'Đang lưu...' : 'Tạo reminder'}
          </button>
        </div>
      </form>

      <div className="rounded-card border border-slate-100 bg-white/86 p-6 shadow-card">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Danh sách reminder</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">Bật/tắt và đánh dấu hoàn thành các lịch chăm sóc.</p>
          </div>
        </div>

        {reminders.length ? (
          <div className="grid gap-3">
            {reminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onToggle={(item) => onUpdateReminder(item.id, { enabled: !item.enabled })}
                onComplete={(item) => onUpdateReminder(item.id, { completed: !item.completed })}
                onDelete={(item) => onDeleteReminder(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-dashed border-emerald-200 bg-white/70 p-8 text-center">
            <h3 className="text-xl font-black text-slate-900">Chưa có reminder</h3>
            <p className="mt-2 text-sm font-semibold text-slate-500">Tạo reminder đầu tiên để không quên chăm cây.</p>
          </div>
        )}
      </div>
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

export default Care;
