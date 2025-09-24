// useAuth.ts
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForToken, refreshToken } from "./authService";
import keycloakConfig from "./keycloakConfig";
import { logout as serviceLogout } from "./authService";

export function useAuth() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState("Đang kiểm tra đăng nhập...");

  const logout = () => {
    serviceLogout(); // reload thẳng về /login
  };

  const checkLogin = async () => {
    let access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");

    // 1️⃣ Nếu chưa có access nhưng có refresh → refresh token
    if (!access && refresh) {
      try {
        const res = await refreshToken(refresh);
        access = res.access_token;
        localStorage.setItem("access_token", res.access_token);
        if (res.refresh_token) {
          localStorage.setItem("refresh_token", res.refresh_token);
        }
      } catch (err) {
        console.error("Refresh token failed:", err);
        logout();
        return;
      }
    }

    // 2️⃣ Nếu vẫn chưa có access → kiểm tra SSO code
    if (!access) {
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        try {
          const res = await exchangeCodeForToken(code);
  if (res.access_token) {
  localStorage.setItem("access_token", res.access_token);
  localStorage.setItem("refresh_token", res.refresh_token);
  localStorage.setItem("login_type", "SSO");
   setToken(res.refresh_token);
   console.error("ở user token");
   } else {
          console.error("Exchange code failed, không lưu token");
      }
          // Xóa ?code=... trên URL
          window.history.replaceState({}, document.title, keycloakConfig.redirectUri);

          
          setMessage("Đăng nhập thành công 🎉");
          navigate("/home"); // 🔹 điều hướng tới trang Home khi login thành công
          return;
        } catch (err) {
          console.error("Exchange code failed:", err);
          setMessage("Đăng nhập Keycloak thất bại ❌"+ err);
          return; // không tự logout, chờ user nhấn login lại
        }
      }
    }

    // 3️⃣ Nếu có access → đăng nhập thành công
    if (access) {
      setToken(access);
      setMessage("Đăng nhập thành công 🎉");
      navigate("/home"); // 🔹 điều hướng tới trang Home khi đã có token
    } else {
      setMessage("Chưa đăng nhập. Vui lòng quay lại trang Login.");
      // không tự động logout nếu chưa có access
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return { token, message, logout };
}
