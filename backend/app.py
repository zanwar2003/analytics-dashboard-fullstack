"""
Small Flask API serving mock analytics data for the dashboard frontend.

Two endpoints:
  GET /api/metrics/summary   -> headline KPI tiles (accuracy, records processed, systems synced)
  GET /api/metrics/timeseries -> daily record-volume + accuracy trend for the last 14 days

No database â data is generated deterministically at import time so the API is self-contained
and easy to run without any setup beyond `pip install -r requirements.txt`.
"""

from __future__ import annotations

import random
from datetime import date, timedelta

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

_rng = random.Random(42)  # fixed seed so the demo data is stable across runs


def _generate_timeseries(days: int = 14) -> list[dict]:
    today = date.today()
    series = []
    for i in range(days, 0, -1):
        day = today - timedelta(days=i)
        records = _rng.randint(400, 950)
        accuracy = round(_rng.uniform(94.0, 99.8), 1)
        series.append(
            {"date": day.isoformat(), "records_processed": records, "accuracy_pct": accuracy}
        )
    return series


_TIMESERIES = _generate_timeseries()
_SYSTEMS = [
    {"name": "CRM", "status": "synced", "last_sync_minutes_ago": 4},
    {"name": "Billing", "status": "synced", "last_sync_minutes_ago": 4},
    {"name": "Support Desk", "status": "synced", "last_sync_minutes_ago": 9},
    {"name": "Data Warehouse", "status": "synced", "last_sync_minutes_ago": 4},
    {"name": "Legacy Export", "status": "delayed", "last_sync_minutes_ago": 47},
]


@app.get("/api/metrics/summary")
def metrics_summary():
    total_records = sum(day["records_processed"] for day in _TIMESERIES)
    avg_accuracy = round(sum(day["accuracy_pct"] for day in _TIMESERIES) / len(_TIMESERIES), 1)
    synced = sum(1 for s in _SYSTEMS if s["status"] == "synced")
    return jsonify(
        {
            "total_records_processed_14d": total_records,
            "average_accuracy_pct_14d": avg_accuracy,
            "systems_synced": f"{synced}/{len(_SYSTEMS)}",
            "systems": _SYSTEMS,
        }
    )


@app.get("/api/metrics/timeseries")
def metrics_timeseries():
    return jsonify(_TIMESERIES)


@app.get("/healthz")
def healthz():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5001)
