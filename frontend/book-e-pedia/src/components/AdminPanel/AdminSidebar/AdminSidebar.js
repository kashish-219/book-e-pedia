// export default AdminSidebar;
import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
import "./AdminSidebar.css";
import { Link } from "react-router-dom";

const AdminSidebar = ({ isCollapsed }) => {
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  return (
    <div className={`sidebar pe-4 pb-3 ${isCollapsed ? "collapsed" : ""}`}>
      <nav className="navbar bg-light navbar-light sidear-exclude-navbar">
        <Link to="/admin/dashboard" className="navbar-brand mx-4 mb-3">
          <h3 className="text-primary">
            <i className="fa fa-book-open-reader"></i> BOOK-E-PEDIA
          </h3>
        </Link>
        <div className="d-flex align-items-center ms-4 mb-4 border-profile-admin">
          <div className="position-relative">
            <i className="fa fa-user"></i>
            <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
          </div>
          <div className="ms-3">
            
            {/* <span className="admin-text">Admin</span> */}
            <h6 className="mb-0">Welcome, </h6>
            <h6 className="mb-0">Admin</h6>
          </div>
        </div>
        <div className="navbar-nav w-100">
          <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? "nav-item nav-link nav-link-title active" : "nav-item nav-link nav-link-title")}>
            <i className="fa fa-tachometer-alt me-2"></i><span className=" fa-sidebar-icons">Dashboard</span>
          </NavLink>
              <NavLink  to="/admin/manage-employees" title="Manage Employees" className={({ isActive }) => (isActive ? "nav-item nav-link nav-link-title active" : "nav-item nav-link nav-link-title")}>
              <i className="fa-solid fa-address-card"></i><span className=" fa-sidebar-icons">Manage Employees</span>
              </NavLink>
              <NavLink to="/admin/manage-categories" title="Manage Categories" className={({ isActive }) => (isActive ? "nav-item nav-link nav-link-title active" : "nav-item nav-link nav-link-title")}>
              <i className="fa-solid fa-layer-group"></i><span className=" fa-sidebar-icons">Manage Categories</span>
              </NavLink>
              <NavLink to="/admin/manage-booktype" title="Manage Booktype" className={({ isActive }) => (isActive ? "nav-item nav-link nav-link-title active" : "nav-item nav-link nav-link-title")}>
              <i className="fa-solid fa-icons"></i><span className=" fa-sidebar-icons">Manage Booktype</span>
              </NavLink>
              <NavLink to="/admin/manage-products" title="Manage Products" className={({ isActive }) => (isActive ? "nav-item nav-link nav-link-title active" : "nav-item nav-link nav-link-title")}>
              <i className="fa-solid fa-swatchbook"></i><span className=" fa-sidebar-icons">Manage Products</span>
              </NavLink>
              <NavLink  to="/admin/manage-orders" title="Manage Orders"  className={({ isActive }) => (isActive ? "nav-item nav-link nav-link-title active" : "nav-item nav-link nav-link-title")}>
              <i className="fa-regular fa-clipboard"></i><span className=" fa-sidebar-icons">Manage Orders</span>
                  </NavLink>
              <NavLink to="/admin/view-customers" title="View Customers"  className={({ isActive }) => (isActive ? "nav-item nav-link nav-link-title active" : "nav-item nav-link nav-link-title")}>
              <i className="fa-solid fa-users"></i><span className=" fa-sidebar-icons">View Customers</span>
                  </NavLink>
              <NavLink to="/admin/manage-feedback" title="Manage Feedback"  className={({ isActive }) => (isActive ? "nav-item nav-link nav-link-title active" : "nav-item nav-link nav-link-title")}>
              <i className="fa-solid fa-comments"></i><span className=" fa-sidebar-icons">Manage Feedback</span>
                  </NavLink>
              {/* <NavLink to="/admin/reports" title="View Reports" className={({ isActive }) => (isActive ? "nav-item nav-link nav-link-title active" : "nav-item nav-link  nav-link-title")}>
                    <i className="fa-solid fa-chart-column"></i><span className=" fa-sidebar-icons">View Reports</span>
          </NavLink> */}
          <div className="nav-item dropdown">
            <span className="nav-link nav-link-title dropdown-toggle" onClick={() => setIsReportsOpen(!isReportsOpen)}>
              <i className="fa-solid fa-chart-column"></i><span className="fa-sidebar-icons">View Reports</span>
            </span>
            {isReportsOpen && (
              <div className="dropdown-menu show">
                <NavLink to="/admin/reports/customers" className="dropdown-item">Customer Reports</NavLink>
                <NavLink to="/admin/reports/orders" className="dropdown-item">Order Reports</NavLink>
                <NavLink to="/admin/reports/products" className="dropdown-item">Product Reports</NavLink>
                <NavLink to='/admin/reports/combined-reports' className="dropdown-item">Combined Reports</NavLink>
                {/* <NavLink to="/admin/reports/payments" className="dropdown-item">Payment Reports</NavLink> */}
              </div>
            )}
          </div>
          <NavLink to="/" title="View Reports" className={({ isActive }) => (isActive ? "nav-item nav-link nav-link-title active" : "nav-item nav-link  nav-link-title")} >
          <i className="fa-solid fa-arrow-right-from-bracket"></i><span className=" fa-sidebar-icons">Log Out</span>
                  </NavLink>
            </div>
          </nav>
        </div>
      );
    };
    
    
