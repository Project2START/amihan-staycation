import axios from "axios";
import { HOST } from "@/app/shared/constants/config";
import { getAuthToken } from "./getAuthToken";

const axiosWithAuth = axios.create({
  baseURL: HOST,
});

axiosWithAuth.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosWithAuth;
