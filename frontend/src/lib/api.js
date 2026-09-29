import axios from "axios";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND}/api`;

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getToken = () => localStorage.getItem("jc_token");

// Build an authenticated file URL usable in <img>/<video>/<iframe src>
export const fileUrl = (relUrl) => {
  if (!relUrl) return "";
  const token = getToken();
  return `${BACKEND}${relUrl}?auth=${token}`;
};

export const apiErr = (e) => {
  const d = e?.response?.data?.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((x) => x?.msg || "").join(" ");
  return e?.message || "Ocurrió un error";
};
