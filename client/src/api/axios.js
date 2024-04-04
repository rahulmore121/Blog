import axios from "axios";

const Base_Url = "http://localhost:3000";
export default axios.create({
  baseURL: Base_Url,
});
export const axiosPrivate = axios.create({
  baseURL: Base_Url,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
