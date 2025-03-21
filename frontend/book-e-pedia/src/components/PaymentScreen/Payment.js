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
    const navigate = useNavigate();
    const [totalAmount, setTotalAmount] = useState(0); // State to hold total amount

    useEffect(() => {
        // Calculate total amount from cartData
        const total = cartData.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        setTotalAmount(total.toFixed(2)); // Set total amount in INR
    }, [cartData]);


    if (userContext.login == null) {
        window.location.href = '/login';
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

    // function updateOrderStatus(order_status)
    // {
    //     //Submit Data
    //     axios.post(baseUrl+'/update-order-status/'+orderId)
    //     .then(function(response)
    //     {
    //         window.location.href = '/customer/orders';
    //     })
    //     .catch(function(error){
    //         console.log(error);
    //     })
    // }

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

    // New function to save payment details
    function savePaymentDetails(transactionId, paymentMode) {
        const formData = new FormData();
        formData.append('MasterOrder_ID', orderId);
        formData.append('Payment_Mode', paymentMode);
        formData.append('Payment_Status', '1'); // Assuming '1' means paid
    
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        formData.append('Payment_Date', formattedDate); // Append current date

        console.log('Saving payment details:', {
            MasterOrder_ID: orderId,
            Payment_Mode: paymentMode,
            Payment_Status: '1',
            Payment_Date: formattedDate,
        });
    
        axios.post(baseUrl + '/payments/', formData)
            .then(response => {
                console.log('Payment details saved successfully:', response.data);
            })
            .catch(error => {
                console.error('Error saving payment details:', error);
            });
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
                                                            // value: '3',
                                                            value: totalAmount,
                                                        },
                                                    },
                                                ],
                                            });
                                        }}
                                        onApprove={(data, action) => {
                                            return action.order.capture().then((details) => {
                                                const name = details.payer.name.given_name;
                                                navigate('/customer/dashboard')
                                                // alert(`Transaction completed by ${name}`);
                                                // Save payment details after successful transaction
                                                savePaymentDetails(data.orderID, 'paypal');
                                                // updateOrderStatus(true);
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
