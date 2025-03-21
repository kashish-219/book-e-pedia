import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "./AdminAddEmployees.css";

function AdminAddEmployees() {
  const location = useLocation();
  const navigate = useNavigate();
  const employeeToEdit = location.state?.employee;

  const [formData, setFormData] = useState({
    Emp_ID: employeeToEdit ? employeeToEdit.Emp_ID : "",
    Emp_Type: "0",
    Fname: employeeToEdit ? employeeToEdit.Fname : "",
    Lname: employeeToEdit ? employeeToEdit.Lname : "",
    Gender: employeeToEdit ? employeeToEdit.Gender : "",
    DOB: employeeToEdit ? employeeToEdit.DOB : "",
    email: employeeToEdit ? employeeToEdit.email : "",
    Password: employeeToEdit ? employeeToEdit.Password : "",
    Phone_Number: employeeToEdit ? employeeToEdit.Phone_Number : "",
    Address: employeeToEdit ? employeeToEdit.Address : "",
    Salary: employeeToEdit ? employeeToEdit.Salary : "",
    Designation: employeeToEdit ? employeeToEdit.Designation : "",
    Emp_Photo: employeeToEdit ? employeeToEdit.Emp_Photo : null,
    IsActive: employeeToEdit ? employeeToEdit.IsActive : "1",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    // (Add your validation logic here)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCSRFToken = () => {
    return document.cookie.split("; ").find(row => row.startsWith("csrftoken"))?.split("=")[1];
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const updatedValue = type === "file" ? files[0] : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  // Helper to get the image URL for preview
  const getEmployeeImageUrl = () => {
    if (!formData.Emp_Photo) return "";
    if (typeof formData.Emp_Photo === "object") {
      // New file selected—create a temporary URL.
      return URL.createObjectURL(formData.Emp_Photo);
    }
    // Otherwise, assume it's a string (the stored image path)
    // Adjust this logic if your stored value already contains the base URL.
    return `http://127.0.0.1:8000/${formData.Emp_Photo}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      let response;
      if (employeeToEdit) {
        // Update existing employee
        response = await fetch(`http://127.0.0.1:8000/api/update-employee/${formData.Emp_ID}/`, {
          method: "POST", // Adjust method if needed by your backend
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
          credentials: "include",
          body: JSON.stringify(formData),
        });
      } else {
        // Create new employee record
        response = await fetch("http://127.0.0.1:8000/api/add-employee/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
          credentials: "include",
          body: JSON.stringify(formData),
        });
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${response.status} - ${errorData.error || "Failed to save employee"}`);
      }
      const responseData = await response.json();
      console.log("Employee saved successfully!", responseData);
      navigate("/admin/manage-employees");
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  return (
    <div className="dashboard-main-container">
      <div className="top-main-dashboard-navbar">
        <AdminNavbar />
      </div>

      <div className="sidebar-main-section">
        <AdminSidebar />
      </div>

      <div className="dashboard-main-content">
        <div className="admin-add-product-container">
          <h1 className="admin-add-product-title">
            {employeeToEdit ? "Update Employee" : "Add Employee"}
          </h1>
          <form onSubmit={handleSubmit} className="admin-add-product-form">
            <div className="form-row">
              {/* Employee Type */}
              <div className="admin-add-product-field">
                <label>Employee Type:</label>
                <select name="Emp_Type" value={formData.Emp_Type} onChange={handleChange}>
                  <option value="1">Admin</option>
                  <option value="0">Staff</option>
                </select>
              </div>
              {/* Active Status */}
              <div className="admin-add-product-field">
                <label>Active Status:</label>
                <select name="IsActive" value={formData.IsActive} onChange={handleChange}>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
              {/* First Name */}
              <div className="admin-add-product-field">
                <label>First Name:</label>
                <input type="text" name="Fname" value={formData.Fname} onChange={handleChange} />
                {errors.Fname && <p className="admin-manage-emp-error">{errors.Fname}</p>}
              </div>
              {/* Last Name */}
              <div className="admin-add-product-field">
                <label>Last Name:</label>
                <input type="text" name="Lname" value={formData.Lname} onChange={handleChange} />
                {errors.Lname && <p className="admin-manage-emp-error">{errors.Lname}</p>}
              </div>
              {/* Gender */}
              <div className="admin-add-product-field">
                <label>Gender:</label>
                <select name="Gender" value={formData.Gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                {errors.Gender && <p className="admin-manage-emp-error">{errors.Gender}</p>}
              </div>
              {/* Date of Birth */}
              <div className="admin-add-product-field">
                <label>Date of Birth:</label>
                <input type="date" name="DOB" value={formData.DOB} onChange={handleChange} />
                {errors.DOB && <p className="admin-manage-emp-error">{errors.DOB}</p>}
              </div>
              {/* Address */}
              <div className="admin-add-product-field">
                <label>Address:</label>
                <textarea name="Address" value={formData.Address} onChange={handleChange} />
                {errors.Address && <p className="admin-manage-emp-error">{errors.Address}</p>}
              </div>
              {/* Email */}
              <div className="admin-add-product-field">
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                {errors.Email && <p className="admin-manage-emp-error">{errors.Email}</p>}
              </div>
              {/* Password */}
              <div className="admin-add-product-field">
                <label>Password:</label>
                <input type="text" name="Password" value={formData.Password} onChange={handleChange} />
                {errors.Password && <p className="admin-manage-emp-error">{errors.Password}</p>}
              </div>
              {/* Phone Number */}
              <div className="admin-add-product-field">
                <label>Phone Number:</label>
                <input type="text" name="Phone_Number" value={formData.Phone_Number} onChange={handleChange} />
                {errors.Phone_Number && <p className="admin-manage-emp-error">{errors.Phone_Number}</p>}
              </div>
              {/* Salary */}
              <div className="admin-add-product-field">
                <label>Salary:</label>
                <input type="text" name="Salary" value={formData.Salary} onChange={handleChange} />
                {errors.Salary && <p className="admin-manage-emp-error">{errors.Salary}</p>}
              </div>
              {/* Designation */}
              <div className="admin-add-product-field">
                <label>Designation:</label>
                <input type="text" name="Designation" value={formData.Designation} onChange={handleChange} />
                {errors.Designation && <p className="admin-manage-emp-error">{errors.Designation}</p>}
              </div>
              {/* Employee Photo Preview / File Input */}
              {employeeToEdit && formData.Emp_Photo ? (
                <div className="admin-add-product-field">
                  <label>Employee Photo:</label>
                  <img
                    src={
                      typeof formData.Emp_Photo === "object"
                        ? URL.createObjectURL(formData.Emp_Photo)
                        : `http://127.0.0.1:8000/${formData.Emp_Photo}`
                    }
                    alt="Employee"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                    onError={(e) => console.log("Image failed to load:", e.target.src)}
                  />
                </div>
              ) : (
                <input type="file" name="Emp_Photo" onChange={handleChange} />
              )}
              {/* Submit Button */}
              <button type="submit" className="admin-add-product-submit-btn">
                {employeeToEdit ? "Update Employee" : "Add Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminAddEmployees;
