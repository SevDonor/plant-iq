import { ArrowRight, ShieldCheck } from 'lucide-react';
import PlantArtwork from './PlantArtwork';

function PlantStatusCard({ plant, onDetail }) {
  return (
    <article className="relative overflow-hidden rounded-card border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-yellow-50 p-6 shadow-card 3xl:p-7">
      <div className="relative z-10 grid min-h-[250px] gap-6 md:grid-cols-[minmax(280px,0.9fr)_1fr]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-900">{plant.name}</h2>
              <p className="mt-1 text-sm font-semibold text-emerald-600">{plant.scientificName}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-emerald-700 shadow-soft">
              <ShieldCheck size={15} aria-hidden="true" />
              Cây đang khỏe
            </span>
          </div>

          <PlantIllustration />
        </div>

        <div className="grid content-center gap-5">
          <dl className="grid gap-3 text-sm 3xl:gap-4">
            <Info label="Tuổi cây" value={`${plant.ageMonth} tháng`} />
            <Info label="Ngày trồng" value={plant.plantedDate} />
            <Info label="Giai đoạn" value={plant.stage} highlight />
          </dl>
          <button
            type="button"
            onClick={onDetail}
            aria-label={`Xem chi tiết ${plant.name} đang theo dõi`}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl bg-white px-5 text-sm font-black text-emerald-700 shadow-soft transition hover:bg-emerald-50"
          >
            Xem chi tiết
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

function Info({ label, value, highlight }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-4 rounded-2xl bg-white/55 px-4 py-2">
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className={`font-black ${highlight ? 'text-emerald-700' : 'text-slate-800'}`}>{value}</dd>
    </div>
  );
}

function PlantIllustration() {
  return (
    <div className="mt-2 flex h-44 items-end justify-center 3xl:h-52" aria-hidden="true">
      <PlantArtwork variant="hero" className="h-full max-w-full drop-shadow-[0_18px_28px_rgba(21,128,61,0.16)]" />
    </div>
  );
}

export default PlantStatusCard;
