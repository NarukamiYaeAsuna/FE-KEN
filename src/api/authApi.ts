import axios from "axios";

const API_URL = "http://localhost:3005/api";

export const loginApi = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data; // chứa accessToken
};