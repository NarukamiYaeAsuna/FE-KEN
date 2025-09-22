import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* nếu vào root "/" thì chuyển hướng dựa vào token */}
        <Route path="/" element={token ? <Navigate to="/home" /> : <Navigate to="/login" />} />

        {/* thêm route login */}
        <Route path="/login" element={<Login />} />

        {/* home chỉ vào được nếu có token */}
        <Route path="/home" element={token ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;