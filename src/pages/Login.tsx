import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // 👈 import để điều hướng
import "../styles/login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // 👈 khởi tạo navigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3005/api/login", {
        email,
        password,
      });

      console.log("API response:", res.data);

     if (res.data.token && res.data.user) {
  const { token, user } = res.data;
  localStorage.setItem("token", token);
  localStorage.setItem("email", user.email);
  localStorage.setItem("userId", user.id);

  if (remember) {
    localStorage.setItem("remember_email", email);
  } else {
    localStorage.removeItem("remember_email");
  }

  alert("✅ Đăng nhập thành công!");
  navigate("/home");
} else {
  throw new Error("Đăng nhập thất bại!");
}
      alert("✅ Đăng nhập thành công!");

      // 👉 Chuyển hướng sang trang Home
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      alert("❌ Sai email hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Cột trái */}
      <div className="login-left">
        <div className="text-center">
          <img
            src="/codegymlogo.png"
            alt="Logo"
            className="login-logo"
          />
        </div>

        <h4 className="text-center mb-4 fgg">Đăng nhập</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control nput1"
              placeholder="Tên người dùng / Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control nput2"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="remember">
              Nhớ tài khoản
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-2"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
<div className="text-center text-muted mb-2">hoặc</div>
          <button type="button" className="btn btn-outline-primary w-100">
            Đăng nhập CodeGym ID
          </button>
        </form>
      </div>

      {/* Cột phải */}
      <div className="login-right"></div>
    </div>
  );
};

export default Login;