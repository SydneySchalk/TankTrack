import { Link } from 'react-router-dom';
import { completeTask, getTanks, getTasks } from '../api.js';
import TankTag from '../components/TankTag.jsx';
import { StatusPill } from '../components/TaskRow.jsx';
import { useData } from '../useData.js';
import { formatDate, todayISO } from '../utils.js';

// one task box, due ones get mark complete and upcoming ones get edit
function TaskCard({ task, tank, canComplete }) {
  return (
    <div className="task-card">
      <div className="task-card-top">
        <span className="task-name">{task.name}</span>
        <span className="pill">{task.repeat}</span>
      </div>
      <div className="task-card-meta">
        <div>
          <div className="fact-label">Tank</div>
          <div>
            <TankTag tank={tank} />
          </div>
        </div>
        <div>
          <div className="fact-label">Due</div>
          <div>{formatDate(task.due)}</div>
        </div>
      </div>
      <div className="task-card-foot">
        <StatusPill due={task.due} />
        {canComplete ? (
          <button className="btn btn-primary btn-small" onClick={() => completeTask(task.id)}>
            Mark complete
          </button>
        ) : (
          <Link to={`/tasks/${task.id}/edit`} className="btn btn-small">
            Edit task
          </Link>
        )}
      </div>
    </div>
  );
}

// a column of task cards with a count at the top
function Column({ title, tasks, tankById, canComplete, empty }) {
  return (
    <section className="card card-pad">
      <div className="panel-head" style={{ marginBottom: 16 }}>
        <h2 className="section-title">{title}</h2>
        <span className="pill">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>
      {tasks.length === 0 ? (
        <p className="muted small">{empty}</p>
      ) : (
        tasks.map((t) => (
          <TaskCard key={t.id} task={t} tank={tankById(t.tankId)} canComplete={canComplete} />
        ))
      )}
    </section>
  );
}

// tasks page, split into due today and upcoming
export default function Tasks() {
  const tanks = useData(getTanks);
  const tasks = useData(getTasks);
  if (!tanks || !tasks) return null;

  const today = todayISO();
  const tankById = (id) => tanks.find((t) => t.id === id);
  // splits tasks into due (today or late) and upcoming
  const due = tasks.filter((t) => t.due <= today);
  const upcoming = tasks.filter((t) => t.due > today);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-sub">Plan care for each aquarium and tick it off when it’s done.</p>
        </div>
        <div className="actions">
          <Link to="/history" className="btn">
            View history
          </Link>
          <Link to="/tasks/new" className="btn btn-primary">
            Create task
          </Link>
        </div>
      </div>

      <div className="task-columns">
        <Column
          title="Due today"
          tasks={due}
          tankById={tankById}
          canComplete
          empty="All caught up. Nothing is due today."
        />
        <Column
          title="Upcoming"
          tasks={upcoming}
          tankById={tankById}
          empty="Nothing else scheduled yet."
        />
      </div>
    </>
  );
}
