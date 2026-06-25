import {
  Bell,
  ChartNoAxesCombined,
  Home,
  Leaf,
  LogOut,
  Settings,
  ShieldCheck,
  Sprout,
} from 'lucide-react';
import PlantArtwork from './PlantArtwork';

const navItems = [
  { id: 'dashboard', label: 'Trang chủ', icon: Home },
  { id: 'plants', label: 'Danh sách cây', icon: Sprout },
  { id: 'care', label: 'Chăm sóc', icon: Leaf },
  { id: 'statistics', label: 'Thống kê', icon: ChartNoAxesCombined },
  { id: 'settings', label: 'Cài đặt', icon: Settings },
  { id: 'alerts', label: 'Cảnh báo', icon: Bell, badge: true },
];

function Sidebar({ activePage, onNavigate, user, onSignOut, alertCount = 0 }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col border-r border-emerald-100/80 bg-white/78 px-5 py-7 shadow-soft backdrop-blur xl:flex 2xl:w-[300px]">
      <div className="mb-12 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-soft">
          <Leaf size={28} aria-hidden="true" />
        </div>
        <div>
          <p className="text-2xl font-extrabold tracking-tight text-emerald-700">Plant-IQ</p>
          <p className="text-sm font-medium text-slate-500">My Smart Garden</p>
        </div>
      </div>

      <nav aria-label="Điều hướng chính" className="space-y-2.5 3xl:space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;
          const activeClass = item.id === 'alerts'
            ? 'bg-rose-50 text-rose-600 shadow-soft'
            : 'bg-emerald-100 text-emerald-700 shadow-soft';

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex min-h-14 w-full items-center gap-4 rounded-2xl px-5 text-left text-base font-semibold transition ${
                active ? activeClass : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={21} aria-hidden="true" />
              <span className="flex-1">{item.label}</span>
              {item.badge && alertCount > 0 ? (
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
                  {alertCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto overflow-hidden rounded-card border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-yellow-50 p-4 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-soft ring-1 ring-emerald-100">
            <PlantArtwork variant="badge" className="h-14 w-14" />
          </div>
          <p className="text-sm font-bold text-slate-800">Cây của bạn đang phát triển tốt!</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('plants')}
          aria-label="Xem danh sách cây từ thẻ gợi ý"
          className="mt-4 min-h-11 rounded-2xl bg-white px-5 text-sm font-bold text-emerald-700 shadow-soft transition hover:bg-emerald-50"
        >
          Xem chi tiết
        </button>
      </div>

      <div className="mt-7 border-t border-emerald-100 pt-7">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-100 p-3 text-emerald-700">
            <ShieldCheck size={22} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-slate-900">{user?.name || 'Người dùng'}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-soft transition hover:bg-rose-50 hover:text-rose-600"
            aria-label="Đăng xuất"
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
