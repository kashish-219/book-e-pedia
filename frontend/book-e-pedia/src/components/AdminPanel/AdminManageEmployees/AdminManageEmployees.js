import React, { useState, useEffect } from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import { Link, useNavigate } from "react-router-dom";
import "./AdminManageEmployees.css";

function AdminManageEmployees() {
  const [employeeList, setEmployeeList] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch only active employees from the endpoint.
    fetch("http://127.0.0.1:8000/employees/?is_active=1")
      .then((res) => res.json())
      .then((data) => {
        // Filter on the frontend: only include employees where IsActive === "1"
        const activeEmployees = data.filter(
          (employee) => employee.IsActive === "1"
        );
        setEmployeeList(activeEmployees);
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  const handleEdit = (employee) => {
    navigate("/admin/add-employees", { state: { employee } });
  };

  const handleDelete = (id) => {
    // Send a request to update the employee's IsActive status to '0'
    fetch(`http://127.0.0.1:8000/employees/${id}/`, {
      method: "PUT", // Ensure your backend supports PUT for deactivation
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ IsActive: "0" }),
    })
      .then((response) => {
        if (response.ok) {
          // Remove the deactivated employee from the displayed list
          setEmployeeList((prevList) =>
            prevList.filter((employee) => employee.Emp_ID !== id)
          );
        } else {
          console.error("Failed to deactivate employee");
        }
      })
      .catch((error) => console.error("Error deactivating employee:", error));
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
          <Link 
      to="/admin/add-employees" 
      state={{ employee: null }} // Ensure a blank form opens
      className="btn btn-primary"
    >
      <i className="fa fa-plus-circle"></i> Add Employee
    </Link>


        <div className="admin-view-book-type-container">
          <h1 className="admin-view-book-type-title">Employee List</h1>
          <table className="admin-view-book-type-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Photo</th>
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
                  <td colSpan="8">No Employees available</td>
                </tr>
              ) : (
                employeeList.map((employee) => (
                  <tr key={employee.Emp_ID}>
                    <td>{employee.Emp_ID}</td>
                    <td>
                      {employee.Emp_Photo ? (
                        <img
                          src={
                            employee.Emp_Photo.startsWith("http")
                              ? employee.Emp_Photo
                              : `http://127.0.0.1:8000/${employee.Emp_Photo}`
                          }
                          alt="Employee"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        />
                      ) : (
                        "No Photo"
                      )}
                    </td>
                    <td>{employee.Fname}</td>
                    <td>{employee.Lname}</td>
                    <td>{employee.email}</td>
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

// import React, { useState, useEffect } from "react";
// import AdminSidebar from "../AdminSidebar/AdminSidebar";
// import AdminNavbar from "../AdminNavbar/AdminNavbar";
// import { Link, useNavigate } from "react-router-dom";
// import "./AdminManageEmployees.css";

// function AdminManageEmployees() {
//   const [employeeList, setEmployeeList] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch only active employees from the endpoint.
//     fetch("http://127.0.0.1:8000/employees/?is_active=1")
//       .then((res) => res.json())
//       .then((data) => {
//         // Filter on the frontend: only include employees where IsActive === "1"
//         const activeEmployees = data.filter(
//           (employee) => employee.IsActive === "1"
//         );
//         setEmployeeList(activeEmployees);
//       })
//       .catch((error) => console.error("Error fetching employees:", error));
//   }, []);

//   const handleEdit = (employee) => {
//     navigate("/admin/add-employees", { state: { employee } });
//   };

//   const handleDelete = (id) => {
//     // Send a request to update the employee's IsActive status to '0'
//     fetch(`http://127.0.0.1:8000/employees/${id}/`, {
//       method: 'PUT', // Ensure your backend supports PUT for deactivation
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ IsActive: '0' }),
//     })
//       .then((response) => {
//         if (response.ok) {
//           // Remove the deactivated employee from the displayed list
//           setEmployeeList((prevList) =>
//             prevList.filter((employee) => employee.Emp_ID !== id)
//           );
//         } else {
//           console.error("Failed to deactivate employee");
//         }
//       })
//       .catch((error) => console.error("Error deactivating employee:", error));
//   };

//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const handleSidebarToggle = () => {
//     setIsSidebarCollapsed(!isSidebarCollapsed);
//   };

//   return (
//     <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
//       <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
//         <AdminNavbar onToggleSidebar={handleSidebarToggle} />
//       </div>

//       <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
//         <AdminSidebar isCollapsed={isSidebarCollapsed} />
//       </div>

//       <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
//         <Link to="/admin/add-employees" className="btn btn-primary">
//           <i className="fa fa-plus-circle"></i> Add Employee
//         </Link>

//         <div className="admin-view-book-type-container">
//           <h1 className="admin-view-book-type-title">Employee List</h1>
//           <table className="admin-view-book-type-table">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Photo</th>
//                 <th>First Name</th>
//                 <th>Last Name</th>
//                 <th>Email</th>
//                 <th>Phone</th>
//                 <th>Designation</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {employeeList.length === 0 ? (
//                 <tr>
//                   <td colSpan="8">No Employees available</td>
//                 </tr>
//               ) : (
//                 employeeList.map((employee) => (
//                   <tr key={employee.Emp_ID}>
//                     <td>{employee.Emp_ID}</td>
//                     <td>
//                       {employee.Emp_Photo ? (
//                         <img
//                           src={employee.Emp_Photo.startsWith("http") ? employee.Emp_Photo : `http://127.0.0.1:8000/${employee.Emp_Photo}`}
//                           alt="Employee"
//                           style={{ width: "50px", height: "50px", objectFit: "cover" }}
//                         />
//                       ) : (
//                         "No Photo"
//                       )}
//                     </td>
//                     <td>{employee.Fname}</td>
//                     <td>{employee.Lname}</td>
//                     <td>{employee.email}</td>
//                     <td>{employee.Phone_Number}</td>
//                     <td>{employee.Designation}</td>
//                     <td>
//                       <button
//                         className="admin-view-book-type-edit-btn"
//                         onClick={() => handleEdit(employee)}
//                       >
//                         <i className="fa-solid fa-pen"></i>
//                       </button>
//                       <button
//                         className="admin-view-book-type-delete-btn"
//                         onClick={() => handleDelete(employee.Emp_ID)}
//                       >
//                         <i className="fa-solid fa-trash-can"></i>
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminManageEmployees;
