import type { TimeseriesPoint } from "../api";

interface Props {
  data: TimeseriesPoint[];
}

/**
 * A dependency-free SVG bar chart of daily record volume, with an overlaid accuracy line.
 * Deliberately hand-rolled rather than pulling in a charting library, to keep the frontend's
 * only dependencies as React + Vite.
 */
export default function DashboardChart({ data }: Props) {
  if (data.length === 0) return null;

  const width = 880;
  const height = 220;
  const padding = 32;
  const maxRecords = Math.max(...data.map((d) => d.records_processed));
  const barWidth = (width - padding * 2) / data.length - 6;

  const xFor = (i: number) => padding + i * ((width - padding * 2) / data.length);
  const yForRecords = (v: number) => height - padding - (v / maxRecords) * (height - padding * 2);
  const yForAccuracy = (v: number) => height - padding - (v / 100) * (height - padding * 2);

  const accuracyPoints = data
    .map((d, i) => `${xFor(i) + barWidth / 2},${yForAccuracy(d.accuracy_pct)}`)
    .join(" ");

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Daily records processed and accuracy trend">
      {data.map((d, i) => (
        <rect
          key={d.date}
          x={xFor(i)}
          y={yForRecords(d.records_processed)}
          width={barWidth}
          height={height - padding - yForRecords(d.records_processed)}
          fill="#93c5fd"
          rx={2}
        >
          <title>{`${d.date}: ${d.records_processed} records, ${d.accuracy_pct}% accuracy`}</title>
        </rect>
      ))}
      <polyline points={accuracyPoints} fill="none" stroke="#2563eb" strokeWidth={2} />
      {data.map((d, i) => (
        <circle key={`pt-${d.date}`} cx={xFor(i) + barWidth / 2} cy={yForAccuracy(d.accuracy_pct)} r={3} fill="#2563eb" />
      ))}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" />
    </svg>
  );
}
