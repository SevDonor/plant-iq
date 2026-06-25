import { useEffect, useMemo, useState } from 'react';
import { Bell, CloudSun, LogOut, RefreshCw } from 'lucide-react';

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
});

function Topbar({ weather, onRefresh, refreshing, notificationsOpen, onToggleNotifications, user, onSignOut }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = globalThis.setInterval(() => setNow(new Date()), 60_000);
    return () => globalThis.clearInterval(timer);
  }, []);

  const todayLabel = useMemo(() => {
    const date = dateFormatter.format(now);
    const time = timeFormatter.format(now);
    return `Hôm nay là ngày ${date} · ${time}`;
  }, [now]);

  return (
    <header className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between 3xl:mb-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          Xin chào, {user?.name || 'bạn'}!
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">{todayLabel}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-h-14 items-center gap-3 rounded-2xl border border-sky-100 bg-white/86 px-4 shadow-soft">
          <CloudSun size={26} className="text-amber-400" aria-hidden="true" />
          <div>
            <p className="text-base font-black text-slate-900">{weather?.temperature ?? 29}°C</p>
            <p className="text-xs font-semibold text-sky-700">TP.HCM</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleNotifications}
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-100 bg-white text-slate-600 shadow-soft transition hover:text-emerald-700"
          aria-label="Xem thông báo"
          aria-expanded={notificationsOpen}
          aria-controls="notification-panel"
        >
          <Bell size={21} aria-hidden="true" />
          <span className="absolute right-3 top-3 rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
            2
          </span>
        </button>
        <button
          type="button"
          onClick={onRefresh}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-600 shadow-soft transition hover:bg-emerald-50"
          aria-label="Làm mới dữ liệu"
        >
          <RefreshCw size={21} className={refreshing ? 'animate-spin' : ''} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-100 bg-white text-slate-500 shadow-soft transition hover:bg-rose-50 hover:text-rose-600"
          aria-label="Đăng xuất"
        >
          <LogOut size={21} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
