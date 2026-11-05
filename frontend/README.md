# TankTrack frontend

React + Vite with plain CSS (no Tailwind). Uses sample data until the backend is ready.

## Run it locally

Open a Command Prompt in this folder and run:

```
npm install
npm run dev
```

Then open the link it prints (http://localhost:5173). `npm install` only needs to be run the first time.

## Where things are

| Path | What it is |
| --- | --- |
| `src/styles.css` | all styling / aesthetics, colors are at the top. |
| `src/api.js` | This is where the data comes from, these will be swapped for real API calls later |
| `src/data/mockData.js` | Sample tanks, tasks and history. |
| `src/components/` | shared piece like the layout/sidebar, tank card, task row, tank illustration, icons. |
| `src/pages/` | One file page |

## Screens

- **Dashboard** – today's care first, then your aquariums.
- **My Tanks** – list of tanks.
- **Tank Details** – overview of tank, care, and history.
- **Add / Edit Tank** – form for a tank's details, card color and notes. Editing also has a Delete button.
- **Tasks** – Task that are due today and Upcoming. "Mark complete" moves a task to History.
- **History** – completed tasks listed by month.
Each tank currently has a tone/color (sage, blue and sand), to easily identify the tanks. This is a temporary substitute for the moment. The colors are defined as '.tone-*' in 'src/styles.css/.

The task forms show a "Work in progress" page for now. Shared form pieces are in `src/components/FormParts.jsx` so that the new forms match.

Changes are saved in the browser. Use **Reset sample data** at the bottom of History to start fresh before a demo.

## What the backend needs to provide

These match the functions in `src/api.js`:

- `GET /tanks`, `GET /tanks/:id`, `POST /tanks`, `PUT /tanks/:id`, `DELETE /tanks/:id`
- `GET /tasks`, `POST /tasks/:id/complete`
- `GET /history` (optional `?tankId=`)
