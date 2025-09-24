import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { normalLogin, getSSOLoginUrl } from "../auth/authService";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNormalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await normalLogin(email, password);
      if (res.success) navigate("/darboard");
      else alert(res.message);
    } catch {
      alert("Lỗi đăng nhập thường");
    }
  };

  const handleSSOLogin = () => {

    window.location.href = getSSOLoginUrl();
     navigate("/home");
  };

  return (
    <div className="container mt-5">
      <div className="row shadow rounded" style={{ minHeight: "500px" }}>
        {/* Left: Form */}
        <div className="col-md-6 d-flex flex-column justify-content-center p-5 bg-light">
          <h3 className="text-center mb-4">Đăng nhập</h3>

          <form onSubmit={handleNormalLogin}>
            <div className="mb-3">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Đăng nhập thường
            </button>
          </form>

          <div className="text-center">Hoặc</div>

          <button
            onClick={handleSSOLogin}
            className="btn btn-success w-100 mt-3"
          >
            Đăng nhập với ID CodeGym
          </button>
        </div>

        {/* Right: Image */}
        <div
          className="col-md-6 d-none d-md-block"
          style={{
            backgroundImage: "url('//james.codegym.vn/pluginfile.php/1/theme_remui/logo/1737014283/Codegym%20X.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderTopRightRadius: "0.5rem",
            borderBottomRightRadius: "0.5rem",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Login;
