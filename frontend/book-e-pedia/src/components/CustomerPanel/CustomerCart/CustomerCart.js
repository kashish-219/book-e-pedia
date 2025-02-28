import React, { useContext, useEffect, useState } from "react";
import "./CustomerCart.css"; // Ensure you have this CSS file for styling
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { CartContext } from "../../../Context";
import axios from 'axios';

const CustomerCart = () => {
  const { cartData, setCartData } = useContext(CartContext);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartData")) || [];
    setCartData(storedCart); // Keep saved quantity if available
    setCartItems(storedCart); // Set local state for rendering
  }, []);

  const updateQuantity = (productId, quantity) => {
    if (quantity < 0) return; // Prevent negative quantities

    setCartData((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem("cartData", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const cartRemoveButtonHandler = (product_id) => {
    const updatedCart = cartData.filter(item => item.product.id !== product_id);
    localStorage.setItem("cartData", JSON.stringify(updatedCart));
    setCartData(updatedCart);
    setCartItems(updatedCart);
  };

  
  const createOrder = async () => {
    const customerId = parseInt(localStorage.getItem('customer_id')); // Ensure this is an integer
    const employeeId = 101; // Use the valid employee ID
    const orderData = {
        Cust_ID: customerId,
        Emp_ID: employeeId,
        Order_Status: 'Pending', // Set the initial order status
    };

    try {
        const response = await axios.post('http://127.0.0.1:8000/masterorders/', orderData);
        return response.data; // This should return the order ID or any relevant data
    } catch (error) {
        console.error('Error creating order:', error.response ? error.response.data : error.message); // Log the error response
        alert('Failed to create order. Please try again.');
        return null;
    }
};

// const createOrderItems = async (orderId) => {
//     const previousCart = JSON.parse(localStorage.getItem("cartData")) || [];
    
//     for (const item of previousCart) {
//         const orderItemData = {
//             MasterOrder_ID: orderId,
//             Product_ID: item.product.id,
//             Product_Quantity: item.quantity,
//             Product_Price: item.product.price,
//         };

//         try {
//             await axios.post('http://127.0.0.1:8000/api/orders/', orderItemData);
//         } catch (error) {
//             console.error('Error creating order item:', error.response ? error.response.data : error.message);
//         }
//     }
// };

// const createOrderItems = async (orderId) => {
//   const previousCart = JSON.parse(localStorage.getItem("cartData")) || [];
  
//   for (const item of previousCart) {
//       const orderItemData = {
//           MasterOrder_ID: orderId, // Ensure this is the correct ID
//           Product_ID: item.product.id, // Ensure this is the correct ID
//           Product_Quantity: item.quantity, // Ensure this is a number
//           Product_Price: item.product.price, // Ensure this is a number
//       };

//       try {
//           const response = await axios.post('http://127.0.0.1:8000/orders/', orderItemData, {
//               headers: {
//                   'Content-Type': 'application/json' // Ensure the content type is set to JSON
//               }
//           });
//           console.log('Order item created:', response.data);
//       } catch (error) {
//           console.error('Error creating order item:', error.response ? error.response.data : error.message);
//       }
//   }
// };

const createOrderItems = async (orderId) => {
  const previousCart = JSON.parse(localStorage.getItem("cartData")) || [];
  
  for (const item of previousCart) {
      const orderItemData = {
          MasterOrder_ID: orderId,
          Product_ID: item.product.id,
          Product_Quantity: item.quantity,
          Product_Price: parseFloat(item.product.price), // Ensure this is a number
          T_amount: parseFloat(item.product.price) * item.quantity // Calculate T_amount
      };

      try {
          const response = await axios.post('http://127.0.0.1:8000/api/orders/', orderItemData);
          console.log('Order item created:', response.data);
      } catch (error) {
          console.error('Error creating order item:', error.response ? error.response.data : error.message);
      }
  }
};

  const handleProceedToPayment = async () => {
    const order = await createOrder();
    if (order) {
      await createOrderItems(order.MasterOrder_ID); // Create order items
      // Navigate to the payment page with the order ID
      navigate('/payment', { state: { orderId: order.MasterOrder_ID } });
    }
  };

  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cartData")) || [];
    
    // Check if the product is already in the cart
    const existingProduct = existingCart.find(item => item.product.id === product.id);
    
    if (existingProduct) {
      // If the product is already in the cart, update the quantity
      existingProduct.quantity += 1; // or set to a specific quantity
    } else {
      // If the product is not in the cart, add it
      existingCart.push({ product, quantity: 1 }); // or set to a specific quantity
    }
    
    // Save the updated cart to local storage
    localStorage.setItem("cartData", JSON.stringify(existingCart));
    setCartData(existingCart); // Update the context state if using context
  };

  return (
    <div className="cart-body">
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <div className="cart-products">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.product.id} className="cart-product">
                <div className="cart-product-details">
                  <img src={item.product.image} alt={item.product.prod_name} />
                  <span className="cart-product-name">
                    {item.product.prod_name} <br /> Rs. {item.product.price}
                  </span>
                </div>
                <div className="cart-quantity">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                    min="1"
                  />
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                </div>
                <span className="cart-total-amount">Rs. {(item.product.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => cartRemoveButtonHandler(item.product.id)} className="cart-remove-button">Remove</button>
              </div>
            ))
          ) : (
            <p>No items in the cart.</p>
          )}
        </div>
        <div className="cart-total">Total: Rs. {cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)}</div>
        {cartItems.length > 0 && (
          <div className="cart-make-payment">
            <button onClick={handleProceedToPayment} className="cart-confirm-payment-btn">Proceed to Payment</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerCart;
// import React, { useContext, useEffect, useState } from "react";
// import "./CustomerCart.css"; // Ensure you have this CSS file for styling
// // import book1 from './download(1).jpeg'; // Example image
// // import book2 from './download (2).jpeg'; // Example image
// import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
// import { Nav } from "react-bootstrap";
// import { CartContext } from "../../../Context";
// import axios from 'axios';

// const CustomerCart = () => {
//   const { cartData, setCartData } = useContext(CartContext);
//   const [productData, setproductData] = useState([]);
//   const [cartButtonClickStatus,setcartButtonClickStatus] = useState(false);
//   const navigate = useNavigate();

//   if (cartData == null || cartData.length == 0) {
//     var cartItems = 0;
//   } else {
//     var cartItems = cartData.length;
//   }

//   var sum = 0;
//   if (cartData && cartData.length > 0) {
//     sum = cartData.reduce((total, item) => {
//       return total + parseFloat(item.product.price) * (item.quantity ?? 1);
//     }, 0);
//   }
//   sum = parseFloat(sum.toFixed(2)); // Keep 2 decimal places

//   const cartRemoveButtonHandler = (product_id) => {
//     var previousCart = localStorage.getItem("cartData");
//     var cartJson = JSON.parse(previousCart);
//     cartJson.map((cart, index) => {
//       if (cart != null && cart.product.id == product_id) {
//         // delete cartJson[index];
//         cartJson.splice(index, 1);
//       }
//     });
//     var cartString = JSON.stringify(cartJson);
//     localStorage.setItem("cartData", cartString);
//     setcartButtonClickStatus(false)
//     setCartData(cartJson);
//   };

//   // const navigate = useNavigate();
//   // const [cart, setCart] = useState([]);

//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cartData")) || [];
//     setCartData(storedCart); // ✅ Keep saved quantity if available
//   }, []);

//   // const removeFromCart = (id) => {
//   //   setCart((prevCart) => prevCart.filter((item) => item.id !== id));
//   // };

//   // const calculateTotal = () => {
//   //   return cartData.reduce((total, item) => total + item.price * item.quantity, 0);
//   // };

//   // const makePayment = () => {
//   //   alert('Payment successful! Thank you for your purchase.');
//   //   setCart([]); // Clear the cart after payment
//   //   localStorage.removeItem('cart'); // Clear cart from local storage
//   // };

//   // const handlePayment = () => {
//   //   const totalAmount = calculateTotal();
//   //   // Navigate to the payment page and pass the total amount
//   //   navigate('/payment', { state: { totalAmount } });
//   // };

//   const updateQuantity = (productId, quantity) => {
//     if (quantity < 0) return; // Prevent negative quantities

//     setCartData((prevCart) => {
//         // If quantity is zero, filter out the item
//         if (quantity === 0) {
//             const updatedCart = prevCart.filter(item => item.product.id !== productId);
//             // Update localStorage to persist changes
//             localStorage.setItem("cartData", JSON.stringify(updatedCart));
//             return updatedCart;
//         } else {
//             // Otherwise, update the quantity
//             const updatedCart = prevCart.map((item) =>
//                 item.product.id === productId ? { ...item, quantity } : item
//             );
//             // Update localStorage to persist changes
//             localStorage.setItem("cartData", JSON.stringify(updatedCart));
//             return updatedCart;
//         }
//     });
// };

// const createOrder = async () => {
//   const customerId = localStorage.getItem('customer_id'); // Get the customer ID
//   const employeeId = 1; // Assuming you have a default employee ID or fetch it as needed
//   const orderData = {
//     Cust_ID: customerId,
//     Emp_ID: employeeId,
//     Order_Status: 'Pending', // Set the initial order status
//   };

//   try {
//     const response = await axios.post('http://127.0.0.1:8000/api/masterorders/', orderData);
//     return response.data; // This should return the order ID or any relevant data
//   } catch (error) {
//     console.error('Error creating order:', error);
//     alert('Failed to create order. Please try again.');
//     return null;
//   }
// };

// const handleProceedToPayment = async () => {
//   const order = await createOrder();
//   if (order) {
//     // Navigate to the payment page with the order ID
//     navigate('/payment', { state: { orderId: order.MasterOrder_ID, totalAmount: sum } });
//   }
// };



//   return (
//     <div className="cart-body">
//       <div className="cart-container">
//         <h1>Shopping Cart</h1>

//         <div className="cart-products">
//           {cartItems > 0 ? (
//             cartData.map((item) => (
//               <div key={item.product.id} className="cart-product">
//                 <div className="cart-product-details">
//                   <img src={item.product.image} alt={item.product.prod_name} />
//                   <span className="cart-product-name">
//                     {item.product.prod_name} <br /> Rs. {item.product.price}
//                   </span>
//                 </div>
//                 <div className="cart-quantity">
//                   <button
//                     onClick={() =>
//                       updateQuantity(item.product.id, item.quantity - 1)
//                     }
//                   >
//                     -
//                   </button>
//                   <input
//                     type="number"
//                     value={item.quantity}
//                     onChange={(e) =>
//                       updateQuantity(item.product.id, parseInt(e.target.value))
//                     }
//                     min="1"
//                   />
//                   <button
//                     onClick={() =>
//                       updateQuantity(item.product.id, item.quantity + 1)
//                     }
//                   >
//                     +
//                   </button>
//                 </div>
//                 <span className="cart-total-amount">
//                   Rs. {(item.product.price * item.quantity).toFixed(2)}
//                 </span>

//                 <button
//                   onClick={() => cartRemoveButtonHandler(item.product.id)}
//                   className="cart-remove-button"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))
//           ) : (
//             <p>No items in the cart.</p>
//           )}
//         </div>

//         <div className="cart-total">Total: Rs. {sum}</div>

//         {cartItems > 0 && (
//   <div className="cart-make-payment">
//     <button onClick={handleProceedToPayment} className="cart-confirm-payment-btn">
//       Proceed to Payment
//     </button>
//   </div>
// )}

//         {/* {cartItems > 0 && (
//           <div className="cart-make-payment">
//             <Link to='/payment' state={{ totalAmount: sum }}><button className="cart-confirm-payment-btn">
//               Proceed to Payment
//             </button></Link>
//           </div>
//         )} */}
//       </div>
//     </div>
//   );
// };

// export default CustomerCart;
