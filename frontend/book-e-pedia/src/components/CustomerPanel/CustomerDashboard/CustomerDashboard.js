import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import CustomerSidebar from '../CustomerSidebar/CustomerSidebar';
import './CustomerDashboard.css';
import p1 from './p1.jpeg';

function CustomerDashboard() {
  const baseUrl = "http://127.0.0.1:8000/api";
  const customerId = localStorage.getItem('customer_id'); // Get customer ID from local storage
  const [OrderItems, setOrderItems] = useState([]);
  const [customerName, setCustomerName] = useState(''); // State to hold the customer's name

  useEffect(() => {
    if (customerId) {
      fetchOrders();
      fetchCustomerDetails();
    }
  }, [customerId]);

  function fetchOrders() {
    fetch(`${baseUrl}/customer/${customerId}/orders`)
      .then(response => response.json())
      .then(data => {
        if (data && Array.isArray(data.data)) {
          setOrderItems(data.data);
        } else {
          setOrderItems([]);
        }
      })
      .catch(error => console.error("Error fetching orders:", error));
  }

  function fetchCustomerDetails() {
    fetch(`${baseUrl}/customer/${customerId}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.Fname) { // Use Fname instead of first_name
          setCustomerName(data.Fname);
        } else {
          setCustomerName("User"); // Fallback
        }
      })
      .catch(error => console.error("Error fetching customer details:", error));
  }
  

  if (!customerId) {
    return <p>Please log in to view your dashboard.</p>;
  }

  const uniqueBooks = Array.from(new Map(OrderItems.map(item => [item.product_details.Product_ID, item])).values());

  return (
    <div>
      <div className="cust-body">
        <CustomerSidebar />

        <div className="cust-main-content">
          <div className="cust-header">
            <h1>Welcome, {customerName}!</h1>
          </div>

          <h2>Your Bookshelf</h2>
          <div className="cust-ordered-books">
            {uniqueBooks.map(orderDetail => (
              <div key={orderDetail.Order_ID} className="cust-book-card">
                <Link to={`/product/${orderDetail.product_details?.Product_Name.replace(/\s+/g, '-').toLowerCase()}/${orderDetail.product_details?.Product_ID}`}>
                  <img src={orderDetail.product_details?.Cover_Photo || p1} alt="Book Cover" className="cust-book-image" />
                </Link>
                <h3 style={{ fontSize: '18px' }}>{orderDetail.product_details?.Product_Name}</h3>
                <NavLink to="/audio-book">
                  <i className="fa fa-headphones" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>
                </NavLink>
                <NavLink to="/video-book">
                  <i className="fa-solid fa-file-video" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>
                </NavLink>
                <NavLink to="/e-book">
                  <i className="fa fa-book-reader" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
