import axios from "axios";

const API_URL = "http://localhost:3005/api";

// Login local
export const loginApi = async (email: string, password: string) => {
  const { data } = await axios.post(`${API_URL}/login`, { email, password });
  return data; // chứa accessToken
};

export const logoutLocal = async (): Promise<boolean> => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    const response = await axios.post(
      `${API_URL}/logout`,
      { refreshToken }, // gửi refresh token để backend logout
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return response.status === 200 || response.status === 201;
  } catch (err: any) {
    if (err.response) {
      console.error(
        `Logout local failed: ${err.response.status} ${err.response.statusText}`,
        err.response.data
      );
    } else {
      console.error("Logout local error:", err.message);
    }
    return false;
  }
};

// Gọi API backend để giải mã token Keycloak
export const decodeKeycloakToken = async (token: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/keycloak/decode`, { token });
    if (data.success) {
      // trả về object chứa userId, email, roles
      return data.data;
    } else {
      throw new Error(data.message || "Không thể giải mã token");
    }
  } catch (err: any) {
    console.error("Decode Keycloak token failed:", err.message);
    return null;
  }
};
