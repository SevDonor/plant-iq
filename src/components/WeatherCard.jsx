import { CloudSun, Droplets, Eye, MapPin, SunMedium, Wind } from 'lucide-react';

function WeatherCard({ weather }) {
  return (
    <article className="flex min-h-[250px] flex-col rounded-card border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-6 shadow-card 3xl:p-7">
      <div className="mb-5 flex items-center gap-2 text-sm font-bold text-blue-600">
        <MapPin size={18} aria-hidden="true" />
        <span>{weather.location}</span>
      </div>

      <div className="grid flex-1 items-center gap-6 lg:grid-cols-[minmax(260px,0.95fr)_1fr]">
        <div className="flex items-center justify-center gap-5 lg:justify-start">
          <CloudSun size={76} className="shrink-0 text-amber-400 3xl:h-24 3xl:w-24" aria-hidden="true" />
          <div>
            <p className="text-5xl font-black tracking-tight text-blue-600 3xl:text-6xl">
              {weather.temperature}
              <span className="text-2xl">°C</span>
            </p>
            <p className="mt-3 text-base font-black text-blue-600 3xl:text-lg">{weather.condition}</p>
            <p className="mt-1 text-sm font-semibold text-blue-500">
              Cảm giác như {weather.feelsLike}°C
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm 3xl:gap-4">
          <Metric icon={Droplets} label="Độ ẩm KK" value={`${weather.humidity}%`} />
          <Metric icon={Wind} label="Gió" value={`${weather.wind} km/h`} />
          <Metric icon={Eye} label="Tầm nhìn" value={`${weather.visibility} km`} />
          <Metric icon={SunMedium} label="UV" value={`${weather.uv} - ${weather.uvLabel}`} />
        </dl>
      </div>

      <div className="mt-5 border-t border-blue-100 pt-4 text-sm font-semibold text-slate-600">
        {weather.tip}
      </div>
    </article>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="flex min-h-14 items-center gap-3 rounded-2xl bg-white/62 px-3 py-2">
      <Icon size={18} className="shrink-0 text-blue-500" aria-hidden="true" />
      <div>
        <dt className="text-slate-500">{label}</dt>
        <dd className="font-black text-slate-900">{value}</dd>
      </div>
    </div>
  );
}

export default WeatherCard;
