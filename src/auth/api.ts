import axios from "axios";
import { refreshToken } from "./authService";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:3005/api", // backend của bạn
});

// Interceptor để tự động thêm access_token vào header
api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token");

  if (!token && refresh) {
    try {
      const res = await refreshToken(refresh);
      token = res.access_token;
      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("refresh_token", res.refresh_token);
    } catch (err) {
      console.error("Refresh token thất bại", err);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor để handle lỗi 401 (token hết hạn)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const res = await refreshToken(refresh);
          localStorage.setItem("access_token", res.access_token);
          localStorage.setItem("refresh_token", res.refresh_token);
          originalRequest.headers["Authorization"] = `Bearer ${res.access_token}`;
          return api(originalRequest); // retry request
        } catch (err) {
          console.error("Refresh token failed", err);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/"; // quay về login
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
