import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const styles = {
  good: {
    icon: CheckCircle2,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  danger: {
    icon: AlertTriangle,
    className: 'bg-rose-50 text-rose-700 border-rose-100',
  },
  info: {
    icon: Info,
    className: 'bg-sky-50 text-sky-700 border-sky-100',
  },
};

function AlertCard({ alert }) {
  const config = styles[alert.level] ?? styles.info;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-3 rounded-2xl border p-4 ${config.className}`}>
      <Icon size={20} aria-hidden="true" />
      <p className="text-sm font-bold">{alert.title}</p>
    </div>
  );
}

export default AlertCard;
