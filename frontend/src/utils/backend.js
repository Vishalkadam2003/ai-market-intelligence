import axios from "axios";

export const API = axios.create({
  baseURL: "https://ai-market-intelligence-backend.onrender.com/api",
});
