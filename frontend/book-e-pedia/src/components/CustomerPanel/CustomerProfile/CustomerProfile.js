import React from 'react'
import CustomerSidebar from '../CustomerSidebar/CustomerSidebar';
import './CustomerProfile.css'
import creditCard from './cc.jpg'
import debitCard from './dc.webp'

function CustomerProfile() {
  return (
    <div className="cust-profile-body">
      <CustomerSidebar />
      
      <div className="cust-profile-container">
        
        <div className="welcome-message">
          <h1>Welcome, Sara!</h1>
        
        
        <form className="cust-profile-form-container">
          
          <div className="cust-profile-form-group">
            <label for="first-name">First Name</label>
            <input type="text" id="first-name" placeholder="First Name" />
          </div>
          
          <div className="cust-profile-form-group">
            <label for="last-name">Last Name</label>
            <input type="text" id="last-name" placeholder="Last Name" />
          </div>
          
          <div className="cust-profile-form-group">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="example@example.com" />
          </div>
          
          <div className="cust-profile-form-group">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" placeholder="123-456-7890" />
          </div>
          
          <div className="cust-profile-form-group">
            <label for="dob">Date of Birth</label>
            <input type="date" id="dob" />
          </div>
          
          <div className="cust-profile-form-group">
            <label for="gender">Gender</label>
            <select id="gender">
              <option value="select">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          
          <div className="cust-profile-form-group">
            <label for="address">Address</label>
            <input type="text" id="address" placeholder="123 Main St" />
          </div>
          
          <div className="cust-profile-form-group">
            <label for="nation">Nation</label>
            <input type="text" id="nation" placeholder="Country" />
          </div>
        </form>
        
        <div className="cust-profile-payment-methods">
          <h3>Payment Methods</h3>
          <img src={creditCard} alt="DebitCard" />
          <img src={debitCard} alt="CreditCard" />
        </div>
        
        <div className="cust-profile-header">

          <button className="cust-profile-save-btn">Save</button>
        </div>
       
      </div>
    </div>
    </div>
  )
}

export default CustomerProfile
