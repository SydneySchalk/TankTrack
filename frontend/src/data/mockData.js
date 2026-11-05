// sample data, dates are based on today so theres always something due

import { addDays, todayISO } from '../utils.js';

const daysFromToday = (n) => addDays(todayISO(), n);

export const initialTanks = [
  {
    id: 'living-room',
    name: 'Living Room Community',
    waterType: 'Freshwater',
    style: 'Planted',
    volumeL: 120,
    location: 'Living room',
    dimensions: '80 × 35 × 45 cm',
    started: '2026-01-12',
    substrate: 'Aquasoil + sand',
    scene: 'planted',
    tone: 'sage',
    fish: [
      { name: 'Neon tetra', count: 10 },
      { name: 'Corydoras panda', count: 4 },
    ],
    plants: [
      { name: 'Anubias nana', count: 2 },
      { name: 'Java fern', count: 3 },
      { name: 'Amazon sword', count: 1 },
    ],
    equipment: [
      { type: 'Filter', detail: 'Canister filter · 600 L/h' },
      { type: 'Heater', detail: '100 W · Set to 25 °C' },
      { type: 'Lighting', detail: 'LED bar · 24 W' },
    ],
    parameters: {
      recorded: daysFromToday(-1),
      temperature: '25 °C',
      ph: '7.0',
      ammonia: '0 ppm',
      nitrite: '0 ppm',
      nitrate: '10 ppm',
    },
    schedules: [
      { name: 'Lighting', detail: 'Daily · 12:00–20:00 (8 hours)' },
      { name: 'Feeding', detail: 'Daily · 09:00 · Small pinch of flakes' },
      { name: 'Fertilizing', detail: 'Tuesday & Friday · 5 mL liquid fertilizer' },
    ],
  },
  {
    id: 'betta-corner',
    name: 'Betta Corner',
    waterType: 'Freshwater',
    style: 'Betta',
    volumeL: 30,
    location: 'Home office',
    dimensions: '45 × 30 × 30 cm',
    started: '2026-03-04',
    substrate: 'Fine gravel',
    scene: 'small',
    tone: 'blue',
    fish: [{ name: 'Betta splendens', count: 1 }],
    plants: [
      { name: 'Java fern', count: 1 },
      { name: 'Marimo moss ball', count: 2 },
    ],
    equipment: [
      { type: 'Filter', detail: 'Sponge filter' },
      { type: 'Heater', detail: '50 W · Set to 26 °C' },
    ],
    parameters: {
      recorded: daysFromToday(-4),
      temperature: '26 °C',
      ph: '7.2',
      ammonia: '0 ppm',
      nitrite: '0 ppm',
      nitrate: '5 ppm',
    },
    schedules: [{ name: 'Feeding', detail: 'Daily · 08:30 · 3 pellets' }],
  },
  {
    id: 'shrimp-garden',
    name: 'Shrimp Garden',
    waterType: 'Freshwater',
    style: 'Shrimp',
    volumeL: 45,
    location: 'Bedroom',
    dimensions: '60 × 30 × 30 cm',
    started: '2026-05-20',
    substrate: 'Aquasoil',
    scene: 'shrimp',
    tone: 'sand',
    fish: [{ name: 'Cherry shrimp', count: 20, unit: 'shrimp' }],
    plants: [
      { name: 'Java moss', count: 1 },
      { name: 'Cryptocoryne wendtii', count: 4 },
    ],
    equipment: [{ type: 'Filter', detail: 'Sponge filter' }],
    parameters: null,
    schedules: [{ name: 'Lighting', detail: 'Daily · 10:00–18:00 (8 hours)' }],
  },
];

export const initialTasks = [
  { id: 't1', name: '25% water change', tankId: 'living-room', due: daysFromToday(0), repeat: 'Weekly' },
  { id: 't2', name: 'Feed betta', tankId: 'betta-corner', due: daysFromToday(0), repeat: 'Daily' },
  { id: 't3', name: 'Rinse filter sponge', tankId: 'shrimp-garden', due: daysFromToday(2), repeat: 'Every 2 weeks' },
  { id: 't4', name: 'Trim plants', tankId: 'living-room', due: daysFromToday(3), repeat: 'Weekly' },
];

export const initialHistory = [
  { id: 'h1', name: 'Test water parameters', tankId: 'living-room', completed: daysFromToday(-1) },
  { id: 'h2', name: 'Test water parameters', tankId: 'betta-corner', completed: daysFromToday(-4) },
  { id: 'h3', name: '25% water change', tankId: 'living-room', completed: daysFromToday(-7) },
  { id: 'h4', name: 'Rinse filter sponge', tankId: 'shrimp-garden', completed: daysFromToday(-12) },
];
