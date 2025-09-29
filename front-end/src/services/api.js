import axios from "axios";
import { setupInterceptors } from "../utils/interceptors";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 100000,
});

setupInterceptors(api);

export default api;
