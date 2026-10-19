import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL || "https://fragranzia-rf6r.onrender.com";

export const BASE_URL = apiUrl;
export const MEDIA_URL = apiUrl;

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});

export const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string" && (image.startsWith("http://") || image.startsWith("https://"))) {
    return image;
  }
  return `${BASE_URL}/uploads/${image}`;
};

export default axiosPrivate;