import React, { useState, useEffect } from "react";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import "./EmployeeViewCategory.css";

function EmployeeViewCategory() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [categories, setCategories] = useState([]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Fetch category details
  useEffect(() => {
    fetch("http://127.0.0.1:8000/category/") // Update with the correct API endpoint
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setCategories(data.data); // Assuming 'data' contains the list of categories
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        <div className="admin-view-book-type-container">
          <h1 className="admin-view-book-type-title">Category List</h1>
          <table className="admin-view-book-type-table">
            <thead>
              <tr>
                <th>Category ID</th>
                <th>Category Name</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.Category_ID}>
                    <td>{category.Category_ID}</td>
                    <td>{category.Category_Name}</td>
                    <td>{category.Category_Description}</td>
                    <td>{category.IsActive === '1' ? 'Active' : 'Inactive'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="admin-view-book-type-no-data">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmployeeViewCategory;
