interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className, width = 360, height = 80 }: LogoProps) {
  return (
    <svg
      viewBox="0 0 360 80"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      overflow="visible"
      className={className}
    >
      <defs>
        <pattern id="logo-grid" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.4" />
        </pattern>
        <clipPath id="logo-clip">
          <rect x="0" y="0" width="76" height="76" rx="16" />
        </clipPath>
        <linearGradient id="logo-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="logo-tg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      {/* خلفية المربع */}
      <rect x="0" y="0" width="76" height="76" rx="16" fill="#080c14" />

      {/* شبكة خطوط خفيفة */}
      <rect
        x="0" y="0" width="76" height="76" rx="16"
        fill="url(#logo-grid)"
        opacity="0.12"
        clipPath="url(#logo-clip)"
      />

      {/* توهج خلف البيضاوي */}
      <ellipse cx="38" cy="38" rx="26" ry="16" transform="rotate(-15, 38, 38)" fill="url(#logo-g)" opacity="0.08" />

      {/* البيضاوي المائل — حد بتدرج */}
      <ellipse cx="38" cy="38" rx="22" ry="13" transform="rotate(-15, 38, 38)" fill="#080c14" />
      <ellipse cx="38" cy="38" rx="22" ry="13" transform="rotate(-15, 38, 38)" fill="none" stroke="url(#logo-g)" strokeWidth="1.8" />

      {/* زر التشغيل ▶ */}
      <path d="M34 31 L34 45 L46 38 Z" fill="url(#logo-g)" />

      {/* النص */}
      <text x="90" y="44" fontFamily="sans-serif" fontWeight="700" fontSize="30" letterSpacing="-0.5">
        <tspan fill="#ffffff">Agents</tspan>
        <tspan fill="url(#logo-tg)">Nerator</tspan>
      </text>

      {/* TRADE · OWN · DEPLOY */}
      <text
        x="91" y="63"
        fontFamily="sans-serif"
        fontSize="8.5"
        fill="#6b7280"
        textLength="242"
        lengthAdjust="spacing"
      >
        TRADE · OWN · DEPLOY
      </text>
    </svg>
  );
}
