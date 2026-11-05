import { initialTanks, initialTasks, initialHistory } from './data/mockData.js';
import { addDays, todayISO } from './utils.js';

// fake data for now, swap these for fetch() calls to the backend later

const STORAGE_KEY = 'tanktrack-demo-v2';

// loads saved data from the browser, or the sample data if nothing is saved
function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return { tanks: initialTanks, tasks: initialTasks, history: initialHistory };
}

let db = load();
const listeners = new Set();

// saves to the browser so changes stay after refreshing
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // ignore
  }
  listeners.forEach((fn) => fn());
}

// lets pages know when data changes so they update
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// tanks - GET /tanks, GET /tanks/:id

export async function getTanks() {
  return db.tanks;
}

export async function getTank(id) {
  return db.tanks.find((t) => t.id === id) ?? null;
}

// picks the tank drawing based on the style
function sceneFor(style) {
  if (style === 'Shrimp') return 'shrimp';
  if (style === 'Betta' || style === 'Nano') return 'small';
  return 'planted';
}

// makes an id from the name, like "Living Room" -> living-room
function makeId(name) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'tank';
  let id = base;
  let n = 2;
  while (db.tanks.some((t) => t.id === id)) id = `${base}-${n++}`;
  return id;
}

// adds a new tank, backend: POST /tanks
export async function createTank(details) {
  const tank = {
    ...details,
    id: makeId(details.name),
    scene: sceneFor(details.style),
    fish: [],
    plants: [],
    equipment: [],
    parameters: null,
    schedules: [],
  };
  db = { ...db, tanks: [...db.tanks, tank] };
  save();
  return tank;
}

// saves changes to a tank, backend: PUT /tanks/:id
export async function updateTank(id, details) {
  db = {
    ...db,
    tanks: db.tanks.map((t) => (t.id === id ? { ...t, ...details, scene: sceneFor(details.style) } : t)),
  };
  save();
}

// deletes a tank and its tasks and history, backend: DELETE /tanks/:id
export async function deleteTank(id) {
  db = {
    tanks: db.tanks.filter((t) => t.id !== id),
    tasks: db.tasks.filter((t) => t.tankId !== id),
    history: db.history.filter((h) => h.tankId !== id),
  };
  save();
}

// tasks - GET /tasks, POST /tasks/:id/complete

export async function getTasks() {
  return [...db.tasks].sort((a, b) => a.due.localeCompare(b.due));
}

// how many days until a repeating task comes back
const REPEAT_DAYS = { Daily: 1, Weekly: 7, 'Every 2 weeks': 14, Monthly: 30 };

// marks a task done, moves it to history, and adds the next one if it repeats
export async function completeTask(taskId) {
  const task = db.tasks.find((t) => t.id === taskId);
  if (!task) return;

  const historyEntry = { id: `h${Date.now()}`, name: task.name, tankId: task.tankId, completed: todayISO() };

  const tasks = db.tasks.filter((t) => t.id !== taskId);
  const days = REPEAT_DAYS[task.repeat];
  if (days) {
    // next one counts from today so late tasks dont come back overdue
    tasks.push({ ...task, id: `t${Date.now()}`, due: addDays(todayISO(), days) });
  }

  db = { ...db, tasks, history: [historyEntry, ...db.history] };
  save();
}

// history - GET /history?tankId=

export async function getHistory(tankId) {
  const list = tankId ? db.history.filter((h) => h.tankId === tankId) : db.history;
  return [...list].sort((a, b) => b.completed.localeCompare(a.completed));
}

// puts the sample data back
export function resetDemoData() {
  db = { tanks: initialTanks, tasks: initialTasks, history: initialHistory };
  save();
}
