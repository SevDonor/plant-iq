import { ArrowRight, Lightbulb, Pencil, Thermometer, Trash2, Waves } from 'lucide-react';

const statusClass = {
  good: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
};

function PlantListCard({ plant, onDetail, onEdit, onDelete }) {
  return (
    <article className="rounded-card border border-emerald-100 bg-white/88 p-5 shadow-card">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-black text-slate-900">{plant.name}</h3>
          <p className="mt-1 truncate text-sm font-semibold text-slate-500">{plant.scientificName}</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${statusClass[plant.status] || statusClass.good}`}>
          {plant.statusText || 'Tốt'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <Metric icon={Waves} label="Độ ẩm đất" value={`${plant.soilMoisture}%`} />
        <Metric icon={Thermometer} label="Nhiệt độ" value={`${plant.temperature}°C`} />
        <Metric icon={Lightbulb} label="Ánh sáng" value={`${plant.light} lx`} />
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <button
          type="button"
          onClick={() => onDetail(plant.id)}
          aria-label={`Xem chi tiết ${plant.name}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-black text-white transition hover:bg-emerald-700"
        >
          Xem chi tiết
          <ArrowRight size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onEdit(plant)}
          aria-label={`Sửa ${plant.name}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 text-sm font-black text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
        >
          <Pencil size={17} aria-hidden="true" />
          Sửa
        </button>
        <button
          type="button"
          onClick={() => onDelete(plant)}
          aria-label={`Xóa ${plant.name}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 text-sm font-black text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
        >
          <Trash2 size={17} aria-hidden="true" />
          Xóa
        </button>
      </div>
    </article>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <Icon size={17} className="text-emerald-600" aria-hidden="true" />
      <p className="mt-2 text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 font-black text-slate-900">{value}</p>
    </div>
  );
}

export default PlantListCard;
