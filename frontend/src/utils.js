// local date as yyyy-mm-dd
export function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// todays date
export function todayISO() {
  return toISODate(new Date());
}

// adds days to a date
export function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

// 2026-11-05 -> 5 Nov 2026
export function formatDate(iso, { year = true } = {}) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(year ? { year: 'numeric' } : {}),
  });
}

// says today, tomorrow, overdue or the date
export function dueLabel(iso) {
  const today = todayISO();
  if (iso < today) return 'Overdue';
  if (iso === today) return 'Today';
  if (iso === addDays(today, 1)) return 'Tomorrow';
  return formatDate(iso, { year: false });
}

// makes the 14 fish · 3 plant species line
export function livestockSummary(tank) {
  const animals = tank.fish.reduce((n, f) => n + f.count, 0);
  const unit = tank.fish.length > 0 && tank.fish.every((f) => f.unit === 'shrimp') ? 'shrimp' : 'fish';
  return `${animals} ${unit} · ${tank.plants.length} plant species`;
}
