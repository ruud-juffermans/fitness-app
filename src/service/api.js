// @service/api.ts
import axios from "axios";

export const BASE_URL = "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  // withCredentials: false, // usually not needed in RN
});

export default axiosInstance;
