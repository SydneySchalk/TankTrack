import { Link } from 'react-router-dom';
import { dueLabel, livestockSummary } from '../utils.js';
import TankArt from './TankArt.jsx';

// card for one tank, used on the dashboard and my tanks
export default function TankCard({ tank, nextTask, showLocation = false }) {
  return (
    <article className={`card tank-card tone-${tank.tone ?? 'sage'}`}>
      <div className="tank-card-art">
        <TankArt scene={tank.scene} />
      </div>
      <div className="tank-card-body">
        <h3 className="tank-card-name">{tank.name}</h3>
        <p className="muted small">
          {tank.waterType} · {tank.style} · {tank.volumeL} L
        </p>
        {showLocation && <p className="muted small">{tank.location}</p>}
        <p className="small">{livestockSummary(tank)}</p>
        {/* next task for this tank */}
        <p className="tank-card-next">
          {nextTask ? `${nextTask.name} · ${dueLabel(nextTask.due)}` : 'Nothing scheduled'}
        </p>
        <Link to={`/tanks/${tank.id}`} className="tank-card-link">
          View tank
        </Link>
      </div>
    </article>
  );
}
