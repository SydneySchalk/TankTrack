import { completeTask } from '../api.js';
import { dueLabel, todayISO } from '../utils.js';
import { CheckIcon } from './Icons.jsx';
import TankTag from './TankTag.jsx';

// little label that says overdue, due or upcoming
export function StatusPill({ due }) {
  const today = todayISO();
  if (due < today) return <span className="pill pill-overdue">Overdue</span>;
  if (due === today) return <span className="pill pill-due">Due</span>;
  return <span className="pill">Upcoming</span>;
}

// one task in a list, clicking the checkbox marks it done
export default function TaskRow({ task, tank }) {
  return (
    <li className="list-row">
      <button
        className="check"
        onClick={() => completeTask(task.id)}
        aria-label={`Mark "${task.name}" complete`}
        title="Mark complete"
      >
        <span className="check-hover">
          <CheckIcon />
        </span>
      </button>
      <span className="task-name">{task.name}</span>
      <span className="task-tank muted small">{tank && <TankTag tank={tank} />}</span>
      <span className="task-when">
        {dueLabel(task.due)}
        <StatusPill due={task.due} />
      </span>
    </li>
  );
}
