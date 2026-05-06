import axios from "axios";
import i18n from "../../i18n";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Accept": "application/json",
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["Accept-Language"] = i18n.language || "fr";

  return config;
});

export default api;
