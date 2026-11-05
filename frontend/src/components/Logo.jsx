// fish logo drawn with svg shapes (tail, body, fin, eye, bubble)
export default function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className="logo">
      <path d="M33 24 L44 15 Q41 24 44 33 Z" fill="var(--logo-tail)" />
      <path d="M4 24 C9 13 22 10 33 24 C22 38 9 35 4 24 Z" fill="var(--brand)" />
      <path d="M15 18 Q19 12 25 15" fill="none" stroke="var(--logo-tail)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="12" cy="23" r="2.4" fill="#fff" />
      <circle cx="6" cy="10" r="2.2" fill="none" stroke="var(--logo-tail)" strokeWidth="1.6" />
    </svg>
  );
}
