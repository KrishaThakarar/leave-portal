// api/api.js
// A single Axios instance used by the whole app to talk to the backend.
import axios from "axios";

const api = axios.create({
  
  baseURL: "/api",
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
