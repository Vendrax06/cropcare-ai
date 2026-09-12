function RiskForecast() {
  const forecast = [
    { day: "Today", risk: 52, level: "Moderate", icon: "🟡" },
    { day: "Tomorrow", risk: 68, level: "High", icon: "🟠" },
    { day: "Day 3", risk: 81, level: "Critical", icon: "🔴" },
    { day: "Day 4", risk: 74, level: "High", icon: "🟠" },
    { day: "Day 5", risk: 61, level: "High", icon: "🟠" },
  ];

  return (
    <main className="main">

      <section className="forecast-header">
        <p className="small-text">PREDICTIVE CROP MONITORING</p>

        <h1>Risk Forecast</h1>

        <p>
          Get an early warning about possible crop diseases and
          pest infestations before serious damage occurs.
        </p>
      </section>

      {/* Overall Risk */}
      <section className="forecast-top">

        <div className="risk-score-card">

          <p>Overall Farm Risk</p>

          <div className="big-risk-score">
            76
          </div>

          <div className="risk-label">
            ⚠️ HIGH RISK
          </div>

          <p className="risk-update">
            Updated 2 hours ago
          </p>

        </div>

        <div className="risk-factors">

          <h2>Risk Factors</h2>

          <p>
            Conditions currently increasing the risk level.
          </p>

          <div className="factor">
            <span>🌧️ Recent Rainfall</span>
            <strong>High</strong>
          </div>

          <div className="factor">
            <span>💧 Humidity</span>
            <strong>84%</strong>
          </div>

          <div className="factor">
            <span>🌡️ Temperature</span>
            <strong>26°C</strong>
          </div>

          <div className="factor">
            <span>🌱 Crop Susceptibility</span>
            <strong>High</strong>
          </div>

        </div>

      </section>

      {/* Forecast */}
      <section className="forecast-panel">

        <div className="panel-heading">
          <div>
            <h2>5-Day Risk Forecast</h2>
            <p>Expected disease and pest risk</p>
          </div>

          <span className="weather">
            🌾 Tomato
          </span>
        </div>

        <div className="forecast-list">

          {forecast.map((item) => (
            <div className="forecast-day" key={item.day}>

              <div className="day-name">
                <span>{item.icon}</span>
                <strong>{item.day}</strong>
              </div>

              <div className="forecast-bar">
                <div
                  className="forecast-progress"
                  style={{ width: `${item.risk}%` }}
                ></div>
              </div>

              <div className="forecast-value">
                <strong>{item.risk}%</strong>
                <span>{item.level}</span>
              </div>

            </div>
          ))}

        </div>

      </section>

      {/* Explanation */}
      <section className="why-risk">

        <div className="why-title">
          <span>💡</span>

          <div>
            <h2>Why is the risk increasing?</h2>
            <p>
              Our prediction engine combines multiple farm-level signals.
            </p>
          </div>
        </div>

        <div className="reason-grid">

          <div className="reason">
            <span>🌧️</span>
            <div>
              <strong>Weather</strong>
              <p>
                Recent rainfall and high humidity create
                favourable conditions for fungal diseases.
              </p>
            </div>
          </div>

          <div className="reason">
            <span>🌱</span>
            <div>
              <strong>Crop Stage</strong>
              <p>
                Your crop is currently in a stage where
                disease susceptibility is higher.
              </p>
            </div>
          </div>

          <div className="reason">
            <span>🐛</span>
            <div>
              <strong>Pest Activity</strong>
              <p>
                Local pest activity has increased compared
                with previous observations.
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* Action */}
      <section className="forecast-action">

        <div>
          <h3>🛡️ Recommended Action</h3>

          <p>
            Increase field monitoring over the next 3–5 days
            and inspect lower leaves for early symptoms.
          </p>
        </div>

        <button>
          View Management Guide →
        </button>

      </section>

    </main>
  );
}

export default RiskForecast;