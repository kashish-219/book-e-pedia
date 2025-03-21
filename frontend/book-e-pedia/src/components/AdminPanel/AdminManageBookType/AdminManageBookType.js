import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import './AdminManageBookType.css';

function AdminManageBookType() {
  const [bookTypes, setBookTypes] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // Fetch the book types from the backend API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/booktypes/") // Ensure the endpoint is correct
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data); // Log data to check structure
        const activeBookTypes = data.data.filter(book => book.IsActive === "1");
        setBookTypes(activeBookTypes); // Only store active book types
      })
      .catch((error) => {
        console.error("Error fetching book types:", error);
      });
  }, []);

  const handleEdit = (book) => {
    navigate("/admin/add-booktype", { state: { book } });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book type?")) {
      fetch(`http://127.0.0.1:8000/booktypes/${id}/`, {
        method: "PATCH",  // Using PATCH to mark as inactive
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ IsActive: "0" }), // Set status to inactive
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to update status");
          }
          return res.json();
        })
        .then(() => {
          // Remove the book from the displayed list after deletion
          setBookTypes((prevBookTypes) => 
            prevBookTypes.filter((book) => book.Book_ID !== id)
          );
        })
        .catch((error) => {
          console.error("Error updating book type:", error);
        });
    }
  };

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
        <Link to="/admin/add-booktype" className="btn btn-primary">
          Add New Book Type
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
                <th>Is Active</th>
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
                    <td>{book.IsActive === "1" ? "Active" : "Inactive"}</td>
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
                  <td colSpan="8" className="admin-view-book-type-no-data">
                    No book types found.
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

export default AdminManageBookType;
