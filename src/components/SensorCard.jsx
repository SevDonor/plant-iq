import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

const colorMap = {
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    line: '#f97316',
  },
  blue: {
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    line: '#3b82f6',
  },
  green: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    line: '#22c55e',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-500',
    line: '#eab308',
  },
  violet: {
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    line: '#8b5cf6',
  },
};

function SensorCard({ title, value, unit, status = 'Tốt', icon: Icon, accent = 'green', trend = [], compact = false }) {
  const [canRenderChart, setCanRenderChart] = useState(!compact);
  const colors = colorMap[accent] ?? colorMap.green;
  const articleClass = compact
    ? 'min-h-[136px] rounded-card border border-slate-100 bg-white/90 p-4 shadow-card sm:min-h-[168px] sm:p-5 3xl:min-h-[188px]'
    : 'min-h-[168px] rounded-card border border-slate-100 bg-white/90 p-5 shadow-card 3xl:min-h-[188px]';
  const iconClass = compact
    ? `flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12 3xl:h-14 3xl:w-14 ${colors.bg}`
    : `flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl 3xl:h-14 3xl:w-14 ${colors.bg}`;
  const chartClass = compact
    ? 'mt-4 h-10 3xl:mt-5 3xl:h-12'
    : 'mt-4 h-10 3xl:mt-5 3xl:h-12';

  useEffect(() => {
    if (!compact) {
      setCanRenderChart(true);
      return undefined;
    }

    const mediaQuery = window.matchMedia('(min-width: 640px)');
    const updateChartVisibility = () => setCanRenderChart(mediaQuery.matches);
    updateChartVisibility();
    mediaQuery.addEventListener('change', updateChartVisibility);
    return () => mediaQuery.removeEventListener('change', updateChartVisibility);
  }, [compact]);

  return (
    <article className={articleClass}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className={iconClass}>
          <Icon size={compact ? 21 : 24} className={colors.text} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl 3xl:text-4xl">
            {value}
            <span className="ml-1 text-sm font-bold text-slate-500 sm:text-base">{unit}</span>
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-500">{title}</p>
          <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
            {status}
          </span>
        </div>
      </div>
      {canRenderChart ? (
        <div className={chartClass} aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={colors.line}
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </article>
  );
}

export default SensorCard;
