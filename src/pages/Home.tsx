import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token"); // xóa token
    navigate("/login"); // quay về trang login
  };

  return (
    <div className="container mt-5">
      <h2>🏠 Home Page</h2>
      {token ? (
        <>
          <p className="text-success">
            Bạn đã đăng nhập thành công! <br />
            Token: <code>{token}</code>
          </p>
          <button className="btn btn-danger mt-3" onClick={handleLogout}>
            🚪 Logout
          </button>
        </>
      ) : (
        <p className="text-danger">Chưa đăng nhập</p>
      )}
    </div>
  );
};

export default Home;