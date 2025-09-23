import axios from "axios";
import keycloakConfig from "./keycloakConfig";

// Login thường
export async function normalLogin(email: string, password: string) {
  const res = await axios.post("http://localhost:3005/api/login", {
    email,
    password,
  });

  if (res.data.success) {
    // Lưu token
    localStorage.setItem("access_token", res.data.data.token);
    if (res.data.data.refreshToken) {
      localStorage.setItem("refresh_token", res.data.data.refreshToken);
    }
  }

  return res.data;
}

// Lấy URL để redirect Keycloak login
export function getSSOLoginUrl() {
  const { clientId, authServerUrl, realm, redirectUri } = keycloakConfig;
  return `${authServerUrl}/realms/${realm}/protocol/openid-connect/auth` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code`;
}

// Đổi authorization_code sang access_token (SSO)
export async function exchangeCodeForToken(code: string) {
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

  // Lưu token
  localStorage.setItem("access_token", res.data.access_token);
  localStorage.setItem("refresh_token", res.data.refresh_token);

  return res.data;
}

// Refresh token
export async function refreshToken(refresh: string) {
  const { clientId, authServerUrl, realm, redirectUri } = keycloakConfig;
  const tokenUrl = `${authServerUrl}/realms/${realm}/protocol/openid-connect/token`;

  const body = new URLSearchParams();
  body.append("grant_type", "refresh_token");
  body.append("refresh_token", refresh);
  body.append("client_id", clientId);

  const res = await axios.post(tokenUrl, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  // Lưu lại token mới
  localStorage.setItem("access_token", res.data.access_token);
  localStorage.setItem("refresh_token", res.data.refresh_token);

  return res.data;
}

// Logout
export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "https://id.dev.codegym.vn/auth/realms/codegym-software-nhom-6/protocol/openid-connect/logout?redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin";
}
