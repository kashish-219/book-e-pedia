import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import profileImage from "./profile.jpeg";
import './CustomerForgetPassword.css';

function CustomerForgetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // Added for success feedback
  const [error, setError] = useState('');    // Added for error feedback
  const navigate = useNavigate();

  const handleSendReset = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
  
    setLoading(true);
    setError('');
    setMessage('');
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/password_reset/", {
        method: "POST",  // ✅ Correct method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),  // ✅ Send email in request body
      });
  
      if (!response.ok) {
        const text = await response.text();
        console.log("Error response body:", text);
        throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
      }
  
      const data = await response.json();
      console.log("Reset email sent:", data);
      setMessage("A password reset link has been sent to your email.");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to send reset link. Please try again later.");
    } finally {
      setLoading(false);
    }
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
          <button onClick={handleSendReset} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          {message && <p className="success-message">{message}</p>} {/* Success feedback */}
          {error && <p className="error-message">{error}</p>}      {/* Error feedback */}
          <p><a href="/login">Back to login</a></p>
        </div>
      </div>
    </div>
  );
}

export default CustomerForgetPassword;
// import React, { useState } from 'react';
// import { useNavigate } from "react-router-dom"; // Use useNavigate for navigation
// import profileImage from "./profile.jpeg";
// import './CustomerForgetPassword.css';

// function CustomerForgetPassword() {
//   const [email, setEmail] = useState('');
//   const navigate = useNavigate(); // Hook to navigate programmatically

//   const handleSendOtp = () => {
//     if (!email) {
//       alert("Please enter your email address.");
//       return;
//     }
//     // Simulating API call (OTP sent to email)
//     console.log("OTP sent to:", email);

//     // Navigate to SendOtp page with email
//     navigate('/customer/send-otp', { state: { email } });
//   };

//   return (
//     <div className='cust-fp-body'>
//       <div className="cust-fp-container">
//         <div className="cust-fp-illustration">
//           <img src={profileImage} alt="Profile Illustration" />
//         </div>
//         <div className="cust-fp-form-container">
//           <h1>Forgot Your Password?</h1>
//           <p>Enter your email address below and we'll send you instructions to reset your password.</p>
//           <input
//             type="email"
//             placeholder="Email Address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <button onClick={handleSendOtp}>Send OTP</button>
//           <p><a href="/login">Back to login</a></p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CustomerForgetPassword;


