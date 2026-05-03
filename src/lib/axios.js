import axios from "axios";

// export const BACKEND_URL= "http://localhost:2729/api/v1"
export const BACKEND_URL=  "https://feedflow-server-scoial-media-website.onrender.com/api/v1"
export const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});
