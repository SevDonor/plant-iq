import { BellRing, CalendarClock, CheckCircle2, Droplets, Leaf, Sprout, Trash2 } from 'lucide-react';

const iconMap = {
  watering: Droplets,
  fertilizing: Leaf,
  'leaf-check': BellRing,
  'soil-change': Sprout,
};

function ReminderCard({ reminder, onToggle, onComplete, onDelete, compact = false }) {
  const Icon = iconMap[reminder.type] ?? CalendarClock;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white/82 p-4 shadow-soft sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
          <Icon size={24} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="font-black text-slate-900">{reminder.title}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">{reminder.schedule}</p>
          {!compact ? <p className="mt-1 text-xs text-slate-500">{reminder.note}</p> : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
          {reminder.dueLabel || reminder.nextRun}
        </span>
        {onToggle ? (
          <button
            type="button"
            onClick={() => onToggle(reminder)}
            aria-label={`${reminder.enabled ? 'Tắt' : 'Bật'} ${reminder.title}`}
            className={`min-h-10 rounded-full px-3 text-xs font-black transition ${
              reminder.enabled
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {reminder.enabled ? 'Đang bật' : 'Đã tắt'}
          </button>
        ) : null}
        {onComplete ? (
          <button
            type="button"
            onClick={() => onComplete(reminder)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-600 shadow-soft transition hover:bg-emerald-50"
            aria-label={`Đổi trạng thái ${reminder.title}`}
          >
            <CheckCircle2 size={18} aria-hidden="true" />
          </button>
        ) : null}
        {onDelete ? (
          <button
            type="button"
            onClick={() => onDelete(reminder)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-rose-500 shadow-soft transition hover:bg-rose-50"
            aria-label={`Xóa ${reminder.title}`}
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </article>
  );
}

export default ReminderCard;
