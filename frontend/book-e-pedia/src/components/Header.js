import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Link, useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";
import './HeaderFooter.css'; // Import your CSS file for styling
import { CartContext, UserContext } from '../Context';

const Header = () => {
  const navigate = useNavigate();

  const userContext = useContext(UserContext);
  const {cartData,setCartData} = useContext(CartContext);
  if(cartData == null)
  {
    var cartItems = 0;
  }
  else
  {
    var cartItems = cartData.length;
  }

  // Function to get the appropriate dashboard link based on user role
  // const getAccountLink = () => {
  //   const userRole = localStorage.getItem("userRole");
  //   if (userRole === "admin") {
  //     return "/admin/dashboard";
  //   } else if (userRole === "employee") {
  //     return "/employee/dashboard";
  //   } else if (userRole === "customer") {
  //     return "/customer/dashboard";
  //   } else {
  //     return "/login"; // Redirect to login if no role is found
  //   }
  // };

  return (
    <header className='main-top-bar'>
      <div className="home-top-bar">
        <div className="home-container">
          <div className="home-contact-info">
            <br></br>
            <ul>
              <li><i className="fas fa-phone">&nbsp;</i> +91-9924184931</li>
              <li><i className="fas fa-envelope">&nbsp;</i> websupport@bookepedia.com</li>
              <li><i className="fas fa-map-marker-alt">&nbsp;</i> Ahmedabad</li>
            </ul>
          </div>
          <div className="link-right">
            <ul>
            {userContext != 'true' &&
              <li>
                <Nav.Link as={Link} to="/login" style={{ textDecoration: 'none', color: 'rgb(255, 255, 255)' }}><i className="fas fa-user-plus">&nbsp;</i>Log/Sign Up</Nav.Link>
              </li>
            }
            {!userContext == 'true' &&
              <li>
                <Nav.Link as={Link} to="/customer/logout" style={{ textDecoration: 'none', color: 'rgb(255, 255, 255)' }}><i className="fas fa-user-plus">&nbsp;</i>Logout</Nav.Link>
              </li>
            }
              <li>
                <Nav.Link as={Link} to="/cart" style={{ textDecoration: 'none', color: 'white'}}><i className="fas fa-shopping-cart">&nbsp;</i>Cart</Nav.Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Navbar (Link for pages) */}
      <div className="header">
      <nav className="navbar">
          <div className="logo">Book-E-Pedia</div>
          <ul className="nav-links">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => (isActive ? "active-link" : "")}>
                <i className="fa fa-home"></i>&nbsp;Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/categories" 
                className={({ isActive }) => (isActive ? "active-link" : "")}>
                <i className="fa-solid fa-icons"></i>&nbsp;Category
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/products" 
                className={({ isActive }) => (isActive ? "active-link" : "")}>
                <i className="fa-solid fa-basket-shopping"></i>&nbsp;Shop
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/aboutus" 
                className={({ isActive }) => (isActive ? "active-link" : "")}>
                <i className="fa fa-info-circle"></i>&nbsp;About Us
              </NavLink>
            </li>
            <li>
              <NavLink 
                // to={getAccountLink()} 
                to='/customer/dashboard'
                className={({ isActive }) => (isActive ? "active-link" : "")}>
                <i className="fa fa-user"></i>&nbsp;Account
              </NavLink>
            </li>
          </ul>
        
          <div className="search-top-bar">
            <input type="text" placeholder="What do you want to read?" />
            <button>Search</button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;