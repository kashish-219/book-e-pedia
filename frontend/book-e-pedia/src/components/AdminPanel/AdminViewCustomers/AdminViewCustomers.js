import React, { useEffect, useState } from 'react';
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

// import AdminNavbar from "../AdminNavbar/AdminNavbar";
import './AdminViewCustomers.css';

function AdminViewCustomers() {
  const [customers, setCustomers] = useState([]);

  // Fetch customer details (replace with actual API call)
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Mock data for customers
        const mockCustomers = [
          {
            Cust_ID: 'CUST001',
            Fname: 'John',
            Lname: 'Doe',
            Gender: 'M',
            Email: 'john.doe@example.com',
            Phone_Number: '1234567890',
            Building: '123',
            Street: 'Main Street',
            City: 'Springfield',
            State: 'Illinois',
            Country: 'USA',
            Pincode: '62704',
            IsActive: '1',
          },
          {
            Cust_ID: 'CUST002',
            Fname: 'Jane',
            Lname: 'Smith',
            Gender: 'F',
            Email: 'jane.smith@example.com',
            Phone_Number: '0987654321',
            Building: '456',
            Street: 'Elm Street',
            City: 'Metropolis',
            State: 'New York',
            Country: 'USA',
            Pincode: '10101',
            IsActive: '0',
          },
        ];
  
        // Simulating API response
        setCustomers(mockCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
  
    fetchCustomers();
  }, []);
  

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Top Navbar */}
      <div className={`top-main-dashboard-navbar  ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      {/* Sidebar */}
      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Main Content */}
      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
      
    <div className="admin-view-book-type-containe" >
    
      <h1 className="admin-view-book-type-title">Customer Details</h1>
      <table className="admin-view-book-type-table">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.Cust_ID}>
              <td>{customer.Cust_ID}</td>
              <td>{customer.Fname}</td>
              <td>{customer.Lname}</td>
              <td>{customer.Gender === 'M' ? 'Male' : 'Female'}</td>
              <td>{customer.Email}</td>
              <td>{customer.Phone_Number}</td>
              <td>
                {customer.Building}, {customer.Street}, {customer.City}, {customer.State}, {customer.Country} - {customer.Pincode}
              </td>
              <td>{customer.IsActive === '1' ? 'Active' : 'Inactive'}</td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      </div>
      </div>
  );
}

export default AdminViewCustomers;
