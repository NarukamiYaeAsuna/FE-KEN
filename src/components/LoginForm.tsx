import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const data = await loginApi(email, password);
    console.log("API response:", data);

    // ✅ lấy đúng field từ backend
    localStorage.setItem("token", data.token);

    alert("✅ Đăng nhập thành công!");
    navigate("/home");
  } catch (err) {
    alert("❌ Sai email hoặc mật khẩu!");
  }
};

  return (
    <form onSubmit={handleLogin}>
      <div className="mb-3">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button className="btn btn-primary w-100" type="submit">
        Login
      </button>
    </form>
  );
};

export default LoginForm;