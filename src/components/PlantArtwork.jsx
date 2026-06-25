function PlantArtwork({ variant = 'hero', className = '' }) {
  const isBadge = variant === 'badge';
  const viewBox = isBadge ? '0 0 96 96' : '0 0 260 220';

  return (
    <svg
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label={isBadge ? 'Biểu tượng cây khỏe' : 'Minh họa cây trong chậu'}
    >
      <defs>
        <linearGradient id={`pot-${variant}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#dbeafe" />
        </linearGradient>
        <linearGradient id={`leaf-${variant}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="55%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id={`leafDark-${variant}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
        <radialGradient id={`glow-${variant}`} cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.74" />
          <stop offset="62%" stopColor="#dcfce7" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={`softShadow-${variant}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="12" stdDeviation="9" floodColor="#14532d" floodOpacity="0.18" />
        </filter>
      </defs>

      {isBadge ? <BadgePlant variant={variant} /> : <HeroPlant variant={variant} />}
    </svg>
  );
}

function HeroPlant({ variant }) {
  return (
    <>
      <circle cx="130" cy="102" r="94" fill={`url(#glow-${variant})`} />
      <ellipse cx="130" cy="190" rx="80" ry="14" fill="#bbf7d0" opacity="0.42" />

      <g filter={`url(#softShadow-${variant})`}>
        <path
          d="M88 124h84l-10 60c-1.5 9-9.5 16-18.7 16h-26.6c-9.2 0-17.2-7-18.7-16z"
          fill={`url(#pot-${variant})`}
          stroke="#dbe7df"
          strokeWidth="2"
        />
        <path d="M82 117c0-10 8-18 18-18h60c10 0 18 8 18 18v8H82z" fill="#ffffff" />
        <path d="M104 202v16M156 202v16" stroke="#b98b56" strokeWidth="9" strokeLinecap="round" />
      </g>

      <g stroke="#16713a" strokeLinecap="round" strokeWidth="5">
        <path d="M130 136V72" />
        <path d="M130 134 78 94" />
        <path d="M132 134l58-42" />
        <path d="M129 137 69 143" />
        <path d="M132 137l62 17" />
        <path d="M130 133 109 58" />
      </g>

      <g>
        <path d="M126 126C96 111 76 84 69 51c38 0 64 27 57 75Z" fill={`url(#leaf-${variant})`} />
        <path d="M134 126c7-48 34-76 78-75-8 35-34 62-78 75Z" fill={`url(#leaf-${variant})`} />
        <path d="M126 121C96 78 102 37 136 12c22 42 18 77-10 109Z" fill={`url(#leafDark-${variant})`} />
        <path d="M120 138C82 130 49 140 27 169c43 13 76 4 93-31Z" fill="#65d452" />
        <path d="M139 139c38-22 77-16 103 15-45 15-79 9-103-15Z" fill="#43b844" />
        <path d="M122 131c-35-30-72-32-102-7 38 28 74 29 102 7Z" fill="#58c746" />
      </g>

      <circle cx="130" cy="136" r="19" fill="#2f9e44" />
      <circle cx="124" cy="128" r="7" fill="#86efac" opacity="0.45" />
    </>
  );
}

function BadgePlant({ variant }) {
  return (
    <>
      <circle cx="48" cy="48" r="44" fill={`url(#glow-${variant})`} />
      <ellipse cx="48" cy="78" rx="28" ry="6" fill="#bbf7d0" opacity="0.55" />
      <path d="M35 48h26l-4 28H39z" fill={`url(#pot-${variant})`} stroke="#dbe7df" strokeWidth="1.5" />
      <path d="M32 45c0-5 4-9 9-9h14c5 0 9 4 9 9v4H32z" fill="#ffffff" />
      <path d="M48 48V22M48 49 30 34M49 49l19-15M48 50 31 58M49 50l18 8" stroke="#16713a" strokeWidth="3" strokeLinecap="round" />
      <path d="M46 45C32 39 24 27 22 12c18 0 30 12 24 33Z" fill={`url(#leaf-${variant})`} />
      <path d="M50 45c4-22 17-34 36-33-3 16-15 29-36 33Z" fill={`url(#leaf-${variant})`} />
      <path d="M46 43C34 24 38 9 52 1c9 18 7 32-6 42Z" fill={`url(#leafDark-${variant})`} />
      <path d="M43 51C26 48 13 53 5 66c19 5 32 1 38-15Z" fill="#65d452" />
      <path d="M53 51c16-10 30-7 38 5-18 7-31 5-38-5Z" fill="#43b844" />
      <circle cx="48" cy="50" r="8" fill="#2f9e44" />
    </>
  );
}

export default PlantArtwork;
