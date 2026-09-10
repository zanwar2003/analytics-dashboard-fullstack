from app import app


def test_healthz():
    client = app.test_client()
    resp = client.get("/healthz")
    assert resp.status_code == 200
    assert resp.get_json() == {"status": "ok"}


def test_metrics_summary_shape():
    client = app.test_client()
    resp = client.get("/api/metrics/summary")
    assert resp.status_code == 200
    data = resp.get_json()
    assert "total_records_processed_14d" in data
    assert "average_accuracy_pct_14d" in data
    assert "systems_synced" in data
    assert isinstance(data["systems"], list)
    assert len(data["systems"]) == 5


def test_metrics_timeseries_shape():
    client = app.test_client()
    resp = client.get("/api/metrics/timeseries")
    assert resp.status_code == 200
    data = resp.get_json()
    assert len(data) == 14
    for day in data:
        assert "date" in day
        assert "records_processed" in day
        assert "accuracy_pct" in day
        assert 0 <= day["accuracy_pct"] <= 100
