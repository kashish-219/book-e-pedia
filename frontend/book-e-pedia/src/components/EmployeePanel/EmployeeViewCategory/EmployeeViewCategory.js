import { React, useState } from "react";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import "./EmployeeViewCategory.css";

function EmployeeViewCategory() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Temporary dummy data for categories
  const dummyCategories = [
    { Category_ID: 1, Category_Name: "Fiction", Category_Description: "Fictional books", IsActive: '1' },
    { Category_ID: 2, Category_Name: "Non-Fiction", Category_Description: "Informative books", IsActive: '1' },
    { Category_ID: 3, Category_Name: "Science", Category_Description: "Books on science", IsActive: '1' },
    { Category_ID: 4, Category_Name: "History", Category_Description: "Historical books", IsActive: '1' },
    { Category_ID: 5, Category_Name: "Biography", Category_Description: "Life stories", IsActive: '1' },
    { Category_ID: 6, Category_Name: "Fantasy", Category_Description: "Fantasy novels", IsActive: '1' },
    { Category_ID: 7, Category_Name: "Mystery", Category_Description: "Thrilling mystery books", IsActive: '1' },
    { Category_ID: 8, Category_Name: "Romance", Category_Description: "Romantic novels", IsActive: '1' },
    { Category_ID: 9, Category_Name: "Horror", Category_Description: "Spooky books", IsActive: '1' },
    { Category_ID: 10, Category_Name: "Adventure", Category_Description: "Adventure and exploration", IsActive: '1' }
  ];

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
              {dummyCategories.length > 0 ? (
                dummyCategories.map((category) => (
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
