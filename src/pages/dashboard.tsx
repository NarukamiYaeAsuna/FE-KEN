import React, { useState } from "react";
import { useAuth } from "../auth/useAuth";
import "../styles/dashboard.css";

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <h3>Tổng quan dự án và nhiệm vụ</h3>;
      case "projects":
        return <h3>Danh sách dự án & tạo mới</h3>;
      case "tasks":
        return <h3>Danh sách nhiệm vụ & cập nhật tiến độ</h3>;
      case "reports":
        return <h3>Báo cáo & thống kê tiến độ</h3>;
      case "settings":
        return <h3>Quản lý tài khoản và cài đặt</h3>;
      default:
        return <h3>Chọn một tab</h3>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Giao việc Online</h2>
        <ul className="nav flex-column">
          <li className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>Dashboard</li>
          <li className={`nav-item ${activeTab === "projects" ? "active" : ""}`} onClick={() => setActiveTab("projects")}>Dự án</li>
          <li className={`nav-item ${activeTab === "tasks" ? "active" : ""}`} onClick={() => setActiveTab("tasks")}>Nhiệm vụ</li>
          <li className={`nav-item ${activeTab === "reports" ? "active" : ""}`} onClick={() => setActiveTab("reports")}>Báo cáo</li>
          <li className={`nav-item ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>Cài đặt</li>
        </ul>
        <button className="btn btn-danger mt-auto" onClick={logout}>Đăng xuất</button>
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
