import React, { useState } from "react";
import "./Reports.css";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

function Reports() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Top Navbar */}
      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      {/* Sidebar */}
      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Main Content */}
      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        <h1>Admin Dashboard Reports</h1>
        <p>Visual insights about customers, products, and sales performance.</p>

        <div className="reports-charts-container">
          {/* Sales Report */}
          <div className="chart-wrapper">
            <h3>Sales</h3>
            <svg width="100%" height="250">
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C49F" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00C49F" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g>
                {/* X-Axis labels */}
                <text x="40" y="230" fontSize="12">Jan</text>
                <text x="120" y="230" fontSize="12">Feb</text>
                <text x="200" y="230" fontSize="12">Mar</text>
                <text x="280" y="230" fontSize="12">Apr</text>
                <text x="360" y="230" fontSize="12">May</text>

                {/* Y-Axis scale */}
                <text x="10" y="200" fontSize="12">100</text>
                <text x="10" y="160" fontSize="12">200</text>
                <text x="10" y="120" fontSize="12">300</text>
                <text x="10" y="80" fontSize="12">400</text>

                <path d="M 40 200 Q 120 100, 200 160 T 360 80" fill="url(#salesGradient)" stroke="#00C49F" strokeWidth="2" />
              </g>
            </svg>
          </div>

          {/* Income Report */}
          <div className="chart-wrapper">
            <h3>Revenue</h3>
            <svg width="100%" height="250">
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8884d8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8884d8" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g>
                {/* X-Axis labels */}
                <text x="40" y="230" fontSize="12">Q1</text>
                <text x="120" y="230" fontSize="12">Q2</text>
                <text x="200" y="230" fontSize="12">Q3</text>
                <text x="280" y="230" fontSize="12">Q4</text>

                {/* Y-Axis scale */}
                <text x="10" y="180" fontSize="12">200</text>
                <text x="10" y="140" fontSize="12">400</text>
                <text x="10" y="100" fontSize="12">600</text>
                <text x="10" y="60" fontSize="12">800</text>

                <path d="M 40 180 Q 120 120, 200 90 T 360 60" fill="url(#incomeGradient)" stroke="#8884d8" strokeWidth="2" />
              </g>
            </svg>
          </div>

          {/* Customer Growth Report */}
          <div className="chart-wrapper">
            <h3>Customer Growth</h3>
            <svg width="100%" height="250">
              <defs>
                <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF8042" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FF8042" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g>
                {/* X-Axis labels */}
                <text x="40" y="230" fontSize="12">Jan</text>
                <text x="120" y="230" fontSize="12">Feb</text>
                <text x="200" y="230" fontSize="12">Mar</text>
                <text x="280" y="230" fontSize="12">Apr</text>

                {/* Y-Axis scale */}
                <text x="10" y="200" fontSize="12">50</text>
                <text x="10" y="160" fontSize="12">100</text>
                <text x="10" y="120" fontSize="12">150</text>
                <text x="10" y="80" fontSize="12">200</text>

                <path d="M 40 200 Q 120 140, 200 100 T 360 70" fill="url(#customerGradient)" stroke="#FF8042" strokeWidth="2" />
              </g>
            </svg>
          </div>

          {/* Product Performance Report */}
          <div className="chart-wrapper">
            <h3>Product Growth in Units</h3>
            <svg width="100%" height="250">
              <defs>
                <linearGradient id="productGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFBB28" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FFBB28" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g>
                {/* X-Axis labels */}
                <text x="40" y="230" fontSize="12">P1</text>
                <text x="120" y="230" fontSize="12">P2</text>
                <text x="200" y="230" fontSize="12">P3</text>
                <text x="280" y="230" fontSize="12">P4</text>

                {/* Y-Axis scale */}
                <text x="10" y="150" fontSize="12">100</text>
                <text x="10" y="110" fontSize="12">200</text>
                <text x="10" y="70" fontSize="12">300</text>
                <text x="10" y="30" fontSize="12">400</text>

                <path d="M 40 150 Q 120 170, 200 90 T 360 100" fill="url(#productGradient)" stroke="#FFBB28" strokeWidth="2" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
