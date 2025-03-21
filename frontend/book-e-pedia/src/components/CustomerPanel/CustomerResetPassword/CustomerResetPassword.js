import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import profileImage from './profile.jpeg';
import './CustomerResetPassword.css';

function CustomerResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      console.log('Sending reset request:', { token, password: newPassword }); // Log payload
      const response = await fetch('http://127.0.0.1:8000/api/password_reset/confirm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response from server:', errorData); // Log server error
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Password reset successful:', data);
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);

    } catch (error) {
      console.error('Error:', error);
      setError('Failed to reset password. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cust-rp-body">
      <div className="cust-rp-container">
        <div className="cust-rp-illustration">
          {/* <img src={profileImage} alt="Profile Illustration" /> */}
        </div>
        <div className="cust-rp-form-container">
          <h1>Reset Your Password</h1>
          <p>Enter your new password below to reset your account.</p>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleResetPassword} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <p><a href="/login">Back to login</a></p>
        </div>
      </div>
    </div>
  );
}

export default CustomerResetPassword;