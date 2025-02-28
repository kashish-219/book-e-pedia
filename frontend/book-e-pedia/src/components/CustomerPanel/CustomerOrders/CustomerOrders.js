import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";
import './CustomerOrders.css';
import p1 from './download(1).jpeg';
import p2 from './download (2).jpeg';
import p3 from './epic.jpeg';
import p4 from './gatsby.jpeg';

function CustomerOrders() {
  // State to handle which order is expanded for tracking
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Toggle the visibility of order details
  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null); // Collapse the details if already expanded
    } else {
      setExpandedOrder(orderId); // Expand the details for the selected order
    }
  };

  // Sample tracking events for each order
  const orderTrackingHistory = {
    1: [
      { date: "10 March 2025", status: "Order Placed" },
      { date: "12 March 2025", status: "Shipped" },
      { date: "13 March 2025", status: "Out for Delivery" },
      { date: "20 March 2025", status: "Expected Delivery" },
    ],
    2: [
      { date: "20 June 2025", status: "Order Placed" },
      { date: "21 June 2025", status: "Shipped" },
      { date: "23 June 2025", status: "Delivered" },
    ],
    3: [
      { date: "10 December 2016", status: "Order Placed" },
      { date: "12 December 2016", status: "Shipped" },
      { date: "15 December 2016", status: "Delivered" },
    ]
  };

  return (
    <div className="cust-order-body">
      <CustomerSidebar />
      <div className="cust-order-content">
        <div className="cust-order-header">
          <h1>Order History</h1>
          <span>3 Orders</span>
        </div>

        {/* Order 1 */}
        <div className="cust-order-card">
          <h3>Dispatched</h3>
          <div className="cust-order-details">
            <img src={p1} alt="Product 1" />
            <div className="cust-order-info">
              <p>Sage the Power</p>
            </div>
          </div>
          <div className="cust-order-actions">
            <button className="cust-order-btn-track" onClick={() => toggleOrderDetails(1)}>
              <i className="fas fa-truck"></i> Track Order
            </button>
            <NavLink to="/invoice" className="cust-order-btn-invoice">
              <i className="fas fa-file-alt"></i> Get Invoice
            </NavLink>
          </div>

          {/* Display Order Tracking History if Expanded */}
          {expandedOrder === 1 && (
            <div className="order-tracking-info">
              {orderTrackingHistory[1].map((event, index) => (
                <p key={index}><strong>{event.date}:</strong> {event.status}</p>
              ))}
            </div>
          )}
        </div>

        {/* Order 2 */}
        <div className="cust-order-card">
          <h3>Delivered on 23 June</h3>
          <div className="cust-order-details">
            <img src={p2} alt="Product 2" />
            <div className="cust-order-info">
              <p>My Book Cover</p>
            </div>
          </div>
          <div className="cust-order-details">
            <img src={p3} alt="Product 3" />
            <div className="cust-order-info">
              <p>Epic Adventures</p>
            </div>
          </div>
          <div className="cust-order-actions">
            <button className="cust-order-btn-track" onClick={() => toggleOrderDetails(2)}>
              <i className="fas fa-truck"></i> Track Order
            </button>
            <NavLink to="/invoice" className="cust-order-btn-invoice">
              <i className="fas fa-file-alt"></i> Get Invoice
            </NavLink>
          </div>

          {/* Display Order Tracking History if Expanded */}
          {expandedOrder === 2 && (
            <div className="order-tracking-info">
              {orderTrackingHistory[2].map((event, index) => (
                <p key={index}><strong>{event.date}:</strong> {event.status}</p>
              ))}
            </div>
          )}
        </div>

        {/* Order 3 */}
        <div className="cust-order-card">
          <h3>Delivered on 15 December, 2016</h3>
          <div className="cust-order-details">
            <img src={p4} alt="Product 4" />
            <img src={p1} alt="Product 4" />
            <div className="cust-order-info">
              <p>The Great Gatsby</p>
            </div>
          </div>
          <div className="cust-order-actions">
            <button className="cust-order-btn-track" onClick={() => toggleOrderDetails(3)}>
              <i className="fas fa-truck"></i> Track Order
            </button>
            <NavLink to="/invoice" className="cust-order-btn-invoice">
              <i className="fas fa-file-alt"></i> Get Invoice
            </NavLink>
          </div>

          {/* Display Order Tracking History if Expanded */}
          {expandedOrder === 3 && (
            <div className="order-tracking-info">
              {orderTrackingHistory[3].map((event, index) => (
                <p key={index}><strong>{event.date}:</strong> {event.status}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerOrders;

