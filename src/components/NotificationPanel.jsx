import { X } from 'lucide-react';
import AlertCard from './AlertCard';

function NotificationPanel({ alerts, activity, onClose }) {
  return (
    <section
      id="notification-panel"
      role="dialog"
      aria-label="Thông báo Plant-IQ"
      className="absolute right-0 top-[72px] z-40 w-[min(560px,calc(100vw-32px))] rounded-card border border-emerald-100 bg-white p-5 shadow-[0_18px_42px_rgba(15,74,40,0.12)]"
      style={{ boxShadow: '0 18px 42px rgba(15, 74, 40, 0.12)' }}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-950">Thông báo</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Cảnh báo cảm biến và hoạt động mới nhất.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
          aria-label="Đóng thông báo"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="grid max-h-[min(520px,calc(100vh-150px))] gap-3 overflow-y-auto pr-1">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
        {activity.slice(0, 4).map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 ring-1 ring-slate-100">
              {item.time}
            </span>
            <span className="text-sm font-semibold text-slate-700">{item.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default NotificationPanel;
