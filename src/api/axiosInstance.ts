import axios from "axios";

export const exchangeCodeForToken = async (code: string) => {
  try {
    const res = await axios.post(
      "https://id.dev.codegym.vn/auth/realms/codegym-software-nhom-6/protocol/openid-connect/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: "Test-keyclock",
        redirect_uri: "http://localhost:3000/home"
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" }, withCredentials: true }
    );
    return res.data;
  } catch (err: any) {
    console.error("Exchange code Axios error:", err);
    throw err;
  }
};
