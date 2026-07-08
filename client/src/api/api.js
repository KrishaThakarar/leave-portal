// api/api.js
// A single Axios instance used by the whole app to talk to the backend.
import axios from "axios";

const api = axios.create({
  // All requests are relative to /api. In development, Vite proxies this to
  // the Express server (see vite.config.js).
  baseURL: "/api",
});

// An "interceptor" runs before every request leaves the browser.
// Here we automatically attach the saved login token so we don't have to
// remember to add it on every single call.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
