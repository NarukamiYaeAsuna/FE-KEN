import axios from "axios";
import keycloakConfig from "./keycloakConfig";
import {logoutLocal } from "../api/authApi";
import { useNavigate } from "react-router-dom";
// Login thường
export async function normalLogin(email: string, password: string) {
  const res = await axios.post("http://localhost:3005/api/login", {
    email,
    password,
  });

  if (res.data.success) {
    // Lưu token
    localStorage.setItem("access_token", res.data.data.token);
    console.log('đăng nhập thường token 1 là: '+ res.data.data.token);
    // lưu role 
    localStorage.setItem("Role",res.data.data.user.role);
     console.log('đăng nhập thường role: '+ res.data.data.user.role);
    // lưu role 
    // lưu userID
    if (res.data.data.refreshToken) {
    localStorage.setItem("refresh_token", res.data.data.refreshToken);
    console.log('đăng nhập thường token 2 là: '+ res.data.data.refreshToken);
    }
    // lưu thông tin đăng nhập local vào biến
   localStorage.setItem("login_type", "local");
    console.log('đăng nhập thường'+ localStorage.getItem("login_type"));
  }

  return res.data;
}

// Lấy URL để redirect Keycloak login
// Lấy URL để redirect Keycloak login
export function getSSOLoginUrl() {
  try {
    const { clientId, authServerUrl, realm, redirectUri } = keycloakConfig;
    return `${authServerUrl}/realms/${realm}/protocol/openid-connect/auth` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code`;
  } catch (err: any) {
    console.error("Lấy URL SSO thất bại:", err.message);
    return "";
  }
}


// Đổi authorization_code sang access_token (SSO)
export async function exchangeCodeForToken(code: string) {
  try {
    const { clientId, authServerUrl, realm, redirectUri } = keycloakConfig;
    const tokenUrl = `${authServerUrl}/realms/${realm}/protocol/openid-connect/token`;

    const body = new URLSearchParams();
    body.append("grant_type", "authorization_code");
    body.append("code", code);
    body.append("client_id", clientId);
    body.append("redirect_uri", redirectUri);

    const res = await axios.post(tokenUrl, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (res.data.access_token) {
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      localStorage.setItem("login_type", "SSO");
      console.log("SSO token lưu thành công");
    } else {
      console.error("Exchange code thất bại, không lưu token");
    }

    return res.data;
  } catch (err: any) {
    console.error("Exchange code SSO thất bại:", err?.response?.data || err.message);
    throw err;
  }
}

// Refresh token
export async function refreshToken(refresh: string) {
  try {
    const { clientId, authServerUrl, realm } = keycloakConfig;
    const tokenUrl = `${authServerUrl}/realms/${realm}/protocol/openid-connect/token`;

    const body = new URLSearchParams();
    body.append("grant_type", "refresh_token");
    body.append("refresh_token", refresh);
    body.append("client_id", clientId);

    const res = await axios.post(tokenUrl, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    localStorage.setItem("access_token", res.data.access_token);
    localStorage.setItem("refresh_token", res.data.refresh_token);

    return res.data;
  } catch (err: any) {
    console.error("Refresh token thất bại:", err?.response?.data || err.message);
    throw err;
  }
}

// Logout SSO
export function logoutSSO() {
  try {
    localStorage.clear();
    const redirectUri = encodeURIComponent("http://localhost:3000/login");
    const keycloakLogoutUrl = `https://id.dev.codegym.vn/auth/realms/codegym-software-nhom-6/protocol/openid-connect/logout?redirect_uri=${redirectUri}`;
    window.location.href = keycloakLogoutUrl;
  } catch (err: any) {
    console.error("Logout SSO thất bại:", err.message);
  }
}

export async function logout() {
  const loginType = localStorage.getItem("login_type");

  if (loginType === "local") {
    const success = await logoutLocal();
    if (success) {
      localStorage.clear();
      window.location.href = "/login"; // trở về trang login
    } else {
      alert("Đăng xuất không thành công. Vui lòng thử lại.");
    }
  } else if (loginType === "SSO") {
   logoutSSO();
  }
}
