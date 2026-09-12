import { useEffect, useState } from "react";
import "./App.css";
import RiskForecast from "./pages/RiskForecast";
import { api } from "./services/api";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "scan", label: "Scan Crop", icon: "scan" },
  { id: "forecast", label: "Risk Forecast", icon: "chart" },
  { id: "alerts", label: "Alerts", icon: "bell" },
];

function Icon({ name, size = 18 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    scan: <><path d="M7 3H4a1 1 0 0 0-1 1v3M17 3h3a1 1 0 0 1 1 1v3M21 17v3a1 1 0 0 1-1 1h-3M3 17v3a1 1 0 0 0 1 1h3"/><path d="M8 8h8v8H8z"/></>,
    chart: <><path d="M4 19V5"/><path d="M4 19h17"/><path d="m7 15 4-5 3 2 5-7"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    upload: <><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 16v4h16v-4"/></>,
    map: <><path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15M15 6v15"/></>,
    cloud: <path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6 11a3.5 3.5 0 0 0 1 7Z"/>,
    refresh: <><path d="M20 11a8 8 0 0 0-14.8-4L3 9"/><path d="M3 4v5h5"/><path d="M4 13a8 8 0 0 0 14.8 4L21 15"/><path d="M21 20v-5h-5"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function App() {
  const [page, setPage] = useState("dashboard");
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [crop, setCrop] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [scanError, setScanError] = useState("");

  async function loadData() {
    setLoading(true);
    setApiError("");

    try {
      const [profileData, dashboardData, alertsData, scansData] = await Promise.all([
        api.getProfile(),
        api.getDashboard(),
        api.getAlerts(),
        api.getRecentScans(),
      ]);

      setProfile(profileData);
      setDashboard(dashboardData);
      setAlerts(Array.isArray(alertsData) ? alertsData : alertsData?.alerts || []);
      setScans(Array.isArray(scansData) ? scansData : scansData?.scans || []);
    } catch {
      setApiError("Backend is not connected yet. Live data will appear after the API is connected.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function navigate(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectImage(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setScanError("Please select an image file.");
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setAnalysis(null);
    setScanError("");
  }

  function clearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview("");
    setAnalysis(null);
    setScanError("");
  }

  async function analyzeCrop(event) {
    event.preventDefault();

    if (!imageFile) {
      setScanError("Please upload a crop image.");
      return;
    }

    if (!crop.trim()) {
      setScanError("Please enter the crop name.");
      return;
    }

    setAnalyzing(true);
    setScanError("");

    try {
      const result = await api.analyzeCrop({
        image: imageFile,
        crop: crop.trim(),
      });
      setAnalysis(result);
    } catch (error) {
      setScanError(error.message || "Analysis could not be completed.");
    } finally {
      setAnalyzing(false);
    }
  }

  const displayName = profile?.name || profile?.fullName || "Farmer";
  const location = profile?.location || dashboard?.location || "Location not available";
  const stats = dashboard?.stats || {};
  const healthScore = dashboard?.healthScore;
  const weather = dashboard?.weather || {};
  const alertCount = stats.activeAlerts ?? (alerts.length > 0 ? alerts.length : null);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">C</div>
          <div>
            <strong>CropCare</strong>
            <span>AI AGRICULTURE</span>
          </div>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={page === item.id ? "nav-item active" : "nav-item"}
              onClick={() => navigate(item.id)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.id === "alerts" && alertCount !== null && <b>{alertCount}</b>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className={apiError ? "status-light waiting" : "status-light"} />
            <div>
              <strong>System status</strong>
              <small>{apiError ? "Waiting for backend" : "Connected"}</small>
            </div>
          </div>

          <div className="sidebar-user">
            <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
            <div>
              <strong>{displayName}</strong>
              <small>{location}</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="mobile-brand">
            <div className="brand-mark">C</div>
            <strong>CropCare</strong>
          </div>

          <div className="breadcrumb">
            Workspace <span>/</span> {pageLabel(page)}
          </div>

          <div className="top-actions">
            <div className="top-location">
              <Icon name="map" size={16} />
              <span>{location}</span>
            </div>
            <button type="button" className="top-icon" aria-label="Notifications" onClick={() => navigate("alerts")}>
              <Icon name="bell" />
              {alertCount !== null && <i />}
            </button>
            <div className="avatar top-avatar">{displayName.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        {apiError && (
          <div className="content api-wrap">
            <div className="api-banner">
              <div>
                <strong>Live data is unavailable</strong>
                <span>{apiError}</span>
              </div>
              <button type="button" onClick={loadData} disabled={loading}>
                <Icon name="refresh" size={15} />
                {loading ? "Checking..." : "Retry"}
              </button>
            </div>
          </div>
        )}

        {page === "dashboard" && (
          <Dashboard
            profile={profile}
            dashboard={dashboard}
            stats={stats}
            healthScore={healthScore}
            weather={weather}
            scans={scans}
            alerts={alerts}
            loading={loading}
            navigate={navigate}
          />
        )}

        {page === "scan" && (
          <ScanPage
            crop={crop}
            setCrop={setCrop}
            imagePreview={imagePreview}
            imageFile={imageFile}
            selectImage={selectImage}
            clearImage={clearImage}
            analysis={analysis}
            analyzing={analyzing}
            scanError={scanError}
            onSubmit={analyzeCrop}
          />
        )}

        {page === "forecast" && <RiskForecast />}

        {page === "alerts" && (
          <AlertsPage alerts={alerts} loading={loading} />
        )}
      </main>
    </div>
  );
}

function Dashboard({ profile, dashboard, stats, healthScore, weather, scans, alerts, loading, navigate }) {
  const name = profile?.name || profile?.fullName || "Farmer";
  const location = profile?.location || dashboard?.location || "Location not available";

  return (
    <div className="content">
      <section className="welcome">
        <div>
          <p className="eyebrow">FIELD OVERVIEW</p>
          <h1>Good to see you, {name}.</h1>
          <p>Monitor crop health and identify field problems early.</p>
        </div>
        <button type="button" className="primary-button" onClick={() => navigate("scan")}>
          <Icon name="scan" size={17} />
          Scan a crop
        </button>
      </section>

      <section className="health-grid">
        <div className="health-card">
          <div className="card-label">
            <span>Crop health</span>
            <span className="status-dot" />
          </div>
          <div className="health-value">
            {healthScore ?? "—"}
            {healthScore != null && <small>/100</small>}
          </div>
          <p>{healthScore != null ? "Current field health score" : "Waiting for field data"}</p>
          <div className="health-line">
            <span style={{ width: `${Math.min(Number(healthScore) || 0, 100)}%` }} />
          </div>
        </div>

        <StatCard label="Total scans" value={stats.totalScans} note="Recorded analyses" />
        <StatCard label="Healthy crops" value={stats.healthyCrops} note="Currently healthy" />
        <StatCard label="Active alerts" value={stats.activeAlerts ?? (alerts.length || null)} note="Need attention" />
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <PanelHead eyebrow="FIELD RISK" title="Risk forecast" action="View forecast" onClick={() => navigate("forecast")} />
          <div className="forecast-empty">
            <div className="forecast-lines" />
            <div className="empty">
              <span>—</span>
              <strong>Forecast data will appear here</strong>
              <p>Risk predictions will be displayed when the forecast API is connected.</p>
            </div>
          </div>
        </div>

        <div className="panel weather-panel">
          <PanelHead eyebrow="FIELD CONDITIONS" title="Weather" />
          <div className="weather-main">
            <Icon name="cloud" size={28} />
            <strong>{weather.temperature ?? "—"}{weather.temperature != null ? "°" : ""}</strong>
          </div>
          <div className="weather-grid">
            <div>
              <span>Humidity</span>
              <strong>{weather.humidity != null ? `${weather.humidity}%` : "—"}</strong>
            </div>
            <div>
              <span>Rainfall</span>
              <strong>{weather.rainfall != null ? `${weather.rainfall} mm` : "—"}</strong>
            </div>
          </div>
          <p className="muted">{location}</p>
        </div>
      </section>

      <section className="dashboard-grid lower">
        <div className="panel">
          <PanelHead eyebrow="HISTORY" title="Recent scans" action="New scan" onClick={() => navigate("scan")} />
          {loading ? <LoadingRows /> : scans.length === 0 ? (
            <Empty text="No crop scans available yet." action="Start your first scan" onClick={() => navigate("scan")} />
          ) : (
            <div className="scan-list">
              {scans.slice(0, 5).map((item, index) => (
                <div className="scan-row" key={item.id || index}>
                  <div className="scan-thumb" />
                  <div>
                    <strong>{item.crop || "Crop"}</strong>
                    <span>{item.disease || item.status || "Analysis pending"}</span>
                  </div>
                  <em>{item.confidence != null ? `${item.confidence}%` : "—"}</em>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <PanelHead eyebrow="ATTENTION" title="Alerts" action="View all" onClick={() => navigate("alerts")} />
          {loading ? <LoadingRows /> : alerts.length === 0 ? (
            <Empty text="No active alerts." />
          ) : (
            <div className="alert-list">
              {alerts.slice(0, 4).map((item, index) => (
                <AlertRow key={item.id || index} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ScanPage({ crop, setCrop, imagePreview, imageFile, selectImage, clearImage, analysis, analyzing, scanError, onSubmit }) {
  return (
    <div className="content">
      <section className="page-heading">
        <p className="eyebrow">CROP ANALYSIS</p>
        <h1>Scan a crop</h1>
        <p>Upload a clear crop image and send it to the connected analysis service.</p>
      </section>

      <form className="scan-layout" onSubmit={onSubmit}>
        <div className="panel upload-panel">
          <label className="field-label" htmlFor="crop-name">Crop name</label>
          <input
            id="crop-name"
            className="text-input"
            type="text"
            value={crop}
            onChange={(event) => setCrop(event.target.value)}
            placeholder="Enter crop name"
          />

          <label className="field-label upload-label">Crop image</label>
          <label className={`upload-box ${imagePreview ? "has-image" : ""}`}>
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Selected crop" />
                <span className="change-image">Choose another image</span>
              </>
            ) : (
              <>
                <span className="upload-icon"><Icon name="upload" size={24} /></span>
                <strong>Upload crop image</strong>
                <span>PNG, JPG or JPEG</span>
              </>
            )}
            <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={(event) => selectImage(event.target.files?.[0])} />
          </label>

          {imageFile && (
            <div className="selected-file">
              <span>{imageFile.name}</span>
              <button type="button" onClick={clearImage} aria-label="Remove image">
                <Icon name="close" size={15} />
              </button>
            </div>
          )}

          {scanError && <p className="form-error">{scanError}</p>}

          <button className="primary-button full" type="submit" disabled={analyzing}>
            <Icon name="scan" size={17} />
            {analyzing ? "Analyzing..." : "Analyze crop"}
          </button>
        </div>

        <div className="panel result-panel">
          <p className="eyebrow">AI ANALYSIS</p>

          {!analysis ? (
            <Empty text="Your analysis result will appear here after the image is submitted." />
          ) : (
            <AnalysisResult analysis={analysis} />
          )}
        </div>
      </form>
    </div>
  );
}

function AnalysisResult({ analysis }) {
  const symptoms = Array.isArray(analysis.symptoms) ? analysis.symptoms : [];
  const recommendations = Array.isArray(analysis.recommendations) ? analysis.recommendations : [];
  const prevention = Array.isArray(analysis.prevention) ? analysis.prevention : [];

  return (
    <div className="analysis">
      <div className="analysis-title">
        <span>RESULT</span>
        <strong>{analysis.disease || "No disease reported"}</strong>
      </div>

      <div className="analysis-stats">
        <div><span>Crop</span><strong>{analysis.crop || "—"}</strong></div>
        <div><span>Confidence</span><strong>{analysis.confidence != null ? `${analysis.confidence}%` : "—"}</strong></div>
        <div><span>Severity</span><strong>{analysis.severity || "—"}</strong></div>
      </div>

      {symptoms.length > 0 && <AnalysisList title="Symptoms" items={symptoms} />}
      {recommendations.length > 0 && <AnalysisList title="Recommendations" items={recommendations} />}
      {prevention.length > 0 && <AnalysisList title="Prevention" items={prevention} />}
    </div>
  );
}

function AnalysisList({ title, items }) {
  return (
    <div className="analysis-section">
      <h3>{title}</h3>
      <ul>{items.map((item, index) => <li key={index}>{item}</li>)}</ul>
    </div>
  );
}

function AlertsPage({ alerts, loading }) {
  return (
    <div className="content">
      <section className="page-heading">
        <p className="eyebrow">FIELD MONITORING</p>
        <h1>Alerts</h1>
        <p>Important changes and risks reported by the connected system.</p>
      </section>

      <div className="alert-full">
        {loading ? <div className="panel"><LoadingRows /></div> :
          alerts.length === 0 ? <div className="panel"><Empty text="No alerts available." /></div> :
          alerts.map((item, index) => <div className="panel alert-card" key={item.id || index}><AlertRow item={item} detailed /></div>)
        }
      </div>
    </div>
  );
}

function AlertRow({ item, detailed = false }) {
  return (
    <div className={detailed ? "alert-row detailed" : "alert-row"}>
      <span className={`alert-mark ${String(item.severity || "").toLowerCase()}`} />
      <div>
        <strong>{item.title || item.message || "Field alert"}</strong>
        <span>{item.message || item.description || "Attention required"}</span>
        {detailed && <small>{item.createdAt || item.date || ""}</small>}
      </div>
    </div>
  );
}

function PanelHead({ eyebrow, title, action, onClick }) {
  return (
    <div className="panel-head">
      <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
      {action && <button type="button" onClick={onClick}>{action} <Icon name="arrow" size={15} /></button>}
    </div>
  );
}

function StatCard({ label, value, note }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value ?? "—"}</strong>
      <small>{note}</small>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="loading-rows">
      <div /><div /><div />
    </div>
  );
}

function Empty({ text, action, onClick }) {
  return (
    <div className="empty">
      <span>—</span>
      <p>{text}</p>
      {action && <button type="button" onClick={onClick}>{action}</button>}
    </div>
  );
}

function pageLabel(page) {
  return NAV_ITEMS.find((item) => item.id === page)?.label || "Dashboard";
}

export default App;
