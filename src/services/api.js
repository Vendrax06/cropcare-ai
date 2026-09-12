const API_BASE_URL = import.meta.env.VITE_API_URL || "";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const data = await response.json();
      message = data.message || message;
    } catch {}

    throw new Error(message);
  }

  return response.json();
}

export const api = {
  getProfile: () => request("/api/profile"),

  getDashboard: () => request("/api/dashboard"),

  getRiskForecast: () => request("/api/risk-forecast"),

  getAlerts: () => request("/api/alerts"),

  getRecentScans: () => request("/api/scans"),

  analyzeCrop: ({ image, crop }) => {
    const formData = new FormData();

    formData.append("image", image);
    formData.append("crop", crop);

    return request("/api/analyze", {
      method: "POST",
      body: formData,
    });
  },
};