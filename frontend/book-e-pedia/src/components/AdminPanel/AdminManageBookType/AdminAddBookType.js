
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import './AdminAddBookType.css';

function AdminAddBookType({ onAddBookType }) {
  const location = useLocation();
  const navigate = useNavigate();
  const bookToEdit = location.state?.book;

  // Handle Book_ID generation logic
  const [nextBookId, setNextBookId] = useState(() => {
    const storedId = parseInt(localStorage.getItem('nextBookId'), 10);
    return isNaN(storedId) ? 1 : storedId;
  });

  const generateBookId = () => {
    setNextBookId(prevId => {
      const newId = prevId + 1;
      localStorage.setItem('nextBookId', newId);
      return newId;
    });
  };

  useEffect(() => {
    if (!bookToEdit && !localStorage.getItem('nextBookId')) {
      localStorage.setItem('nextBookId', "1");
    }
  }, [bookToEdit]);

  const [formData, setFormData] = useState({
    Book_Name: bookToEdit ? bookToEdit.Book_Name : '',
    Physical_Book: '0',
    Audio_Book: '0',
    E_Book: '0',
    Video_Book: '0',
    Audio_File: null,
    Video_File: null,
    E_Book_File: null,
    IsActive: '1',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = {};
  
    // Basic validation
    if (!formData.Book_Name) {
      formErrors.Book_Name = 'Please enter Book Name';
    }
  
    setErrors(formErrors);
  
    if (Object.keys(formErrors).length === 0) {
      if (bookToEdit) {
        // If editing, update the existing book type
        fetch(`http://127.0.0.1:8000/booktypes/${bookToEdit.Book_ID}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to update book type");
          return res.json();
        })
        .then(() => {
          navigate("/admin/manage-booktype"); // Redirect after update
        })
        .catch((error) => {
          console.error("Error updating book type:", error);
        });
      } else {
        // If adding a new book type
        generateBookId();
        fetch("http://127.0.0.1:8000/booktypes/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, Book_ID: nextBookId }),
        })
        .then((res) => res.json())
        .then(() => {
          navigate("/admin/manage-booktype"); // Redirect after adding
        })
        .catch((error) => {
          console.error("Error adding book type:", error);
        });
      }
    }
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
        <div className="admin-add-book-type-container admin-add-product-container">
          <h1 className="admin-add-book-type-title admin-add-product-title">Add New Book Type</h1>
          <form onSubmit={handleSubmit} className="admin-add-book-type-form admin-add-product-form">
            <div className="form-group admin-add-product-description">
              <label htmlFor="Book_Name">Book Name</label>
              <input
                type="text"
                id="Book_Name"
                name="Book_Name"
                value={formData.Book_Name}
                onChange={handleChange}
                className="form-control"
                
              />
              {errors.Book_Name && <p className="error">*{errors.Book_Name}</p>}
            </div>

            <div className="form-group admin-add-product-field">
              <label htmlFor="Physical_Book">Physical Book</label>
              <select
                id="Physical_Book"
                name="Physical_Book"
                value={formData.Physical_Book}
                onChange={handleChange}
                className="form-control"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            <div className="form-group admin-add-product-field">
              <label htmlFor="Audio_Book">Audio Book</label>
              <select
                id="Audio_Book"
                name="Audio_Book"
                value={formData.Audio_Book}
                onChange={handleChange}
                className="form-control"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
              {formData.Audio_Book === '1' && (
                <>
                  <label htmlFor="Audio_File">Upload Audio File</label>
                  <input
                    type="file"
                    id="Audio_File"
                    name="Audio_File"
                    onChange={handleChange}
                    className="form-control"
                  />
                  {errors.Audio_File && <p className="error">{errors.Audio_File}</p>}
                </>
              )}
            </div>

            <div className="form-group admin-add-product-field">
              <label htmlFor="Video_Book">Video Book</label>
              <select
                id="Video_Book"
                name="Video_Book"
                value={formData.Video_Book}
                onChange={handleChange}
                className="form-control"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
              {formData.Video_Book === '1' && (
                <>
                  <label htmlFor="Video_File">Upload Video File</label>
                  <input
                    type="file"
                    id="Video_File"
                    name="Video_File"
                    onChange={handleChange}
                    className="form-control"
                  />
                  {errors.Video_File && <p className="error">{errors.Video_File}</p>}
                </>
              )}
            </div>

            <div className="form-group admin-add-product-field">
              <label htmlFor="E_Book">E-Book</label>
              <select
                id="E_Book"
                name="E_Book"
                value={formData.E_Book}
                onChange={handleChange}
                className="form-control"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
              {formData.E_Book === '1' && (
                <>
                  <label htmlFor="E_Book_File">Upload E-Book File</label>
                  <input
                    type="file"
                    id="E_Book_File"
                    name="E_Book_File"
                    onChange={handleChange}
                    className="form-control"
                  />
                  {errors.E_Book_File && <p className="error">{errors.E_Book_File}</p>}
                </>
              )}
            </div>

            <div className="form-group admin-add-product-description">
              <label htmlFor="IsActive">Is Active</label>
              <select
                id="IsActive"
                name="IsActive"
                value={formData.IsActive}
                onChange={handleChange}
                className="form-control"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary admin-add-product-submit-btn">Add Book Type</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminAddBookType
