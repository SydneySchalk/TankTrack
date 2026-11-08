import { supabase } from './supabaseClient.js';
import { initialTanks, initialTasks, initialHistory } from './data/mockData.js';
import { addDays, todayISO } from './utils.js';

const STORAGE_KEY = 'tanktrack-demo-v2';

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

function notify() {
  listeners.forEach((fn) => fn());
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // ignore
  }
  notify();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ---------- tanks (Supabase) ----------

function sceneFor(style) {
  if (style === 'Shrimp') return 'shrimp';
  if (style === 'Betta' || style === 'Nano') return 'small';
  return 'planted';
}

// ids from the app are slugs ("living-room"); rows without a slug use tank_id
const idColumn = (id) => (/^\d+$/.test(String(id)) ? 'tank_id' : 'slug');

const sum = (list = [], pick = () => true) =>
  list.filter(pick).reduce((n, x) => n + (Number(x.count) || 0), 0);

// database row -> tank object the pages expect
const fromRow = (r) => ({
  id: r.slug ?? String(r.tank_id),
  name: r.tank_name,
  waterType: r.water_type ?? 'Freshwater',
  style: r.style ?? '',
  volumeL: r.volume_l ?? 0,
  location: r.location ?? '',
  dimensions: r.dimensions ?? '',
  started: r.started ?? '',
  substrate: r.substrate ?? '',
  scene: sceneFor(r.style),
  tone: r.tone ?? 'sage',
  fish: r.fish ?? [],
  plants: r.plants ?? [],
  equipment: r.equipment ?? [],
  parameters: r.parameters ?? null,
  schedules: r.schedules ?? [],
});

// tank object -> database row (undefined fields are skipped, so partial updates work)
const toRow = (t) => ({
  tank_name: t.name,
  water_type: t.waterType,
  style: t.style,
  volume_l: t.volumeL === '' ? null : t.volumeL,
  location: t.location,
  dimensions: t.dimensions,
  started: t.started || undefined,
  substrate: t.substrate,
  tone: t.tone,
  fish: t.fish,
  plants: t.plants,
  equipment: t.equipment,
  parameters: t.parameters,
  schedules: t.schedules,
  fish_number: t.fish ? sum(t.fish, (f) => f.unit !== 'shrimp') : undefined,
  invert_number: t.fish ? sum(t.fish, (f) => f.unit === 'shrimp') : undefined,
  plant_number: t.plants ? sum(t.plants) : undefined,
});

export async function getTanks() {
  const { data, error } = await supabase.from('tanks').select('*').order('created_at');
  if (error) throw error;
  return data.map(fromRow);
}

export async function getTank(id) {
  const { data, error } = await supabase
    .from('tanks')
    .select('*')
    .eq(idColumn(id), id)
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data) : null;
}

// makes a unique slug from the name, like "Living Room" -> living-room
async function makeId(name) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'tank';
  const { data } = await supabase.from('tanks').select('slug');
  const taken = new Set((data ?? []).map((r) => r.slug));
  let id = base;
  let n = 2;
  while (taken.has(id)) id = `${base}-${n++}`;
  return id;
}

export async function createTank(details) {
  const tank = {
    ...details,
    fish: [],
    plants: [],
    equipment: [],
    parameters: null,
    schedules: [],
  };
  const { data, error } = await supabase
    .from('tanks')
    .insert({ ...toRow(tank), slug: await makeId(details.name) })
    .select()
    .single();
  if (error) throw error;
  notify();
  return fromRow(data);
}

export async function updateTank(id, details) {
  const { error } = await supabase.from('tanks').update(toRow(details)).eq(idColumn(id), id);
  if (error) throw error;
  notify();
}

export async function deleteTank(id) {
  const { error } = await supabase.from('tanks').delete().eq(idColumn(id), id);
  if (error) throw error;
  // tasks and history are still local for now
  db = {
    ...db,
    tasks: db.tasks.filter((t) => t.tankId !== id),
    history: db.history.filter((h) => h.tankId !== id),
  };
  save();
}

// ---------- tasks (still sample data) ----------

export async function getTasks() {
  return [...db.tasks].sort((a, b) => a.due.localeCompare(b.due));
}

const REPEAT_DAYS = { Daily: 1, Weekly: 7, 'Every 2 weeks': 14, Monthly: 30 };

export async function completeTask(taskId) {
  const task = db.tasks.find((t) => t.id === taskId);
  if (!task) return;

  const historyEntry = { id: `h${Date.now()}`, name: task.name, tankId: task.tankId, completed: todayISO() };

  const tasks = db.tasks.filter((t) => t.id !== taskId);
  const days = REPEAT_DAYS[task.repeat];
  if (days) {
    tasks.push({ ...task, id: `t${Date.now()}`, due: addDays(todayISO(), days) });
  }

  db = { ...db, tasks, history: [historyEntry, ...db.history] };
  save();
}

// ---------- history (still sample data) ----------

export async function getHistory(tankId) {
  const list = tankId ? db.history.filter((h) => h.tankId === tankId) : db.history;
  return [...list].sort((a, b) => b.completed.localeCompare(a.completed));
}

// resets tasks and history only; tanks now live in Supabase
export function resetDemoData() {
  db = { ...db, tasks: initialTasks, history: initialHistory };
  save();
}