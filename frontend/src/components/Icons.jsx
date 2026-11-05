// small icons for the sidebar and buttons
// base settings every icon shares
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const DashboardIcon = () => (
  <svg {...base} fill="currentColor" stroke="none">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

export const TankIcon = () => (
  <svg {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 15h18" />
  </svg>
);

export const TasksIcon = () => (
  <svg {...base}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="m8 12 3 3 5-6" />
  </svg>
);

export const HistoryIcon = () => (
  <svg {...base}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const PlusIcon = () => (
  <svg {...base} width="16" height="16">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const CheckIcon = () => (
  <svg {...base} width="14" height="14" strokeWidth="3">
    <path d="m5 12 5 5 9-10" />
  </svg>
);
