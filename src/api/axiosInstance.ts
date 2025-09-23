import axios from "axios";

export const exchangeCodeForToken = async (code: string) => {
  try {
    const res = await axios.post(
      "https://id.dev.codegym.vn/auth/realms/codegym/protocol/openid-connect/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: "codegym-ken-react-local",
        redirect_uri: "http://localhost:3000/*"
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" }, withCredentials: true }
    );
    return res.data;
  } catch (err: any) {
    console.error("Exchange code Axios error:", err);
    throw err;
  }
};
