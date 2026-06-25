import { Bell, ChartNoAxesCombined, Home, Leaf, Sprout } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Trang chủ', icon: Home },
  { id: 'plants', label: 'Cây', icon: Sprout },
  { id: 'care', label: 'Chăm sóc', icon: Leaf },
  { id: 'alerts', label: 'Cảnh báo', icon: Bell },
  { id: 'statistics', label: 'Số liệu', icon: ChartNoAxesCombined },
];

function BottomNav({ activePage, onNavigate }) {
  return (
    <nav
      aria-label="Điều hướng mobile"
      className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-[24px] border border-emerald-100 bg-white/92 p-2 shadow-card backdrop-blur xl:hidden"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = activePage === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-bold transition ${
              active ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:text-emerald-700'
            }`}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={20} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
