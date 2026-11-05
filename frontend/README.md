# TankTrack frontend

React + Vite with plain CSS (no Tailwind). Uses sample data until the backend is ready.

## Run it

Open a Command Prompt in this folder and run:

```
npm install
npm run dev
```

Then open the link it prints (usually http://localhost:5173). `npm install` only needs to be run the first time.

## Where things are

| Path | What it is |
| --- | --- |
| `src/styles.css` | All styles. Colors and spacing are variables at the top (`:root`). |
| `src/api.js` | **The only file that talks to data.** Swap these functions for `fetch()` calls when the Express API exists. |
| `src/data/mockData.js` | Sample tanks, tasks and history. |
| `src/components/` | Shared pieces: layout/sidebar, tank card, task row, tank illustration, icons. |
| `src/pages/` | One file per screen: Dashboard, My Tanks, Tank Details, Tasks, History. |

## Screens

- **Dashboard** – today's care first, then your aquariums.
- **My Tanks** – all aquariums.
- **Tank Details** – split into Overview, Care and History tabs so it isn't one long page.
- **Add / Edit Tank** – form for a tank's details, card color and notes. Editing also has a Delete button.
- **Tasks** – Due today and Upcoming. "Mark complete" moves a task to History and schedules the next one if it repeats.
- **History** – completed tasks grouped by month, filterable by tank.
Each tank has a `tone` (`sage`, `blue` or `sand`) that sets its colors. Tones are defined as `.tone-*` in `src/styles.css`.

The task forms show a "Work in progress" page for now. Shared form pieces are in `src/components/FormParts.jsx` so new forms match.

Changes are saved in the browser. Use **Reset sample data** at the bottom of History to start fresh before a demo.

## What the backend needs to provide

These match the functions in `src/api.js`:

- `GET /tanks`, `GET /tanks/:id`, `POST /tanks`, `PUT /tanks/:id`, `DELETE /tanks/:id`
- `GET /tasks`, `POST /tasks/:id/complete`
- `GET /history` (optional `?tankId=`)
