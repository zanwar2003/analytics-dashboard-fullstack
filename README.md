# Analytics Dashboard (Full-Stack)

A small full-stack reporting dashboard: a Flask API serving pipeline-health metrics, and a
React + TypeScript frontend rendering them as KPI tiles, a volume/accuracy trend chart, and a
source-systems status panel. Built as a compact version of the kind of "dashboard for senior
stakeholders" work I enjoy â designing a schema, building the API, and shipping the frontend
end-to-end myself.

## What it shows

- **KPI tiles**: total records processed over the last 14 days, average accuracy, and how many
  source systems are currently synced.
- **Trend chart**: a hand-rolled SVG bar+line chart (no charting library dependency) showing
  daily record volume against accuracy over the same window.
- **Source systems panel**: per-system sync status, so a "delayed" system is visible at a glance
  rather than buried in a log.

The backend generates deterministic mock data at startup (fixed random seed) so the dashboard
looks the same on every run without needing a real database.

## Running it

**Backend** (Flask API on port 5001):

```bash
cd backend
pip install -r requirements.txt
python app.py
```

**Frontend** (React + Vite dev server, proxies `/api` to the backend above):

```bash
cd frontend
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

## Running the tests

```bash
cd backend
pip install -r requirements.txt
pytest test_app.py
```

## Building for production

```bash
cd frontend
npm install
npm run build
```

Type-checks with `tsc -b` and bundles with Vite; output lands in `frontend/dist/`.

## Project structure

```
backend/
  app.py            # Flask API: /api/metrics/summary, /api/metrics/timeseries, /healthz
  requirements.txt
  test_app.py

frontend/
  src/
    App.tsx                       # page layout, data fetching, loading/error states
    api.ts                        # typed fetch helpers + response interfaces
    components/DashboardChart.tsx # dependency-free SVG chart component
    index.css
  package.json
  vite.config.ts
  tsconfig.json
```

## Why no charting library on the frontend

The chart is a small enough shape (one bar series + one line series) that hand-rolling it in
plain SVG kept the frontend's dependency footprint at just React itself, which made it easy to
verify the whole build (`tsc -b && vite build`) stays fast and dependency-drama-free. A real
production dashboard with more chart types would reach for a library instead.
