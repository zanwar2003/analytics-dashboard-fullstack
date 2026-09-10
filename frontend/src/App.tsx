import { useEffect, useState } from "react";
import { fetchSummary, fetchTimeseries, type MetricsSummary, type TimeseriesPoint } from "./api";
import DashboardChart from "./components/DashboardChart";

export default function App() {
  const [summary, setSummary] = useState<MetricsSummary | null>(null);
  const [timeseries, setTimeseries] = useState<TimeseriesPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchSummary(), fetchTimeseries()])
      .then(([summaryData, timeseriesData]) => {
        setSummary(summaryData);
        setTimeseries(timeseriesData);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="dashboard">
      <h1>Reporting Dashboard</h1>
      <p className="subtitle">14-day data-pipeline health, generated for senior stakeholder review.</p>

      {error && (
        <div className="error-banner">
          Couldn't reach the API at /api â make sure the backend is running (see the README).
          ({error})
        </div>
      )}

      {summary && (
        <div className="tiles">
          <div className="tile">
            <div className="label">Records processed (14d)</div>
            <div className="value">{summary.total_records_processed_14d.toLocaleString()}</div>
          </div>
          <div className="tile">
            <div className="label">Average accuracy</div>
            <div className="value">{summary.average_accuracy_pct_14d}%</div>
          </div>
          <div className="tile">
            <div className="label">Systems synced</div>
            <div className="value">{summary.systems_synced}</div>
          </div>
        </div>
      )}

      {timeseries.length > 0 && (
        <div className="panel">
          <h2>Daily volume &amp; accuracy</h2>
          <DashboardChart data={timeseries} />
        </div>
      )}

      {summary && (
        <div className="panel">
          <h2>Source systems</h2>
          <ul className="systems-list">
            {summary.systems.map((s) => (
              <li key={s.name}>
                <span>{s.name}</span>
                <span>
                  <span className={`status-badge ${s.status}`}>{s.status}</span>
                  {"  "}
                  <span style={{ color: "#9ca3af" }}>{s.last_sync_minutes_ago}m ago</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
