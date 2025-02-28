import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import './AdminAddEmployees.css';

function AdminAddEmployees({ onAddEmployee }) {
  const location = useLocation();
  const navigate = useNavigate();
  const employeeToEdit = location.state?.employee;

  // Initialize nextEmpId state with stored value or 1
  const [nextEmpId, setNextEmpId] = useState(() => {
    const storedId = parseInt(localStorage.getItem('nextEmpId'), 10);
    return isNaN(storedId) ? 1 : storedId;
  });

  // Update nextEmpId in localStorage when it changes
  useEffect(() => {
    if (!employeeToEdit) {
      localStorage.setItem('nextEmpId', nextEmpId.toString());
    }
  }, [nextEmpId, employeeToEdit]);

  // Function to generate and update Employee ID
  const generateEmployeeId = () => {
    setNextEmpId((prevId) => prevId + 1);
  };

  const [formData, setFormData] = useState({
    Emp_ID: employeeToEdit ? employeeToEdit.Emp_ID : nextEmpId,
    Emp_Type: "0",
    Fname: employeeToEdit ? employeeToEdit.Fname : "",
    Lname: employeeToEdit ? employeeToEdit.Lname : "",
    Gender: employeeToEdit ? employeeToEdit.Gender : "",
    DOB: employeeToEdit ? employeeToEdit.DOB : "",
    Email: employeeToEdit ? employeeToEdit.Email : "",
    Password: "",
    Phone_Number: employeeToEdit ? employeeToEdit.Phone_Number : "",
    Address: employeeToEdit ? employeeToEdit.Address : "",
    Salary: employeeToEdit ? employeeToEdit.Salary : "",
    Designation: employeeToEdit ? employeeToEdit.Designation : "",
    Emp_Photo: null,
    IsActive: "1",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate employee ID before submitting the form
    if (!employeeToEdit) generateEmployeeId();  // Only generate a new ID if it's a new employee

    // Update Emp_ID to the latest nextEmpId
    setFormData((prev) => ({
      ...prev,
      Emp_ID: nextEmpId,
    }));

    // Validate form before submitting
    if (validateForm()) {
      onAddEmployee(formData);
      navigate("/admin/manage-employees");
    }
  };




  const validateForm = () => {
    const newErrors = {};
    if (!formData.Fname.trim()) newErrors.Fname = "Please enter First Name.";
    else if (formData.Fname.length > 20) {
      newErrors.Fname = "First name should not be more than 20 letters.";
    }

    if (!formData.Lname.trim()) newErrors.Lname = "Please enter Last Name.";
    else if (formData.Lname.length > 25) {
      newErrors.Fname = "Last name should not be more than 25 letters.";
    }


    if (!formData.Gender) newErrors.Gender = "Please select gender.";

    if (!formData.DOB) newErrors.DOB = "Please enter date of Birth.";

    if (formData.DOB && new Date().getFullYear() - new Date(formData.DOB).getFullYear() < 18)
      newErrors.DOB = "Employee must be at least 18 years old.";

    if (!formData.Email) newErrors.Email = "Email is required.";

    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email))
      newErrors.Email = "Invalid email format.";

    if (!formData.Password) newErrors.Password = "Please enter Password.";

    else if (formData.Password.length < 8 || formData.Password.length > 15)
      newErrors.Password = "Password must be 8-15 characters.";

    if (!formData.Phone_Number) newErrors.Phone_Number = "Please enter Phone Number.";

    else if (!/^\d{10}$/.test(formData.Phone_Number))
      newErrors.Phone_Number = "Phone number must be 10 digits.";

    if (!formData.Address.trim()) newErrors.Address = "Please enter Address.";
    else if (formData.Address.length > 250) {
      newErrors.Fname = "Address should not be more than 250 letters.";
    }


    if (!formData.Salary) newErrors.Salary = "Please enter salary.";

    else if (isNaN(Number(formData.Salary)))
      newErrors.Salary = "Salary must be a valid number.";

    if (!formData.Designation.trim()) newErrors.Designation = "Please enter Designation.";
    else if (formData.Designation.length > 25) {
      newErrors.Fname = "Designation should not be more than 25 letters.";
    }


    if (!formData.Emp_Photo) newErrors.Emp_Photo = "Employee photo is required.";

    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };


  
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (validateForm()) {
  //     console.log("Form Submitted", formData);
  //     onAddEmployee(formData); // Call the function to add the employee
  //     navigate("/admin/manage-employees"); // Navigate back to the employee list
  //   }
  // };

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
        <div className="admin-add-product-container">
          <h1 className="admin-add-product-title">Add Employee</h1>
          <form onSubmit={handleSubmit} className="admin-add-product-form">
          <div className="form-row">
        <div className="admin-add-product-field">
          <label>Employee Type:</label>
          <select name="Emp_Type" value={formData.Emp_Type} onChange={handleChange}>
            <option value="1">Admin</option>
            <option value="0">Staff</option>
          </select>
              </div>
         <div className="admin-add-product-field">
          <label>Active Status:</label>
          <select name="IsActive" value={formData.IsActive} onChange={handleChange}>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        <div className="admin-add-product-field">
          <label>First Name:</label>
          <input
            type="text"
            name="Fname"
            value={formData.Fname}
            onChange={handleChange}
          />
          {errors.Fname && <p className="admin-manage-emp-error">{errors.Fname}</p>}
        </div>

        <div className="admin-add-product-field">
          <label>Last Name:</label>
          <input
            type="text"
            name="Lname"
            value={formData.Lname}
            onChange={handleChange}
          />
          {errors.Lname && <p className="admin-manage-emp-error">{errors.Lname}</p>}
        </div>

        <div className="admin-add-product-field">
          <label>Gender:</label>
          <select name="Gender" value={formData.Gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
          {errors.Gender && <p className="admin-manage-emp-error">{errors.Gender}</p>}
              </div>
              
              <div className="admin-add-product-field">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="DOB"
            value={formData.DOB}
            onChange={handleChange}
          />
          {errors.DOB && <p className="admin-manage-emp-error">{errors.DOB}</p>}
              </div>
              
        <div className="admin-add-product-field  admin-add-product-description">
          <label>Address:</label>
          <textarea
            name="Address"
            value={formData.Address}
            onChange={handleChange}
          />
          {errors.Address && <p className="admin-manage-emp-error">{errors.Address}</p>}
        </div>
        

        <div className="admin-add-product-field">
          <label>Email:</label>
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
          />
          {errors.Email && <p className="admin-manage-emp-error">{errors.Email}</p>}
        </div>

        <div className="admin-add-product-field">
          <label>Password:</label>
          <input
            type="password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
          />
          {errors.Password && <p className="admin-manage-emp-error">{errors.Password}</p>}
        </div>

        <div className="admin-add-product-field">
          <label>Phone Number:</label>
          <input
            type="text"
            name="Phone_Number"
            value={formData.Phone_Number}
            onChange={handleChange}
          />
          {errors.Phone_Number && (
            <p className="admin-manage-emp-error">{errors.Phone_Number}</p>
          )}
        </div>

        

        <div className="admin-add-product-field">
          <label>Salary:</label>
          <input
            type="text"
            name="Salary"
            value={formData.Salary}
            onChange={handleChange}
          />
          {errors.Salary && <p className="admin-manage-emp-error">{errors.Salary}</p>}
        </div>

        <div className="admin-add-product-field">
          <label>Designation:</label>
          <input
            type="text"
            name="Designation"
            value={formData.Designation}
            onChange={handleChange}
          />
          {errors.Designation && (
            <p className="admin-manage-emp-error">{errors.Designation}</p>
          )}
        </div>

        <div className="admin-add-product-field">
          <label>Employee Photo:</label>
          <input
            type="file"
            name="Emp_Photo"
            onChange={handleChange}
          />
          {errors.Emp_Photo && (
            <p className="admin-manage-emp-error">{errors.Emp_Photo}</p>
          )}
        </div>
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

          

        