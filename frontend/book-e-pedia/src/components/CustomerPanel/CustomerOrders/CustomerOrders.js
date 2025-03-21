import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom"; // Import Link
import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";
import './CustomerOrders.css';
import p1 from './download(1).jpeg'; // Placeholder image

function CustomerOrders() {
  const baseUrl = "http://127.0.0.1:8000/api";
  const customerId = localStorage.getItem('customer_id');
  const [OrderItems, setOrderItems] = useState([]);

  useEffect(() => {
    fetchData(`${baseUrl}/customer/${customerId}/orders`);
  }, []);

  function fetchData(baseurl) {
    fetch(baseurl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log the entire data structure
        if (data && Array.isArray(data.data)) {
          setOrderItems(data.data); // Set OrderItems to the data array
        } else {
          console.error("Expected an array but got:", data);
          setOrderItems([]); // Set to empty array if not an array
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setOrderItems([]); // Set to empty array on error
      });
  }

  // Group order items by MasterOrder_ID
  const groupedOrders = OrderItems.reduce((acc, item) => {
    const masterOrderId = item.MasterOrder_ID; // Get the MasterOrder_ID
    if (!acc[masterOrderId]) {
      acc[masterOrderId] = {
        MasterOrder_ID: masterOrderId,
        order_details: [], // Initialize an empty array for order details
        totalAmount: 0 // Initialize total amount
      };
    }
    acc[masterOrderId].order_details.push(item); // Push the current item to the order details
    acc[masterOrderId].totalAmount += parseFloat(item.T_amount); // Calculate total amount
    return acc;
  }, {});

  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null); // State to hold the order status

  // Toggle the visibility of order details
  const toggleOrderDetails = (orderId, status) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null); // Collapse the details if already expanded
      setOrderStatus(null); // Clear the order status
    } else {
      setExpandedOrder(orderId); // Expand the details for the selected order
      setOrderStatus(status); // Set the order status to display
    }
  };

  const masterOrderCount = Object.keys(groupedOrders).length;

  return (
    <div className="cust-order-body">
      <CustomerSidebar />
      <div className="cust-order-content">
        <div className="cust-order-header">
          <h1>Order History</h1>
          <span style={{ color: 'white' }}>{masterOrderCount} Orders</span>
        </div>

        {Object.keys(groupedOrders).length > 0 ? (
          Object.values(groupedOrders).map((masterOrder) => (
            <div className="cust-order-card text-center" key={masterOrder.MasterOrder_ID}>
              <h3>Master Order ID: {masterOrder.MasterOrder_ID}</h3>
              
              <div className="cust-order-details">
                {masterOrder.order_details.map((orderDetail) => (
                  <div key={orderDetail.Order_ID} className="cust-order-product">
                    <Link to={`/product/${orderDetail.product_details?.Product_Name.replace(/\s+/g, '-').toLowerCase()}/${orderDetail.product_details?.Product_ID}`}>
                      <img 
                        src={orderDetail.product_details?.Cover_Photo || p1} 
                        alt={orderDetail.product_details?.Product_Name} 
                        className="product-image"
                        // className="product-image-child" // Add a class for styling
                      />
                    </Link>
                    <div className="cust-order-info">
                      <Link to={`/product/${orderDetail.product_details?.Product_Name.replace(/\s+/g, '-').toLowerCase()}/${orderDetail.product_details?.Product_ID}`}>
                        <p><strong>Product Name:</strong> {orderDetail.product_details?.Product_Name}</p>
                      </Link>
                      <p><strong>Quantity:</strong> {orderDetail.Product_Quantity}</p>
                      <p><strong>Price:</strong> Rs. {orderDetail.Product_Price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p><strong>Total Amount for this Master Order:</strong> Rs. {masterOrder.totalAmount.toFixed(2)}</p>
              <div className="cust-order-actions">
                <button 
                  className="cust-order-btn-track" 
                  onClick={() => toggleOrderDetails(masterOrder.MasterOrder_ID, masterOrder.order_details[0].Order_Status)} // Pass the order status
                >
                  <i className="fas fa-truck"></i> Track Order
                </button>
                <NavLink to="/invoice" className="cust-order-btn-invoice">
                  <i className="fas fa-file-alt"></i> Get Invoice
                </NavLink>
              </div>
              {/* Display Order Tracking History if Expanded */}
              {expandedOrder === masterOrder.MasterOrder_ID && orderStatus && (
                <div className="order-tracking-info">
                  <p><strong>Tracking Info:</strong> {orderStatus}</p> {/* Display the order status */}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default CustomerOrders;


// import React, { useEffect, useState } from "react";
// import { NavLink } from "react-router-dom";
// import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";
// import './CustomerOrders.css';
// import p1 from './download(1).jpeg'; // Placeholder image

// function CustomerOrders() {
//   const baseUrl = "http://127.0.0.1:8000/api";
//   const customerId = localStorage.getItem('customer_id');
//   const [OrderItems, setOrderItems] = useState([]);

//   useEffect(() => {
//     fetchData(baseUrl + '/customer/' + customerId + '/orders');
//   }, []);

//   function fetchData(baseurl) {
//     fetch(baseurl)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data); // Log the entire data structure
//         if (data && Array.isArray(data.data)) {
//           setOrderItems(data.data); // Set OrderItems to the data array
//         } else {
//           console.error("Expected an array but got:", data);
//           setOrderItems([]); // Set to empty array if not an array
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setOrderItems([]); // Set to empty array on error
//       });
//   }

//   // Group order items by MasterOrder_ID
//   const groupedOrders = OrderItems.reduce((acc, item) => {
//     const masterOrderId = item.MasterOrder_ID; // Get the MasterOrder_ID
//     if (!acc[masterOrderId]) {
//       acc[masterOrderId] = {
//         MasterOrder_ID: masterOrderId,
//         order_details: [], // Initialize an empty array for order details
//         totalAmount: 0 // Initialize total amount
//       };
//     }
//     acc[masterOrderId].order_details.push(item); // Push the current item to the order details
//     acc[masterOrderId].totalAmount += parseFloat(item.T_amount); // Calculate total amount
//     return acc;
//   }, {});

//   const [expandedOrder, setExpandedOrder] = useState(null);

//   // Toggle the visibility of order details
//   const toggleOrderDetails = (orderId) => {
//     if (expandedOrder === orderId) {
//       setExpandedOrder(null); // Collapse the details if already expanded
//     } else {
//       setExpandedOrder(orderId); // Expand the details for the selected order
//     }
//   };

//   return (
//     <div className="cust-order-body">
//       <CustomerSidebar />
//       <div className="cust-order-content">
//         <div className="cust-order-header">
//           <h1>Order History</h1>
//           <span>{OrderItems.length} Orders</span>
//         </div>

//         {Object.keys(groupedOrders).length > 0 ? (
//           Object.values(groupedOrders).map((masterOrder) => (
//             <div className="cust-order-card" key={masterOrder.MasterOrder_ID}>
//               <h3>Master Order ID: {masterOrder.MasterOrder_ID}</h3>
//               <div className="cust-order-details">
//                 {masterOrder.order_details.map((orderDetail) => (
//                   <div key={orderDetail.Order_ID} className="cust-order-product">
//                     <img 
//                       src={orderDetail.product_details?.Cover_Photo || p1} 
//                       alt={orderDetail.product_details?.Product_Name} 
//                       className="product-image" // Add a class for styling
//                     />
//                     <div className="cust-order-info">
//                       <p><strong>Product Name:</strong> {orderDetail.product_details?.Product_Name}</p>
//                       <p><strong>Quantity:</strong> {orderDetail.Product_Quantity}</p>
//                       <p><strong>Price:</strong> Rs. {orderDetail.Product_Price}</p>
//                     </div>
//                     {/* Display Order Tracking History if Expanded */}
//                     {expandedOrder === orderDetail.Order_ID && (
//                       <div className="order-tracking-info">
//                         <p><strong>Tracking Info:</strong> Your order is on the way!</p>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               <p><strong>Total Amount for this Master Order:</strong> Rs. {masterOrder.totalAmount.toFixed(2)}</p>
//               <div className="cust-order-actions">
//                 <button 
//                   className="cust-order-btn-track" 
//                   onClick={() => toggleOrderDetails(masterOrder.MasterOrder_ID)}
//                 >
//                   <i className="fas fa-truck"></i> Track Order
//                 </button>
//                 <NavLink to="/invoice" className="cust-order-btn-invoice">
//                   <i className="fas fa-file-alt"></i> Get Invoice
//                 </NavLink>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No orders found.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default CustomerOrders;

    //  <div className="cust-order-body">
//       <CustomerSidebar />
//       <div className="cust-order-content">
//         <div className="cust-order-header">
//           <h1>Order History</h1>
//           <span>{OrderItems.length} Orders</span>
//         </div>

//         {OrderItems.map((item) => (
//       <div className="cust-order-card" key={item.MasterOrder_ID}>
//         <h3>{item.Order_Status}</h3>
//         <div className="cust-order-details">
//           {item.order_details.map((orderDetail) => (
//             <div key={orderDetail.Order_ID} className="cust-order-product">
//               <img src={orderDetail.product_details.Cover_Photo || p1} alt={orderDetail.product_details.Product_Name} />
//               <div className="cust-order-info">
//                 <p>{orderDetail.product_details.Product_Name}</p>
//                 <p>Quantity: {orderDetail.Product_Quantity}</p>
//                 <p>Price: ${orderDetail.Product_Price}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//     {/* Other UI elements */}
//   </div>
// ))}
//       </div>
//     </div>

// import React, { useEffect, useState } from "react";
// import { NavLink } from "react-router-dom";
// import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";
// import './CustomerOrders.css';
// import p1 from './download(1).jpeg';
// import p2 from './download (2).jpeg';
// import p3 from './epic.jpeg';
// import p4 from './gatsby.jpeg';

// function CustomerOrders() {
//   const baseUrl = "http://127.0.0.1:8000/api";
//   const customerId = localStorage.getItem('customer_id');
//   const [OrderItems, setOrderItems] = useState([]);

//   useEffect(()=> {
//     fetchData(baseUrl+'/customer/'+customerId+'/orders');
//   },[])

//   function fetchData(baseurl) {
//     fetch(baseurl)
//     .then((response) => response.json())
//     .then((data) => {
//         console.log(data); // Log the data to see its structure
//         if (Array.isArray(data.data)) {
//             setOrderItems(data.data); // Set OrderItems to the data array
//         } else {
//             console.error("Expected an array but got:", data);
//             setOrderItems([]); // Set to empty array if not an array
//         }
//     })
//     .catch((error) => {
//         console.error("Error fetching data:", error);
//         setOrderItems([]); // Set to empty array on error
//     });
// }
//     console.log(OrderItems);



//   // State to handle which order is expanded for tracking
//   // const [expandedOrder, setExpandedOrder] = useState(null);

//   // Toggle the visibility of order details
//   const toggleOrderDetails = (orderId) => {
//     // if (expandedOrder === orderId) {
//     //   setExpandedOrder(null); // Collapse the details if already expanded
//     // } else {
//     //   setExpandedOrder(orderId); // Expand the details for the selected order
//     // }
//   };

//   // Sample tracking events for each order
//   // const orderTrackingHistory = {
//   //   1: [
//   //     { date: "10 March 2025", status: "Order Placed" },
//   //     { date: "12 March 2025", status: "Shipped" },
//   //     { date: "13 March 2025", status: "Out for Delivery" },
//   //     { date: "20 March 2025", status: "Expected Delivery" },
//   //   ],
//   //   2: [
//   //     { date: "20 June 2025", status: "Order Placed" },
//   //     { date: "21 June 2025", status: "Shipped" },
//   //     { date: "23 June 2025", status: "Delivered" },
//   //   ],
//   //   3: [
//   //     { date: "10 December 2016", status: "Order Placed" },
//   //     { date: "12 December 2016", status: "Shipped" },
//   //     { date: "15 December 2016", status: "Delivered" },
//   //   ]
//   // };

//   return (
//     <div className="cust-order-body">
//       <CustomerSidebar />
//       <div className="cust-order-content">
//         <div className="cust-order-header">
//           <h1>Order History</h1>
//           <span>3 Orders</span>
//         </div>

//         {
//           OrderItems.map((item,index)=>{
//             return(
//               <div className="cust-order-card">
//                   <h3>Dispatched</h3>
//                   <div className="cust-order-details">
//                     <img src={p1} alt="Product 1" />
//                     <div className="cust-order-info">
//                       <p>Sage the Power</p>
//                     </div>
//                   </div>
//                   <div className="cust-order-actions">
//                     <button className="cust-order-btn-track" onClick={() => toggleOrderDetails(1)}>
//                       <i className="fas fa-truck"></i> Track Order
//                     </button>
//                     <NavLink to="/invoice" className="cust-order-btn-invoice">
//                       <i className="fas fa-file-alt"></i> Get Invoice
//                     </NavLink>
//                   </div>

//                   {/* Display Order Tracking History if Expanded */}
//                 {/* {expandedOrder === 1 && (
//                   <div className="order-tracking-info">
//                     {orderTrackingHistory[1].map((event, index) => (
//                       <p key={index}><strong>{event.date}:</strong> {event.status}</p>
//                     ))}
//                   </div>
//                 )} */}
//                     </div> 
//             )
//           })
//         }
//         </div>
//       </div>
//   );
// }

// export default CustomerOrders;

 