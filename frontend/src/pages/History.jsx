import { getHistory, getTanks, resetDemoData } from '../api.js';
import TankTag from '../components/TankTag.jsx';
import { useData } from '../useData.js';
import { formatDate } from '../utils.js';

// turns a date into something like November 2026
function monthLabel(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}

// all finished tasks, newest first
export default function History() {
  const tanks = useData(getTanks);
  const history = useData(getHistory);
  if (!tanks || !history) return null;

  const tankById = (id) => tanks.find((t) => t.id === id);

  // groups the history by month
  const groups = [];
  for (const entry of history) {
    const month = monthLabel(entry.completed);
    const last = groups[groups.length - 1];
    if (last && last.month === month) last.items.push(entry);
    else groups.push({ month, items: [entry] });
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">History</h1>
          <p className="page-sub">Care you’ve already completed, newest first.</p>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="card empty">
          Nothing completed yet. When you mark a task complete, it will appear here.
        </div>
      ) : (
        groups.map((g) => (
          <div className="history-group" key={g.month}>
            <h2 className="history-month">{g.month}</h2>
            <ul className="list card">
              {g.items.map((h) => (
                <li className="list-row no-check" key={h.id}>
                  <span className="task-name">{h.name}</span>
                  <span className="task-tank muted small">
                    <TankTag tank={tankById(h.tankId)} />
                  </span>
                  <span className="task-when">
                    <span className="muted">{formatDate(h.completed)}</span>
                    <span className="done-mark">✓ Done</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      {/* puts the fake data back to how it started, good before demos */}
      <button className="reset" onClick={resetDemoData}>
        Reset sample data
      </button>
    </>
  );
}
