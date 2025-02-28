// AdminDashboard.js
import React, { useState } from "react";
import "./AdminDashboard.css";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

function AdminDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Top Navbar */}
      <div className={`top-main-dashboard-navbar  ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      {/* Sidebar */}
      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Main Content */}
      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        <h1>Admin Dashboard</h1>
        <p>Welcome to the Admin Dashboard. Here you can manage all the activities related to the system.</p>

        {/* Cards Section */}
        <div className="cards-container">
          <div className="dashboard-card">
            <h2>Total Customers</h2>
            <p>1,250</p>
          </div>

          <div className="dashboard-card">
            <h2>Total Products</h2>
            <p>540</p>
          </div>

          <div className="dashboard-card">
            <h2>Total Categories</h2>
            <p>35</p>
          </div>

          <div className="dashboard-card">
            <h2>Total Orders</h2>
            <p>890</p>
          </div>

          <div className="dashboard-card">
            <h2>Total Sales</h2>
            <p>₹25,600</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
