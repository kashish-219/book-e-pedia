import React, { useState} from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import { Link, useNavigate } from "react-router-dom";
import "./AdminManageEmployees.css";

function AdminManageEmployees({ employeeList, onAddEmployee }) {
  const navigate = useNavigate();

  const handleEdit = (employee) => {
    navigate("/admin/add-employees", { state: { employee } });
  };

  const handleDelete = (id) => {
    // You might want to implement a delete function here
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        <Link to="/admin/add-employees" className="btn btn-primary">
          <i className="fa fa-plus-circle"></i> Add Employee
        </Link>

        <div className="admin-view-book-type-container">
          <h1 className="admin-view-book-type-title">Employee List</h1>
          <table className="admin-view-book-type-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Designation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employeeList.length === 0 ? (
                <tr>
                  <td colSpan="7">No Employees available</td>
                </tr>
              ) : (
                employeeList.map((employee) => (
                  <tr key={employee.Emp_ID}>
                    <td>{employee.Emp_ID}</td>
                    <td>{employee.Fname}</td>
                    <td>{employee.Lname}</td>
                    <td>{employee.Email}</td>
                    <td>{employee.Phone_Number}</td>
                    <td>{employee.Designation}</td>
                    <td>
                      <button
                        className="admin-view-book-type-edit-btn"
                        onClick={() => handleEdit(employee)}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        className="admin-view-book-type-delete-btn"
                        onClick={() => handleDelete(employee.Emp_ID)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
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

export default AdminManageEmployees;