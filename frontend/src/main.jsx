import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import History from './pages/History.jsx';
import MyTanks from './pages/MyTanks.jsx';
import TankDetails from './pages/TankDetails.jsx';
import TankForm from './pages/TankForm.jsx';
import Tasks from './pages/Tasks.jsx';
import WorkInProgress from './pages/WorkInProgress.jsx';
import './styles.css';

// this is where the app starts, it puts everything inside the root div in index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* routes = which page shows for which link */}
      <Routes>
        {/* everything inside Layout gets the sidebar and top bar */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tanks" element={<MyTanks />} />
          <Route path="/tanks/new" element={<TankForm />} />
          {/* :id is whichever tank is in the link, like /tanks/living-room */}
          <Route path="/tanks/:id" element={<TankDetails />} />
          <Route path="/tanks/:id/edit" element={<TankForm />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/new" element={<WorkInProgress title="Create a task" />} />
          <Route path="/tasks/:id/edit" element={<WorkInProgress title="Edit task" />} />
          <Route path="/history" element={<History />} />
          {/* * catches any link that doesnt match the ones above and sends it to the dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
