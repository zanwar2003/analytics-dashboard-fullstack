export interface SystemStatus {
  name: string;
  status: "synced" | "delayed";
  last_sync_minutes_ago: number;
}

export interface MetricsSummary {
  total_records_processed_14d: number;
  average_accuracy_pct_14d: number;
  systems_synced: string;
  systems: SystemStatus[];
}

export interface TimeseriesPoint {
  date: string;
  records_processed: number;
  accuracy_pct: number;
}

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function fetchSummary(): Promise<MetricsSummary> {
  return getJSON<MetricsSummary>("/api/metrics/summary");
}

export function fetchTimeseries(): Promise<TimeseriesPoint[]> {
  return getJSON<TimeseriesPoint[]>("/api/metrics/timeseries");
}
