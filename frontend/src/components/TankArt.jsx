import { useId } from 'react';

// tank drawing, scene can be planted, small or shrimp
// colors come from the tank tone in styles.css

// one plant, x is where it goes and h is how tall
function Plant({ x, h }) {
  const top = 100 - h;
  return (
    <g>
      <line x1={x} y1={100} x2={x} y2={top} stroke="var(--plant)" strokeWidth="2.5" />
      <ellipse cx={x - 6} cy={top + h * 0.55} rx="6" ry="3" fill="var(--plant)" />
      <ellipse cx={x + 6} cy={top + h * 0.3} rx="6" ry="3" fill="var(--plant)" />
      <ellipse cx={x - 5} cy={top + 4} rx="5" ry="3" fill="var(--plant)" />
    </g>
  );
}

// whats inside each type of tank
const SCENES = {
  planted: (
    <>
      <Plant x={34} h={28} />
      <Plant x={56} h={34} />
      <Plant x={92} h={46} />
      <ellipse cx="165" cy="94" rx="28" ry="10" fill="var(--rock)" />
      <ellipse cx="200" cy="96" rx="16" ry="7" fill="var(--rock)" />
      <Plant x={248} h={28} />
      <Plant x={284} h={36} />
    </>
  ),
  small: (
    <>
      <Plant x={110} h={24} />
      <ellipse cx="160" cy="96" rx="18" ry="8" fill="var(--rock)" />
      <Plant x={210} h={36} />
    </>
  ),
  shrimp: (
    <>
      <Plant x={34} h={18} />
      <Plant x={70} h={24} />
      <Plant x={104} h={32} />
      <rect x="100" y="90" width="132" height="12" rx="6" fill="var(--plant)" />
      <Plant x={200} h={22} />
      <Plant x={250} h={32} />
      <Plant x={286} h={16} />
    </>
  ),
};

export default function TankArt({ scene = 'planted', className = 'tank-art' }) {
  // unique id so each tank drawing gets its own water fade
  const gradientId = `water-${useId()}`;
  return (
    <svg className={className} viewBox="0 0 330 120" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--water-top)" />
          <stop offset="1" stopColor="var(--water)" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="326" height="116" rx="4" fill="#fff" />
      <rect x="6" y="6" width="318" height="108" rx="2" fill={`url(#${gradientId})`} />
      <line x1="6" y1="10" x2="324" y2="10" stroke="var(--primary)" strokeOpacity="0.5" strokeWidth="2" />
      {SCENES[scene] ?? SCENES.planted}
      <rect x="6" y="100" width="318" height="14" fill="var(--sand)" />
    </svg>
  );
}
