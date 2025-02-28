import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';
import card from './card.png';
import { CartContext, UserContext } from '../../Context';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';

const baseUrl = "http://127.0.0.1:8000/api";

function Payment() {
    const location = useLocation();
    const orderIdFromLocation = location.state?.orderId; // Get the order ID from the state
    const [ConfirmOrder, setConfirmOrder] = useState(false);
    const [orderId, setOrderId] = useState(orderIdFromLocation || ''); // Define orderId state
    const [PayMethod, setPayMethod] = useState('');
    const userContext = useContext(UserContext);
    const { cartData, setCartData } = useContext(CartContext);

    if (userContext.login == null) {
        window.location.href = '/login';
    } else {
        if (ConfirmOrder === false) {
            addOrderInTable();
        }
    }

    function addOrderInTable() {
        const customerId = localStorage.getItem('customer_id');
        const formData = new FormData();
        formData.append('Cust_ID', customerId);
        formData.append('Emp_ID', 1); // Assuming you have a default employee ID
        formData.append('Order_Status', 'Pending'); // Set the initial order status

        // Submit Data
        axios.post(baseUrl + '/masterorders/', formData)
            .then(function(response) {
                const orderId = response.data.MasterOrder_ID;
                setOrderId(orderId); // Use setOrderId to update the state
                orderItems(orderId);
                setConfirmOrder(true);
            })
            .catch(function(error) {
                console.log(error);
                alert('Failed to create order. Please try again.'); // Alert on error
            });
    }

    function orderItems(orderId) {
        const previousCart = localStorage.getItem('cartData');
        const cartJson = JSON.parse(previousCart);

        if (cartJson != null) {
            cartJson.forEach((cart) => {
                const formData = new FormData();
                formData.append('MasterOrder_ID', orderId);
                formData.append('Product_ID', cart.product.id);
                formData.append('Product_Quantity', cart.quantity); // Use the quantity from the cart
                formData.append('Product_Price', cart.product.price);

                // Submit Data
                axios.post(baseUrl + '/orders/', formData)
                    .then(function(response) {
                        // Handle successful order item creation
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            });
        }
    }

    function changePaymentMethod(payMethod) {
        setPayMethod(payMethod);
    }

    function PayNowButton() {
        if (PayMethod !== '') {
            changePaymentMethod(PayMethod);
        } else {
            alert('Select Payment Method!!!');
        }
    }

    return (
        <div>
            <div className="payment-container">
                <div className="payment-card-section">
                    <h2>Payment</h2>
                    <div className="payment-card">
                        <img src={card} alt="Card" className="payment-card-image" />
                        <div className='card py-3 text-center'>
                            <h3> Choose a Payment Method</h3>
                            <h5>ORDER ID: {orderId}</h5>
                        </div>
                        <div className='card p-3 mt-4'>
                            <form>
                                <div className='form-group'>
                                    <label>
                                        <input type='radio' onChange={() => changePaymentMethod('paypal')} name='payMethod' /> PayPal
                                    </label>
                                </div>
                                <div className='form-group'>
                                    <label>
                                        <input type='radio' onChange={() => changePaymentMethod('stripe')} name='payMethod' /> Stripe
                                    </label>
                                </div>
                                <div className='form-group'>
                                    <label>
                                        <input type='radio' onChange={() => changePaymentMethod('razorpay')} name='payMethod' /> RazorPay
                                    </label>
                                </div>
                                <div className='form-group'>
                                    <label>
                                        <input type='radio' onChange={() => changePaymentMethod('paytm')} name='payMethod' /> Paytm
                                    </label>
                                </div>
                                <button type='button' onClick={PayNowButton} className='btn btn-sm btn-success mt-3'>Next</button>
                            </form>
                            {PayMethod === 'paypal' &&
                                <PayPalScriptProvider options={{ "client-id": "AcPHQSzZ9zhAcR8FuL1aiHZ-09W56ljLiWuhwMX8ePlxO1h2WxR1gm4Nb_MGiBVrh-NHDJ7ofQ0VIbM1" }}>
                                    <PayPalButtons className="mt-3"
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                                purchase_units: [
                                                    {
                                                        amount: {
                                                            currency_code: 'USD',
                                                            value: '3',
                                                        },
                                                    },
                                                ],
                                            });
                                        }}
                                        onApprove={(data, action) => {
                                            return action.order.capture().then((details) => {
                                                const name = details.payer.name.given_name;
                                                alert(`Transaction completed by ${name}`);
                                            });
                                        }}
                                    />
                                </PayPalScriptProvider>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;
// import React, { useContext, useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate
// import './Payment.css';
// import card from './card.png'; // Example card image
// import { CartContext, UserContext } from '../../Context';

// //Third Party
// import {PayPalScriptProvider,PayPalButtons} from "@paypal/react-paypal-js";
// import axios from 'axios';

// const baseUrl = "http://127.0.0.1:8000/api";
// function Payment() {
//   // const location = useLocation(); // Get the location object
//   // const navigate = useNavigate(); // Initialize useNavigate
//   // const totalAmount = location.state?.totalAmount; // Retrieve the total amount from state

//   // State variables for form inputs and validation messages
//   // const [cardNumber, setCardNumber] = useState('');
//   // const [expiration, setExpiration] = useState('');
//   // const [cvc, setCvc] = useState('');
//   // const [errors, setErrors] = useState({});

//   // // Validation function
//   // const validate = () => {
//   //   const newErrors = {};
//   //   const cardNumberPattern = /^\d{16}$/; // Regex for 16-digit card number
//   //   const expirationPattern = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
//   //   const cvcPattern = /^\d{3}$/; // 3-digit CVC

//   //   if (!cardNumberPattern.test(cardNumber)) {
//   //     newErrors.cardNumber = 'Card number must be 16 digits.';
//   //   }
//   //   if (!expirationPattern.test(expiration)) {
//   //     newErrors.expiration = 'Expiration must be in MM/YY format.';
//   //   }
//   //   if (!cvcPattern.test(cvc)) {
//   //     newErrors.cvc = 'CVC must be 3 digits.';
//   //   }

//   //   setErrors(newErrors);
//   //   return Object.keys(newErrors).length === 0; // Return true if no errors
//   // };

//   // const handlePurchase = () => {
//   //   if (validate()) {
//   //     alert('Payment successful! Thank you for your purchase.');
//   //     // Clear the cart from local storage if needed
//   //     localStorage.removeItem('cart'); // Clear cart from local storage
//   //     navigate('/cart'); // Redirect to the cart page
//   //   }
//   // };

//   const location = useLocation();
// const orderId = location.state?.orderId; // Get the order ID from the state
//   const [ConfirmOrder,SetConfirmOrder] = useState(false);
//     const [orderId,SetorderId] = useState('');
//     const [PayMethod,SetPayMethod] = useState('');
//     const userContext = useContext(UserContext);
//     const {cartData,setCartData} = useContext(CartContext);
//     if(userContext.login == null)
//     {
//         window.location.href = '/login'
//     }
//     else
//     {
//         if(ConfirmOrder==false)
//         {
//             addOrderInTable();
//         }      
//     }
   

//     function addOrderInTable()
//     {
//         const customerId = localStorage.getItem('customer_id');
//         // console.log(customerId);
//         const formData = new FormData();
//         formData.append('customer',customerId);

//         //Submit Data
//         axios.post(baseUrl+'/masterorders/',formData)
//         .then(function(response)
//         {
//             // console.log(response.data.id);
//             var orderId = response.data.MasterOrder_ID;
//             SetorderId(orderId);
//             orderItems(orderId);
//             SetConfirmOrder(true);
//         })
//         .catch(function(error){
//             console.log(error);
//         })
//     }

//     function orderItems(orderId) {
//       var previousCart = localStorage.getItem('cartData');
//       var cartJson = JSON.parse(previousCart);
    
//       if (cartJson != null) {
//         cartJson.forEach((cart) => {
//           const formData = new FormData();
//           formData.append('Order_ID', orderId);
//           formData.append('Product_ID', cart.product.id);
//           formData.append('Product_Quantity', cart.quantity); // Use the quantity from the cart
//           formData.append('Product_Price', cart.product.price);
    
//           // Submit Data
//           axios.post(baseUrl + '/orders/', formData)
//             .then(function (response) {
//               // Handle successful order item creation
//             })
//             .catch(function (error) {
//               console.log(error);
//             });
//         });
//       }
//     }

//     // function orderItems(orderId)
//     // {
//     //     // console.log(orderId);
//     //     var previousCart = localStorage.getItem('cartData');
//     //     var cartJson = JSON.parse(previousCart);
//     //     // const formData = new FormData();

//     //     if(cartJson != null)
//     //     {
//     //         cartJson.map((cart,index)=>{
//     //             const formData = new FormData();

//     //             formData.append('Order_ID',orderId);
//     //             formData.append('Product_ID',cart.product.id);
//     //             formData.append('Product_Quantity',1);
//     //             formData.append('Product_Price',cart.product.price);

//     //             //Submit Data
//     //             axios.post(baseUrl+'/orders/',formData)
//     //             .then(function(response) 
//     //             {
//     //                 // // Remove Cart Items from local storage
//     //                 localStorage.removeItem('cartData');  // Clears stored cart data
//     //                 setCartData([]);  // Updates state to an empty array

//     //                 // cartJson.splice(index,1);
//     //                 // localStorage.setItem('cartData',JSON.stringify(cartJson));
//     //                 // setCartData(cartJson);
//     //             })
//     //             .catch(function(error){
//     //                 console.log(error);
//     //             })

//     //         });
//     //     }
//     // }

//     function changePaymentMethod(payMethod)
//     {
//         SetPayMethod(payMethod);
//     }

//     function PayNowButton()
//     {
//         if(PayMethod != '')
//         {
//             changePaymentMethod(PayMethod);
//         }
//         else
//         {
//             alert('Select Payment Method!!!')
//         }
//     }

//   return (
//     <div>
//       <div className="payment-container">
//         <div className="payment-card-section">
//           <h2>Payment</h2>
//           <div className="payment-card">
//             <img src={card} alt="Card" className="payment-card-image" />
//             {/* <div className="payment-card-info">
//               <label>Card Number</label>
//               <input
//                 type="text"
//                 placeholder="0000 0000 0000 0000"
//                 value={cardNumber}
//                 onChange={(e) => setCardNumber(e.target.value)}
//               />
//               {errors.cardNumber && <p style={{ color: 'red' }}>{errors.cardNumber}</p>}
//               <div className="payment-exp-cvc">
//                 <div className="payment-exp">
//                   <label>Expiration</label>
//                   <input
//                     type="text"
//                     placeholder="MM / YY"
//                     value={expiration}
//                     onChange={(e) => setExpiration(e.target.value)}
//                   />
//                   {errors.expiration && <p style={{ color: 'red' }}>{errors.expiration}</p>}
//                 </div>
//                 <div className="payment-cvc">
//                   <label>CVC</label>
//                   <input
//                     type="text"
//                     placeholder="123"
//                     value={cvc}
//                     onChange={(e) => setCvc(e.target.value)}
//                   />
//                   {errors.cvc && <p style={{ color: 'red' }}>{errors.cvc}</p>}
//                 </div>
//               </div>
//             </div> */}
//             {/* <div className='container'> */}
//             {/* <div className='row mt-5'> */}
//                 {/* <div className='col-6 offset-3'> */}
//                     <div className='card py-3 text-center'>
//                         <h3> Choose a Payment Method</h3>
//                         <h5>ORDER ID: {orderId}</h5>
//                     </div>
//                     <div className='card p-3 mt-4'>
//                         <form>
//                             <div className='form-group'>
//                                 <label>
//                                     <input type='radio' onChange={()=>changePaymentMethod('paypal')} name='payMethod' /> PayPal
//                                 </label>
//                             </div>
//                             <div className='form-group'>
//                                 <label>
//                                     <input type='radio' onChange={()=>changePaymentMethod('stripe')} name='payMethod' /> Stripe
//                                 </label>
//                             </div>
//                             <div className='form-group'>
//                                 <label>
//                                     <input type='radio' onChange={()=>changePaymentMethod('razorpay')} name='payMethod' /> RazorPay
//                                 </label>
//                             </div>
//                             <div className='form-group'>
//                                 <label>
//                                     <input type='radio' onChange={()=>changePaymentMethod('paytm')} name='payMethod' /> Paytm
//                                 </label>
//                             </div>
//                             <button type='button' onClick={PayNowButton} className='btn btn-sm btn-success mt-3'>Next</button>
//                         </form>
//                         { PayMethod == 'paypal' &&
//                             <PayPalScriptProvider options = {{"client-id" : "AcPHQSzZ9zhAcR8FuL1aiHZ-09W56ljLiWuhwMX8ePlxO1h2WxR1gm4Nb_MGiBVrh-NHDJ7ofQ0VIbM1"}}> 
//                                 <PayPalButtons className="mt-3"
//                                     createOrder={(data,actions) => {
//                                         return actions.order.create({
//                                             purchase_units: [
//                                                 {
//                                                     amount: {
//                                                         currency_code: 'USD',
//                                                         value: '3',
//                                                     },
//                                                 },
//                                             ],
//                                         });
//                                     }}
//                                     onApprove={(data,action) => {
//                                         return action.order.capture().then((details) => {
//                                             const name = details.payer.name.given_name;
//                                             alert(`Transaction completed by ${name}`);
//                                         });
//                                     }}
//                                     />
//                             </PayPalScriptProvider>
//                         }
//                     </div>
//                 </div>
//             {/* </div>  */}
//         {/* </div>   */}
//           {/* </div> */}
//           {/* <div className="payment-total">
//             <h3>Total Amount:</h3>
//             <h3>Rs. {totalAmount ? totalAmount.toFixed(2) : '0.00'}</h3>
//           </div>
//           <button onClick={handlePurchase} className="payment-purchase-button">
//             Purchase
//           </button> */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Payment;