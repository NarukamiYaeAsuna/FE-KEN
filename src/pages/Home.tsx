import React from "react";
import { useAuth } from "../auth/useAuth";

const Home: React.FC = () => {
  const { token, message, logout } = useAuth();

  return (
    <div className="container mt-5">
      <h2>Trang Home</h2>
      <p>{message}</p>
      {token && (
        <button onClick={logout} className="btn btn-danger mt-3">
          Đăng xuất
        </button>
      )}
    </div>
  );
};

export default Home;
