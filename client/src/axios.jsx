import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL || "https://fragranzia-rf6r.onrender.com";

export const BASE_URL = apiUrl;
export const MEDIA_URL = apiUrl;

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to attach bearer token for all authenticated requests
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (token && token !== "null" && token !== "undefined") {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string" && (image.startsWith("http://") || image.startsWith("https://"))) {
    return image;
  }
  return `${BASE_URL}/uploads/${image}`;
};

export default axiosPrivate;