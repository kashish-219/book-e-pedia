import { React, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import './EmployeeManageBookType.css';

function EmployeeManageBookType() {
  const [bookTypes, setBookTypes] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookTypes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/booktypes/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Ensure only active records are stored in state
        const activeBookTypes = data.data.filter(book => book.IsActive === "1" || book.IsActive === 1);
        setBookTypes(activeBookTypes);
      } catch (error) {
        console.error("Error fetching book types:", error);
      }
    };

    fetchBookTypes();
  }, []);

  const handleEdit = (book) => {
    navigate("/employee/add-booktype", { state: { book } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book type?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/booktypes/${id}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ IsActive: 0 }),
        });

        if (!response.ok) {
          throw new Error("Failed to update book type status.");
        }

        setBookTypes((prevBookTypes) => prevBookTypes.filter((book) => book.Book_ID !== id));

        console.log(`Book ID ${id} marked as inactive.`);
      } catch (error) {
        console.error("Error deleting book type:", error);
      }
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        <Link to="/employee/add-booktype" className="btn btn-primary">
          <i className="fa fa-plus-circle"></i> Add New Book Type
        </Link>

        <div className="admin-view-book-type-container">
          <h1 className="admin-view-book-type-title">Book Type List</h1>
          <table className="admin-view-book-type-table">
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Book Name</th>
                <th>Physical Book</th>
                <th>Audio Book</th>
                <th>E-Book</th>
                <th>Video Book</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookTypes.length > 0 ? (
                bookTypes.map((book) => (
                  <tr key={book.Book_ID}>
                    <td>{book.Book_ID}</td>
                    <td>{book.Book_Name}</td>
                    <td>{book.Physical_Book}</td>
                    <td>{book.Audio_Book}</td>
                    <td>{book.E_Book}</td>
                    <td>{book.Video_Book}</td>
                    <td>
                      <button
                        className="admin-view-book-type-edit-btn"
                        onClick={() => handleEdit(book)}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        className="admin-view-book-type-delete-btn"
                        onClick={() => handleDelete(book.Book_ID)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="admin-view-book-type-no-data">
                    No active book types found.
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

export default EmployeeManageBookType;
