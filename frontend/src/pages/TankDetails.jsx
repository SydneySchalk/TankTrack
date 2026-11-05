import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getHistory, getTank, getTasks } from '../api.js';
import TankArt from '../components/TankArt.jsx';
import TaskRow from '../components/TaskRow.jsx';
import { useData } from '../useData.js';
import { formatDate } from '../utils.js';

// tabs so the page isnt one super long scroll
const TABS = ['Overview', 'Care', 'History'];

// white box with a title and an add/edit link (link doesnt work yet)
function Panel({ title, action = 'Add / Edit', children }) {
  return (
    <section className="card card-pad">
      <div className="panel-head">
        <h3 className="panel-title">{title}</h3>
        {action && (
          <Link to="#" className="text-link" onClick={(e) => e.preventDefault()}>
            {action}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

// fish/shrimp dont get an s
function countLabel(item, unit) {
  const label = item.unit ?? unit;
  if (label === 'plant' && item.count !== 1) return 'plants';
  return label;
}

// rows of name on the left and amount on the right
function ItemList({ items, unit, empty }) {
  if (items.length === 0) return <p className="muted small">{empty}</p>;
  return (
    <dl>
      {items.map((item) => (
        <div className="kv" key={item.name ?? item.type}>
          <dt>{item.name ?? item.type}</dt>
          <dd>{item.detail ?? `${item.count} ${countLabel(item, unit)}`}</dd>
        </div>
      ))}
    </dl>
  );
}

// overview tab: fish, plants, equipment, water params
function Overview({ tank }) {
  const fishCount = tank.fish.reduce((n, f) => n + f.count, 0);
  return (
    <div className="detail-columns">
      <div className="stack">
        <Panel title={`Fish (${fishCount})`}>
          <ItemList items={tank.fish} unit="fish" empty="No fish added yet." />
        </Panel>
        <Panel title={`Plants (${tank.plants.length} species)`}>
          <ItemList items={tank.plants} unit="plant" empty="No plants added yet." />
        </Panel>
      </div>
      <div className="stack">
        <Panel title="Equipment">
          <ItemList items={tank.equipment} empty="No equipment added yet." />
        </Panel>
        <Panel title="Water parameters">
          {tank.parameters ? (
            <>
              <p className="muted small">
                Last recorded {formatDate(tank.parameters.recorded)}
              </p>
              <div className="params">
                <div className="param">
                  <div className="fact-label">Temperature</div>
                  <div className="param-value">{tank.parameters.temperature}</div>
                </div>
                <div className="param">
                  <div className="fact-label">pH</div>
                  <div className="param-value">{tank.parameters.ph}</div>
                </div>
                <div className="param">
                  <div className="fact-label">Ammonia</div>
                  <div className="param-value">{tank.parameters.ammonia}</div>
                </div>
              </div>
              <div className="kv">
                <dt className="muted">Nitrite / Nitrate</dt>
                <dd>
                  {tank.parameters.nitrite} / {tank.parameters.nitrate}
                </dd>
              </div>
            </>
          ) : (
            <p className="muted small">No readings yet. Add your first water test.</p>
          )}
        </Panel>
        {/* only shows if the tank has notes */}
        <NotesPanel tank={tank} />
      </div>
    </div>
  );
}

// notes from the tank form
function NotesPanel({ tank }) {
  if (!tank.notes) return null;
  return (
    <section className="card card-pad">
      <div className="panel-head">
        <h3 className="panel-title">Notes</h3>
        <Link to={`/tanks/${tank.id}/edit`} className="text-link">
          Edit
        </Link>
      </div>
      <p className="notes-text">{tank.notes}</p>
    </section>
  );
}

// care tab: schedules and upcoming tasks for this tank
function Care({ tank, tasks }) {
  return (
    <div className="detail-columns">
      <Panel title="Care schedules" action="Edit schedules">
        {tank.schedules.length === 0 ? (
          <p className="muted small">No schedules yet.</p>
        ) : (
          tank.schedules.map((s) => (
            <div className="schedule" key={s.name}>
              <div className="schedule-name">{s.name} schedule</div>
              <div className="muted small">{s.detail}</div>
            </div>
          ))
        )}
      </Panel>
      <section className="card">
        <div className="card-pad" style={{ paddingBottom: 8 }}>
          <div className="panel-head">
            <h3 className="panel-title">Upcoming tasks</h3>
            <Link to="/tasks" className="text-link">
              All tasks →
            </Link>
          </div>
        </div>
        {tasks.length === 0 ? (
          <p className="empty">No tasks for this tank.</p>
        ) : (
          <ul className="list">
            {tasks.map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// history tab: finished tasks for just this tank
function TankHistory({ history }) {
  return (
    <section className="card">
      {history.length === 0 ? (
        <p className="empty">Nothing completed yet. Finished tasks will show up here.</p>
      ) : (
        <ul className="list">
          {history.map((h) => (
            <li className="list-row no-check" key={h.id}>
              <span className="task-name">{h.name}</span>
              <span className="done-mark task-tank">✓ Completed</span>
              <span className="task-when muted">{formatDate(h.completed)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// page for one tank, gets the tank id from the link
export default function TankDetails() {
  const { id } = useParams();
  // which tab is open, starts on overview
  const [tab, setTab] = useState('Overview');
  const tank = useData(getTank, id);
  const allTasks = useData(getTasks);
  const history = useData(getHistory, id);

  // tank id in the link doesnt match any tank
  if (tank === null) {
    return (
      <>
        <Link to="/tanks" className="back-link">
          ← My Tanks
        </Link>
        <p>We couldn’t find that tank.</p>
      </>
    );
  }
  if (!tank || !allTasks || !history) return null;

  // only this tanks tasks
  const tasks = allTasks.filter((t) => t.tankId === tank.id);

  return (
    <>
      <Link to="/tanks" className="back-link">
        ← My Tanks
      </Link>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">{tank.name}</h1>
          <p className="page-sub">
            {tank.waterType} · {tank.style} aquarium · {tank.volumeL} L
          </p>
        </div>
        <div className="actions">
          <Link to={`/tanks/${tank.id}/edit`} className="btn">
            Edit Tank
          </Link>
          <Link to="/tasks/new" className="btn btn-primary">
            Create Task
          </Link>
        </div>
      </div>

      {/* tank picture and the 4 info boxes */}
      <div className={`detail-hero tone-${tank.tone ?? 'sage'}`}>
        <div className="detail-art">
          <TankArt scene={tank.scene} />
        </div>
        <div className="facts">
          <div className="fact">
            <div className="fact-label">Location</div>
            <div>{tank.location || '—'}</div>
          </div>
          <div className="fact">
            <div className="fact-label">Dimensions</div>
            <div>{tank.dimensions || '—'}</div>
          </div>
          <div className="fact">
            <div className="fact-label">Started</div>
            <div>{formatDate(tank.started) || '—'}</div>
          </div>
          <div className="fact">
            <div className="fact-label">Substrate</div>
            <div>{tank.substrate || '—'}</div>
          </div>
        </div>
      </div>

      {/* tab buttons, clicking one changes which section shows below */}
      <div className="tabs" role="tablist">
        {TABS.map((name) => (
          <button
            key={name}
            role="tab"
            className="tab"
            aria-selected={tab === name}
            onClick={() => setTab(name)}
          >
            {name}
            {name === 'Care' && tasks.length > 0 && ` (${tasks.length})`}
          </button>
        ))}
      </div>

      {tab === 'Overview' && <Overview tank={tank} />}
      {tab === 'Care' && <Care tank={tank} tasks={tasks} />}
      {tab === 'History' && <TankHistory history={history} />}
    </>
  );
}
