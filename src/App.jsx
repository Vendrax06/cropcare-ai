import { useState } from "react";
import "./App.css";
import RiskForecast from "./pages/RiskForecast";

function App() {
  const [page, setPage] = useState("dashboard");
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState("");
  const [result, setResult] = useState(false);

  const handleImage = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
      setResult(false);
    }
  };

  const analyzeCrop = () => {
    if (!image || !crop) {
      alert("Please upload an image and select a crop.");
      return;
    }

    setResult(true);
  };

  return (
    <div className="app">

      {/* ================= HEADER ================= */}
      <header className="header">

        <div className="logo">
          🌱 <span>CropCare AI</span>
        </div>

        <nav>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage("dashboard");
            }}
          >
            Dashboard
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage("scan");
            }}
          >
            Scan Crop
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage("risk");
            }}
          >
            Risk Forecast
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage("alerts");
            }}
          >
            Alerts
          </a>

        </nav>

        <button className="profile">
          Farmer 👨‍🌾
        </button>

      </header>


      {/* ================= DASHBOARD ================= */}
      {page === "dashboard" && (
        <main className="main">

          <section className="welcome">

            <div>

              <p className="small-text">
                FARM HEALTH MONITORING
              </p>

              <h1>
                Protect your crops with
                <span> AI-powered insights.</span>
              </h1>

              <p className="description">
                Detect crop diseases early, monitor pest activity
                and get actionable recommendations for your farm.
              </p>

              <button
                className="scan-button"
                onClick={() => setPage("scan")}
              >
                📷 Scan Your Crop
              </button>

            </div>


            <div className="health-card">

              <p>Farm Health Score</p>

              <div className="score">
                82
              </div>

              <span>
                Good condition
              </span>

            </div>

          </section>


          {/* STATS */}
          <section className="stats">

            <div className="stat-card">

              <div className="stat-icon">
                🌾
              </div>

              <div>
                <p>Crop Status</p>
                <h2>Healthy</h2>
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon">
                🐛
              </div>

              <div>
                <p>Pest Risk</p>
                <h2>Low</h2>
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon">
                🌦️
              </div>

              <div>
                <p>Disease Risk</p>
                <h2>Medium</h2>
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon">
                🔔
              </div>

              <div>
                <p>Active Alerts</p>
                <h2>3</h2>
              </div>

            </div>

          </section>


          {/* DASHBOARD PANELS */}
          <section className="dashboard-grid">

            <div className="panel">

              <div className="panel-heading">

                <div>
                  <h2>Risk Overview</h2>
                  <p>Current threat level on your farm</p>
                </div>

                <span className="badge">
                  Moderate
                </span>

              </div>


              <div className="risk-bar">
                <div className="risk-progress"></div>
              </div>


              <div className="risk-details">
                <span>Low</span>
                <strong>58 / 100</strong>
                <span>High</span>
              </div>

            </div>


            <div className="panel">

              <div className="panel-heading">

                <div>
                  <h2>Weather Conditions</h2>
                  <p>Today's farm conditions</p>
                </div>

                <span className="weather">
                  ☀️ 27°C
                </span>

              </div>


              <div className="weather-info">

                <div>
                  <strong>78%</strong>
                  <span>Humidity</span>
                </div>

                <div>
                  <strong>12 km/h</strong>
                  <span>Wind</span>
                </div>

                <div>
                  <strong>20%</strong>
                  <span>Rain Chance</span>
                </div>

              </div>

            </div>

          </section>


          {/* ALERT */}
          <section className="alert">

            <div className="alert-icon">
              ⚠️
            </div>

            <div>

              <h3>
                Early Warning
              </h3>

              <p>
                Weather conditions may increase fungal disease
                risk over the next 3–5 days.
              </p>

            </div>

            <button
              onClick={() => setPage("alerts")}
            >
              View Details →
            </button>

          </section>

        </main>
      )}


      {/* ================= SCAN PAGE ================= */}
      {page === "scan" && (
        <main className="main">

          <button
            className="back-button"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>


          <section className="scan-page">

            <div className="scan-header">

              <p className="small-text">
                AI CROP ANALYSIS
              </p>

              <h1>
                Scan Your Crop
              </h1>

              <p>
                Upload a clear image of your crop or leaf
                to detect possible diseases and pests.
              </p>

            </div>


            <div className="scan-content">

              {/* IMAGE UPLOAD */}
              <div className="upload-box">

                {image ? (
                  <img
                    src={image}
                    alt="Crop preview"
                    className="image-preview"
                  />
                ) : (
                  <>
                    <div className="upload-icon">
                      📷
                    </div>

                    <h3>
                      Upload Crop Image
                    </h3>

                    <p>
                      JPG, PNG or JPEG
                    </p>
                  </>
                )}


                <label className="upload-button">

                  {image ? "Change Image" : "Choose Image"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                  />

                </label>

              </div>


              {/* DETAILS */}
              <div className="scan-form">

                <label>
                  Select Crop
                </label>


                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                >

                  <option value="">
                    Select a crop
                  </option>

                  <option value="Tomato">
                    Tomato
                  </option>

                  <option value="Wheat">
                    Wheat
                  </option>

                  <option value="Cotton">
                    Cotton
                  </option>

                  <option value="Soybean">
                    Soybean
                  </option>

                  <option value="Rice">
                    Rice
                  </option>

                </select>


                <button
                  className="analyze-button"
                  onClick={analyzeCrop}
                >
                  🔍 Analyze Crop
                </button>


                <p className="privacy-note">
                  Your image will be analyzed for possible
                  crop health issues.
                </p>

              </div>

            </div>


            {/* RESULT */}
            {result && (
              <section className="result-card">

                <div className="result-title">

                  <span>
                    ⚠️
                  </span>

                  <div>
                    <p>AI Analysis Result</p>
                    <h2>Early Blight Detected</h2>
                  </div>

                </div>


                <div className="result-stats">

                  <div>
                    <span>Confidence</span>
                    <strong>91%</strong>
                  </div>

                  <div>
                    <span>Severity</span>
                    <strong>Moderate</strong>
                  </div>

                  <div>
                    <span>Risk Level</span>
                    <strong>HIGH</strong>
                  </div>

                </div>


                <div className="recommendation">

                  <h3>
                    🌱 Recommended Action
                  </h3>

                  <ul>

                    <li>
                      Inspect affected leaves carefully.
                    </li>

                    <li>
                      Remove heavily infected plant material.
                    </li>

                    <li>
                      Follow recommended IPM practices.
                    </li>

                    <li>
                      Consider expert verification if symptoms
                      continue to spread.
                    </li>

                  </ul>

                </div>

              </section>
            )}

          </section>

        </main>
      )}


      {/* ================= RISK FORECAST ================= */}
      {page === "risk" && (
        <RiskForecast />
      )}


      {/* ================= ALERTS ================= */}
      {page === "alerts" && (
        <main className="main">

          <button
            className="back-button"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>


          <section className="scan-page">

            <div className="scan-header">

              <p className="small-text">
                FARM ALERT CENTER
              </p>

              <h1>
                Alerts
              </h1>

              <p>
                Important warnings and notifications
                about your crop.
              </p>

            </div>


            {/* ALERT 1 */}
            <div className="result-card">

              <div className="result-title">

                <span>
                  ⚠️
                </span>

                <div>
                  <p>High Priority Alert</p>
                  <h2>
                    Fungal Disease Risk Increasing
                  </h2>
                </div>

              </div>

              <p>
                High humidity and recent rainfall may increase
                the risk of fungal disease over the next 3–5 days.
              </p>

            </div>


            {/* ALERT 2 */}
            <div className="result-card">

              <div className="result-title">

                <span>
                  🐛
                </span>

                <div>
                  <p>Medium Priority Alert</p>
                  <h2>
                    Pest Activity Detected
                  </h2>
                </div>

              </div>

              <p>
                Increased pest activity has been observed.
                Inspect the lower leaves of your crops.
              </p>

            </div>


            {/* ALERT 3 */}
            <div className="result-card">

              <div className="result-title">

                <span>
                  🌧️
                </span>

                <div>
                  <p>Weather Alert</p>
                  <h2>
                    Rain Expected
                  </h2>
                </div>

              </div>

              <p>
                Weather conditions may affect crop health.
                Keep monitoring your field regularly.
              </p>

            </div>

          </section>

        </main>
      )}

    </div>
  );
}

export default App;