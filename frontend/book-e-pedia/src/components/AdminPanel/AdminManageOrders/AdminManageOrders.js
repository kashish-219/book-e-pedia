import React, { useEffect, useState } from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

import "./AdminManageOrders.css";

function AdminManageOrders() {
  const [orders, setOrders] = useState([]);
  const [statusOptions] = useState([
    "Completed",
    "Pending",
    "Shipped",
    "Processing",
  ]);

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Ensure the correct URL for your API
        const response = await fetch('http://localhost:8000/api/orders/');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
  
    fetchOrders();
  }, []);
  

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Order_Status: newStatus }),
      });
      setOrders(
        orders.map((order) =>
          order.MasterOrder_ID === orderId
            ? { ...order, Order_Status: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div
      className={`dashboard-main-container ${
        isSidebarCollapsed ? "collapsed" : ""
      }`}
    >
      {/* Top Navbar */}
      <div
        className={`top-main-dashboard-navbar  ${
          isSidebarCollapsed ? "collapsed" : ""
        }`}
      >
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      {/* Sidebar */}
      <div
        className={`sidebar-main-section ${
          isSidebarCollapsed ? "collapsed" : ""
        }`}
      >
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Main Content */}

      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        <div className="admin-view-book-type-container">
          <h1 className="admin-view-book-type-title">Manage Orders</h1>
          <table className="admin-view-book-type-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer ID</th>
                <th>Employee ID</th>
                <th>Order Date</th>
                <th>Total Quantity</th>
                <th>Total Amount</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7">No orders available</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.MasterOrder_ID}>
                    <td>{order.MasterOrder_ID}</td>
                    <td>{order.Cust_ID}</td>
                    <td>{order.Emp_ID}</td>
                    <td>{new Date(order.Order_DateTime).toLocaleDateString()}</td>
                    <td>{order.T_Quantity}</td>
                    <td>Rs. {parseFloat(order.T_Amount).toFixed(2)}</td>

                    <td>
                      <select
                        value={order.Order_Status}
                        onChange={(e) =>
                          handleStatusChange(order.MasterOrder_ID, e.target.value)
                        }
                        className="admin-manage-orders-status-select"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminManageOrders;
