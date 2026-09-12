import { useEffect, useState } from "react";
import { api } from "../services/api";

function RiskForecast() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadForecast() {
    setLoading(true);
    setError("");

    try {
      const data = await api.getRiskForecast();
      setForecast(Array.isArray(data) ? data : data?.forecast || []);
    } catch {
      setError("Risk forecast data is not available yet.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadForecast();
  }, []);

  return (
    <div className="content">
      <section className="page-heading">
        <p className="eyebrow">FIELD RISK</p>
        <h1>Risk forecast</h1>
        <p>Review predicted crop risk from the connected backend and AI service.</p>
      </section>

      {error && (
        <div className="api-banner forecast-banner">
          <div>
            <strong>Forecast unavailable</strong>
            <span>{error}</span>
          </div>
          <button type="button" onClick={loadForecast} disabled={loading}>Retry</button>
        </div>
      )}

      <div className="panel forecast-page-card">
        {loading ? (
          <div className="loading-rows"><div /><div /><div /><div /></div>
        ) : forecast.length === 0 ? (
          <div className="empty forecast-page-empty">
            <span>—</span>
            <strong>No forecast data yet</strong>
            <p>Once the risk forecast API is connected, date-wise predictions will appear here.</p>
          </div>
        ) : (
          <div className="forecast-table">
            <div className="forecast-table-head">
              <span>Date</span><span>Risk</span><span>Level</span>
            </div>
            {forecast.map((item, index) => (
              <div className="forecast-row" key={item.id || index}>
                <strong>{item.date || item.day || "—"}</strong>
                <span>{item.risk != null ? `${item.risk}%` : "—"}</span>
                <em className={String(item.level || "").toLowerCase()}>{item.level || "—"}</em>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RiskForecast;
