import React from 'react'
import { NavLink } from "react-router-dom";
import CustomerSidebar from '../CustomerSidebar/CustomerSidebar';
import './CustomerDashboard.css'
import p1 from './p1.jpeg'
import p2 from './epic.jpeg'
import p3 from './gatsby.jpeg'
import p4 from './harry.jpeg'
import p5 from './download (2).jpeg'
import p6 from './mockingbird.jpeg'
import p7 from './download(1).jpeg'


function CustomerDashboard() {
  return (
    <div>
      <div className="cust-body">
        <CustomerSidebar/>

      <div className="cust-main-content">
        <div className="cust-header">
          <h1>Welcome, Sara!</h1>
        </div>

        <h2>Your Bookshelf</h2>
        <div className="cust-ordered-books">
          <div className="cust-book-card">
            <img src={p1} alt="Book Cover" className="cust-book-image" />
            <h3 style={{fontSize:'18px'}}>Hare and Tortoise</h3>
            <NavLink to="/audio-book">
              <i className="fa fa-headphones" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>
            </NavLink>
            <i className="fa fa-book-reader" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>

              {/* <p>Order Date: 01 Jan 2025</p>
            <p>Status: Delivered</p> */}
          </div>

          <div className="cust-book-card">
            <img src={p2} alt="Book Cover" className="cust-book-image" />
            <h3 style={{fontSize:'18px'}}>Epic Adventures</h3>
            <NavLink to="/audio-book">
              <i className="fa fa-headphones" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>
            </NavLink>
            <NavLink to="/video-book">
                <i className="fa-solid fa-file-video" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>
              </NavLink>
              <NavLink to="/e-book">
            <i className="fa fa-book-reader" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>
            </NavLink>
            {/* <p>Order Date: 15 Dec 2024</p>
            <p>Status: In Transit</p> */}
          </div>

          <div className="cust-book-card">
            <img src={p3} alt="Book Cover" className="cust-book-image" />
            <h3 style={{fontSize:'18px'}}>The Great Gatbsy</h3>
            <NavLink to="/audio-book">
              <i className="fa fa-headphones" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>
            </NavLink>
            
            <NavLink to="/video-book">
                <i className="fa-solid fa-file-video" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>
              </NavLink>
              <NavLink to="/e-book">
            <i className="fa fa-book-reader" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>
            </NavLink>
            {/* <p>Order Date: 15 Dec 2024</p>
            <p>Status: In Transit</p> */}
          </div>

          <div className="cust-book-card">
            <img src={p4} alt="Book Cover" className="cust-book-image" />
            <h3 style={{fontSize:'18px'}}>Harry Potter</h3>
            <NavLink to="/video-book">
                <i className="fa-solid fa-file-video" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>
              </NavLink>
              <NavLink to="/e-book">
            <i className="fa fa-book-reader" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>
            </NavLink>
            {/* <p>Order Date: 15 Dec 2024</p>
            <p>Status: In Transit</p> */}
          </div>

          <div className="cust-book-card">
            <img src={p5} alt="Book Cover" className="cust-book-image" />
            <h3 style={{fontSize:'18px'}}>My Book Cover</h3>
            <NavLink to="/audio-book">
              <i className="fa fa-headphones" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>
            </NavLink>
            
            {/* <p>Status: In Transit</p> */} 
          </div>

          <div className="cust-book-card">
            <img src={p6} alt="Book Cover" className="cust-book-image" />
            <h3 style={{fontSize:'18px'}}>To Kill a Mockingbird</h3>
            
            <NavLink to="/video-book">
                <i className="fa-solid fa-file-video" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>
              </NavLink>
              <NavLink to="/e-book">
            <i className="fa fa-book-reader" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>
            </NavLink>
            {/* <p>Order Date: 15 Dec 2024</p>
            <p>Status: In Transit</p> */}
          </div>

          {/* <div className="cust-book-card">
            <img src={p1} alt="Book Cover" className="cust-book-image" />
            <h3>Book Title 2</h3>
            <NavLink to="/audio-book">
              <i className="fa fa-headphones" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>
            </NavLink>
            <i className="fa fa-book-reader" style={{ color: 'black', fontSize: '18px', marginRight: '20px' }}></i>
            {/* <p>Order Date: 15 Dec 2024</p>
            <p>Status: In Transit</p> */}
          {/* </div> */} 
        </div>

      </div>
    </div>
    </div>
  )
}

export default CustomerDashboard