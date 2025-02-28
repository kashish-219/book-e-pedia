import React, { useEffect, useState } from 'react';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import './AdminManageFeedback.css';

function AdminManageFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  // Fetch feedback details (replace with actual API call)
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        // Mock feedback data
        const mockFeedbacks = [
          {
            Feedback_ID: "FB001",
            Product_ID: "P001",
            Cust_ID: "CUST001",
            Description: "Great product! Highly satisfied with the quality.",
            Feedback_DateTime: "2025-01-24T10:30:00Z",
            IsActive: "1",
          },
          {
            Feedback_ID: "FB002",
            Product_ID: "P002",
            Cust_ID: "CUST002",
            Description: "Delivery was delayed, but the product was worth it.",
            Feedback_DateTime: "2025-01-22T14:45:00Z",
            IsActive: "0",
          },
        ];
  
        // Simulating API response
        setFeedbacks(mockFeedbacks);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };
  
    fetchFeedbacks();
  }, []);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Handle delete feedback
  const handleDeleteFeedback = (id) => {
    const updatedFeedbacks = feedbacks.filter(feedback => feedback.Feedback_ID !== id);
    setFeedbacks(updatedFeedbacks);
    alert(`Feedback with ID ${id} has been deleted.`);
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
        <div className="admin-view-book-type-container">
          <h1 className="admin-view-book-type-title">Customer Feedback</h1>
          <table className="admin-view-book-type-table">
            <thead>
              <tr>
                <th>Feedback ID</th>
                <th>Product ID</th>
                <th>Customer ID</th>
                <th>Description</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback) => (
                <tr key={feedback.Feedback_ID}>
                  <td>{feedback.Feedback_ID}</td>
                  <td>{feedback.Product_ID}</td>
                  <td>{feedback.Cust_ID}</td>
                  <td>{feedback.Description}</td>
                  <td>{new Date(feedback.Feedback_DateTime).toLocaleString()}</td>
                  <td>{feedback.IsActive === "1" ? "Active" : "Inactive"}</td>
                  <td>
                    <button 
                      className="delete-feedback-btn" 
                      onClick={() => handleDeleteFeedback(feedback.Feedback_ID)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminManageFeedback;