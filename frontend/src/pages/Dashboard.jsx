import { Link } from 'react-router-dom';
import { getTanks, getTasks } from '../api.js';
import TankCard from '../components/TankCard.jsx';
import TaskRow from '../components/TaskRow.jsx';
import { useData } from '../useData.js';
import { dueLabel, todayISO } from '../utils.js';

// home page, shows whats due today and all your tanks
export default function Dashboard() {
  const tanks = useData(getTanks);
  const tasks = useData(getTasks);
  // dont show anything until the data loads
  if (!tanks || !tasks) return null;

  const today = todayISO();
  // finds a tank using its id
  const tankById = (id) => tanks.find((t) => t.id === id);
  // first task for a tank (tasks are already sorted by date)
  const nextTaskFor = (tankId) => tasks.find((t) => t.tankId === tankId);

  // due today or overdue
  const dueNow = tasks.filter((t) => t.due <= today);
  // the next task after today
  const nextUp = tasks.find((t) => t.due > today);

  return (
    <>
      {/* title and buttons at the top */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, Jane</h1>
          <p className="page-sub">Here’s what needs attention across your aquariums today.</p>
        </div>
        <div className="actions">
          <Link to="/tanks/new" className="btn">
            Add Tank
          </Link>
          <Link to="/tasks/new" className="btn btn-primary">
            Create Task
          </Link>
        </div>
      </div>

      {/* todays tasks with checkboxes */}
      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Today’s care</h2>
          <Link to="/tasks" className="text-link">
            View all tasks →
          </Link>
        </div>
        <div className="card">
          {dueNow.length === 0 ? (
            <p className="empty">All caught up. Nothing is due today.</p>
          ) : (
            <ul className="list">
              {dueNow.map((t) => (
                <TaskRow key={t.id} task={t} tank={tankById(t.tankId)} />
              ))}
            </ul>
          )}
        </div>
        {nextUp && (
          <p className="muted small" style={{ marginTop: 12 }}>
            Next up: {nextUp.name.toLowerCase()} on {dueLabel(nextUp.due)}
          </p>
        )}
      </section>

      {/* one card per tank */}
      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Your aquariums</h2>
          <Link to="/tanks" className="text-link">
            View My Tanks →
          </Link>
        </div>
        <div className="tank-grid">
          {tanks.map((tank) => (
            <TankCard key={tank.id} tank={tank} nextTask={nextTaskFor(tank.id)} />
          ))}
        </div>
      </section>
    </>
  );
}