export default AdminSidebar;



// import React, { useState } from "react";
// import { NavLink, Link } from "react-router-dom";
// import "./AdminSidebar.css";

// const AdminSidebar = ({ isCollapsed }) => {
//   const [isReportsOpen, setIsReportsOpen] = useState(false);

//   return (
//     <div className={`sidebar pe-4 pb-3 ${isCollapsed ? "collapsed" : ""}`}>
//       <nav className="navbar bg-light navbar-light sidear-exclude-navbar">
//         <Link to="/admin/dashboard" className="navbar-brand mx-4 mb-3">
//           <h3 className="text-primary">
//             <i className="fa fa-book-open-reader"></i> BOOK-E-PEDIA
//           </h3>
//         </Link>
//         <div className="d-flex align-items-center ms-4 mb-4 border-profile-admin">
//           <div className="position-relative">
//             <i className="fa fa-user"></i>
//             <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
//           </div>
//           <div className="ms-3">
//             <h6 className="mb-0">Welcome, </h6>
//             <h6 className="mb-0">Admin</h6>
//           </div>
//         </div>
//         <div className="navbar-nav w-100">
//           <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? "nav-item nav-link nav-link-title active" : "nav-item nav-link nav-link-title")}>
//             <i className="fa fa-tachometer-alt me-2"></i><span className="fa-sidebar-icons">Dashboard</span>
//           </NavLink>
//           <NavLink to="/admin/manage-employees" className={({ isActive }) => (isActive ? "nav-item nav-link nav-link-title active" : "nav-item nav-link nav-link-title")}>
//             <i className="fa-solid fa-address-card"></i><span className="fa-sidebar-icons">Manage Employees</span>
//           </NavLink>
//           <NavLink to="/admin/manage-categories" className={({ isActive }) => (isActive ? "nav-item nav-link nav-link-title active" : "nav-item nav-link nav-link-title")}>
//             <i className="fa-solid fa-layer-group"></i><span className="fa-sidebar-icons">Manage Categories</span>
//           </NavLink>
//           <NavLink to="/admin/manage-products" className={({ isActive }) => (isActive ? "nav-item nav-link nav-link-title active" : "nav-item nav-link nav-link-title")}>
//             <i className="fa-solid fa-swatchbook"></i><span className="fa-sidebar-icons">Manage Products</span>
//           </NavLink>
          
//           {/* Reports Dropdown */}
          // <div className="nav-item dropdown">
          //   <span className="nav-link nav-link-title dropdown-toggle" onClick={() => setIsReportsOpen(!isReportsOpen)}>
          //     <i className="fa-solid fa-chart-column"></i><span className="fa-sidebar-icons">View Reports</span>
          //   </span>
          //   {isReportsOpen && (
          //     <div className="dropdown-menu show">
          //       <NavLink to="/admin/reports/customers" className="dropdown-item">Customer Reports</NavLink>
          //       <NavLink to="/admin/reports/orders" className="dropdown-item">Order Reports</NavLink>
          //       <NavLink to="/admin/reports/payments" className="dropdown-item">Payment Reports</NavLink>
          //     </div>
          //   )}
          // </div>
          
//           <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item nav-link nav-link-title active" : "nav-item nav-link nav-link-title")}>
//             <i className="fa-solid fa-arrow-right-from-bracket"></i><span className="fa-sidebar-icons">Log Out</span>
//           </NavLink>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default AdminSidebar;
