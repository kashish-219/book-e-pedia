import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; // Use useNavigate for navigation
import profileImage from "./profile.jpeg";
import './CustomerForgetPassword.css';

function CustomerForgetPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleSendOtp = () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    // Simulating API call (OTP sent to email)
    console.log("OTP sent to:", email);

    // Navigate to SendOtp page with email
    navigate('/customer/send-otp', { state: { email } });
  };

  return (
    <div className='cust-fp-body'>
      <div className="cust-fp-container">
        <div className="cust-fp-illustration">
          <img src={profileImage} alt="Profile Illustration" />
        </div>
        <div className="cust-fp-form-container">
          <h1>Forgot Your Password?</h1>
          <p>Enter your email address below and we'll send you instructions to reset your password.</p>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOtp}>Send OTP</button>
          <p><a href="/login">Back to login</a></p>
        </div>
      </div>
    </div>
  );
}

export default CustomerForgetPassword;


