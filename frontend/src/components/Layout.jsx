import { NavLink, Outlet } from 'react-router-dom';
import { getTanks, getTasks } from '../api.js';
import { useData } from '../useData.js';
import { todayISO } from '../utils.js';
import { DashboardIcon, HistoryIcon, TankIcon, TasksIcon } from './Icons.jsx';
import Logo from './Logo.jsx';

// placeholder until login is set up
const user = { name: 'Jane Doe', initials: 'JD' };

// sidebar + top bar that show on every page
export default function Layout() {
  const tanks = useData(getTanks) ?? [];
  const tasks = useData(getTasks) ?? [];
  // how many tasks are due today or late, for the little box in the sidebar
  const dueToday = tasks.filter((t) => t.due <= todayISO()).length;

  // todays date for the top bar
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="app">
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <Logo />
          <div className="brand-name">TankTrack</div>
        </NavLink>

        {/* menu links, NavLink highlights the page youre on */}
        <nav className="nav" aria-label="Main">
          <NavLink to="/" end>
            <DashboardIcon /> Dashboard
          </NavLink>
          <NavLink to="/tanks">
            <TankIcon /> My Tanks
          </NavLink>
          <NavLink to="/tasks">
            <TasksIcon /> Tasks
          </NavLink>
          <NavLink to="/history">
            <HistoryIcon /> History
          </NavLink>
        </nav>

        {/* tanks + due today count, turns orange if something is due */}
        <div className="workspace-card">
          <div className="stat-row">
            <div className="stat">
              <div className="stat-label">Tanks</div>
              <div className="stat-value">{tanks.length}</div>
            </div>
            <div className={`stat ${dueToday > 0 ? 'stat-attention' : ''}`}>
              <div className="stat-label">Due today</div>
              <div className="stat-value">{dueToday}</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div>
            <div className="topbar-title">My aquarium workspace</div>
            <div className="topbar-date">{today}</div>
          </div>
          <div className="user">
            <div className="avatar">{user.initials}</div>
            {user.name}
          </div>
        </header>
        <main className="page">
          {/* the current page shows up here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
