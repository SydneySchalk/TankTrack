import { Link } from 'react-router-dom';
import { getTanks, getTasks } from '../api.js';
import { PlusIcon } from '../components/Icons.jsx';
import TankCard from '../components/TankCard.jsx';
import { useData } from '../useData.js';

// list of all your tanks
export default function MyTanks() {
  const tanks = useData(getTanks);
  const tasks = useData(getTasks);
  if (!tanks || !tasks) return null;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tanks</h1>
          <p className="page-sub">Keep aquarium details, livestock and care routines together.</p>
        </div>
        <div className="actions">
          <Link to="/tanks/new" className="btn btn-primary">
            <PlusIcon /> Add Tank
          </Link>
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">All aquariums ({tanks.length})</h2>
        </div>
        {/* if there are no tanks show a message, otherwise show the cards */}
        {tanks.length === 0 ? (
          <div className="card empty">No tanks yet. Add your first aquarium to get started.</div>
        ) : (
          <div className="tank-grid">
            {tanks.map((tank) => (
              // showLocation adds the room under the tank name
              <TankCard
                key={tank.id}
                tank={tank}
                showLocation
                nextTask={tasks.find((t) => t.tankId === tank.id)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
