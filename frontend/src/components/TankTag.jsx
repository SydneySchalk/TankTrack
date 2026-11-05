// tank name with a colored dot so you can tell tanks apart
export default function TankTag({ tank, className = '' }) {
  if (!tank) return null;
  return (
    <span className={`tank-tag tone-${tank.tone ?? 'sage'} ${className}`}>
      <span className="tank-dot" aria-hidden="true" />
      {tank.name}
    </span>
  );
}
