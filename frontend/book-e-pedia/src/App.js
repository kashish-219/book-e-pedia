import React, { useState, useEffect } from "react";
import './App.css';
import { Routes, Route, useLocation} from 'react-router-dom';

// Assets
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import book1 from "./components/ProductScreen/epic.jpeg";
// Website Components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/HomeScreen/Home';
import AboutUs from './components/AboutUsScreen/AboutUs';
import ContactForm from './components/ContactUsScreen/contactUs';
import Login from './components/LoginScreen/Login';
import CustomerCart from './components/CustomerPanel/CustomerCart/CustomerCart';
import Products from './components/ProductScreen/Products';
// import SingleProduct from './components/ProductScreen/SingleProduct';
import Categories from "./components/CategoryScreen/Category";
import CategoryProducts from "./components/CategoryScreen/CategoryProducts";
import ProductDetail from './components/ProductScreen/ProductDetail';
import AudioBook from "./components/ProductScreen/AudioBook";
import VideoBook from "./components/ProductScreen/VideoBook";
import E_Book from "./components/ProductScreen/E_Book";
import Payment from "./components/PaymentScreen/Payment";
import Invoice from "./components/CustomerPanel/CustomerOrders/Invoice";
import Entertainment from "./components/CategoryScreen/Entertainment";


// Customer Panel
import CustomerRegisteration from './components/CustomerPanel/CustomerRegistration/CustomerRegisteration';
import CustomerLogout from "./components/CustomerPanel/CustomerLogout/CustomerLogout";
import CustomerDashboard from './components/CustomerPanel/CustomerDashboard/CustomerDashboard';
import CustomerForgetPassword from './components/CustomerPanel/CustomerForgetPassword/CustomerForgetPassword';
import CustomerProfile from './components/CustomerPanel/CustomerProfile/CustomerProfile';
import CustomerOrders from './components/CustomerPanel/CustomerOrders/CustomerOrders';
import SendOtp from './components/CustomerPanel/CustomerForgetPassword/SendOtp';
import ResetPassword from './components/CustomerPanel/CustomerForgetPassword/ResetPassword';
import CustomerHelpSupport from "./components/CustomerPanel/CustomerHelpSupport/CustomerHelpSupport";

// Employee Panel
import EmployeeDashboard from './components/EmployeePanel/EmployeeDashboard/EmployeeDashboard';
import EmployeeManageOrders from './components/EmployeePanel/EmployeeManageOrders/EmployeeManageOrders';
import EmployeeViewCategory from './components/EmployeePanel/EmployeeViewCategory/EmployeeViewCategory';
import EmployeeManageBookType from './components/EmployeePanel/EmployeeManageBookType/EmployeeManageBookType';
import EmployeeManageProducts from './components/EmployeePanel/EmployeeManageProducts/EmployeeManageProducts';
import EmployeeProfile from './components/EmployeePanel/EmployeeProfile/EmployeeProfile';
import EmployeeForgetPassword from './components/EmployeePanel/EmployeeForgetPassword/EmployeeForgetPassword';
import EmployeeAddBookType from './components/EmployeePanel/EmployeeManageBookType/EmployeeAddBookType';
import EmployeeAddProducts from './components/EmployeePanel/EmployeeManageProducts/EmployeeAddProducts';

// Admin Panel
import AdminDashboard from './components/AdminPanel/AdminDashboard/AdminDashboard';
import AdminManageCategory from './components/AdminPanel/AdminManageCategory/AdminManageCategory';
import AdminManageEmployees from './components/AdminPanel/AdminManageEmployees/AdminManageEmployees';
import AdminManageFeedback from './components/AdminPanel/AdminManageFeedback/AdminManageFeedback';
import AdminManageOrders from './components/AdminPanel/AdminManageOrders/AdminManageOrders';
import AdminManageProducts from './components/AdminPanel/AdminManageProducts/AdminManageProducts';
import AdminProfile from './components/AdminPanel/AdminProfile/AdminProfile';
import AdminViewCustomers from './components/AdminPanel/AdminViewCustomers/AdminViewCustomers';
import Reports from './components/AdminPanel/Reports/Reports';
import AdminManageBookType from './components/AdminPanel/AdminManageBookType/AdminManageBookType';
import AdminAddCategory from './components/AdminPanel/AdminManageCategory/AdminAddCategory';
import AdminAddBookType from './components/AdminPanel/AdminManageBookType/AdminAddBookType';
import AdminAddEmployees from './components/AdminPanel/AdminManageEmployees/AdminAddEmployees';
import AdminAddProducts from './components/AdminPanel/AdminManageProducts/AdminAddProducts';
import Technology from "./components/CategoryScreen/Technology";

import { CartContext } from './Context';
const checkCart = localStorage.getItem('cartData');

function App() {
  // dyanmic
  const [cartData,setCartData] = useState(JSON.parse(checkCart));

  // static
  const location = useLocation();
  const [products, setProducts] = useState([
    // {
    //   Product_ID: 1231654,
    //   Product_Name: "DBA",
    //             Product_Description:"Textbook",
    //             Category_Name:"School",
    //             Author_Name:"DEV",
    //            Publisher_Name:"HK",
    //             Language:"English",
    //             Number_of_Pages:80,
    //             Duration:123,
    //            Product_Price:4500,
    //   Stock: 50,
    //   Cover_Image:{book1},
    //   Back_Image:{book1},
    // },
    


  ]);
  
  const [employeeList, setEmployeeList] = useState([
    // {
    //   Emp_ID: 1,
    //   Fname: "John",
    //   Lname: "Doe",
    //   Email: "john.doe@example.com",
    //   Phone_Number: "1234567890",
    //   Designation: "Software Engineer",
    // },
    // {
    //   Emp_ID: 2,
    //   Fname: "Jane",
    //   Lname: "Smith",
    //   Email: "jane.smith@example.com",
    //   Phone_Number: "9876543210",
    //   Designation: "Project Manager",
    // },
  ]);
  const [categories, setCategories] = useState([
    // {
    //   Category_ID: 1,
    //   Category_Name: "Technology",
    //   Category_Description: "Latest trends in tech",
    //   IsActive: '1',
    // },
    // {
    //   Category_ID: 2,
    //   Category_Name: "Fashion",
    //   Category_Description: "All about style and fashion",
    //   IsActive: '0',
    // },
  ]);

  const handleAddCategory = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };
  const handleAddProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };
  
  const [bookTypes, setBookTypes] = useState([
    // {
    //   Book_ID: 1,
    //   Book_Name: "Book 1",
    //   Physical_Book: "Yes",
    //   Audio_Book: "No",
    //   E_Book: "Yes",
    //   Video_Book: "No",
    //   IsActive: "1",
    // },
    // {
    //   Book_ID: 2,
    //   Book_Name: "Book 2",
    //   Physical_Book: "No",
    //   Audio_Book: "Yes",
    //   E_Book: "No",
    //   Video_Book: "Yes",
    //   IsActive: "0",
    // },
  ]);

  const handleAddBookType = (newBookType) => {
    newBookType.Book_ID = bookTypes.length + 1; // Simple way to generate a unique ID
    setBookTypes((prevBookTypes) => [...prevBookTypes, newBookType]);
  };
  const handleAddEmployee = (newEmployee) => {
    setEmployeeList((prevList) => [...prevList, newEmployee]);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const noHeaderFooterRoutes = [
    // '/login', 
    // '/register',
    '/employee/dashboard',
        '/employee/manage-orders' ,
       '/employee/manage-categories' ,
        '/employee/manage-booktype',
       '/employee/add-booktype' ,
      '/employee/manage-products' ,
        '/employee/add-products' ,
       '/employee/profile' ,
        '/employee/forget-password' ,
    '/admin/dashboard',
    '/admin/manage-orders',
    '/admin/manage-categories',
    '/admin/add-category',
    '/admin/manage-booktype',
    '/admin/add-booktype',
    '/admin/manage-products',
    '/admin/add-products',
    '/admin/view-products',
    '/admin/manage-employees',
    '/admin/add-employees',
    '/admin/view-customers',
    '/admin/profile',
    '/admin/manage-feedback',
    '/admin/reports'
  ];

  const shouldDisplayHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <CartContext.Provider value={{cartData,setCartData}}>
      {shouldDisplayHeaderFooter && <Header />}
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/aboutus' element={<AboutUs />} />
        <Route exact path='/contactus' element={<ContactForm />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/cart' element={<CustomerCart />} />
        <Route exact path='/payment' element={<Payment />} />

        <Route exact path="/categories" element={<Categories />} />
        <Route exact path='/category/:category_slug/:Category_ID' element={< CategoryProducts />} />
        <Route exact path="/products/Entertainment" element={<Entertainment />} />
        <Route exact path="/products/Technology" element={<Technology />} />
        
        <Route exact path='/products' element={<Products />} />
        {/* <Route path="/product-detail/:id" element={<ProductDetail addToCart={CustomerCart.addToCart}/>} /> */}
          <Route exact path='/product/:product_slug/:Product_ID' element={<ProductDetail />} />
        <Route exact path='/audio-book' element={<AudioBook />} />
         <Route exact path='/video-book' element={<VideoBook />} />
         <Route exact path='/e-book' element={<E_Book />} /> 
         <Route exact path='/invoice' element={<Invoice/>} />

        {/* Customer */}
        <Route exact path='/register' element={<CustomerRegisteration />} />
        <Route exact path='/customer/dashboard' element={<CustomerDashboard />} />
        <Route exact path='/customer/orders' element={<CustomerOrders />} />
        <Route exact path='/customer/profile' element={<CustomerProfile />} />
        <Route exact path='/customer/forget-password' element={<CustomerForgetPassword />} />
        <Route exact path='/customer/send-otp' element={<SendOtp />} />
        <Route exact path='/customer/reset-password' element={<ResetPassword />} />
        <Route exact path='/customer/help-support' element={<CustomerHelpSupport />} />
        <Route exact path="/customer/logout" element={<CustomerLogout />}></Route>

        {/* Employee */}
        {/* Employee */}
        <Route exact path='/employee/dashboard' element={<EmployeeDashboard />} />
        <Route exact path='/employee/manage-orders' element={<EmployeeManageOrders />} />
        <Route exact path='/employee/manage-categories' element={<EmployeeViewCategory categories={categories} onAddCategory={handleAddCategory}/>} />
        <Route exact path='/employee/manage-booktype' element={<EmployeeManageBookType bookTypes={bookTypes} onAddBookType={handleAddBookType}/>} />
        <Route exact path='/employee/add-booktype' element={<EmployeeAddBookType onAddBookType={handleAddBookType}  />} />
        <Route exact path='/employee/manage-products' element={<EmployeeManageProducts products={products} />} />
        <Route exact path='/employee/add-products' element={<EmployeeAddProducts onAddProduct={handleAddProduct}/>} />
        <Route exact path='/employee/profile' element={<EmployeeProfile />} />
        <Route exact path='/employee/forget-password' element={<EmployeeForgetPassword />} />

        {/* Admin */}
        <Route exact path='/admin/dashboard' element={<AdminDashboard />} />
        <Route exact path='/admin/manage-orders' element={<AdminManageOrders />} />
        <Route path="/admin/manage-categories" element={<AdminManageCategory categories={categories} onAddCategory={handleAddCategory} />} />
        <Route path="/admin/add-category" element={<AdminAddCategory onAddCategory={handleAddCategory} />} />
        <Route path="/admin/manage-booktype" element={<AdminManageBookType bookTypes={bookTypes} onAddBookType={handleAddBookType} />} />
        <Route path="/admin/add-booktype" element={<AdminAddBookType onAddBookType={handleAddBookType} />} />
        <Route exact path='/admin/manage-products' element={<AdminManageProducts products={products} />} />
        <Route exact path='/admin/add-products' element={<AdminAddProducts onAddProduct={handleAddProduct} />} />
        <Route path="/admin/manage-employees" element={<AdminManageEmployees employeeList={employeeList} onAddEmployee={handleAddEmployee} />} />
        <Route path="/admin/add-employees" element={<AdminAddEmployees onAddEmployee={handleAddEmployee} />} />
        <Route exact path='/admin/view-customers' element={<AdminViewCustomers />} />
        <Route exact path='/admin/profile' element={<AdminProfile />} />
        <Route exact path='/admin/manage-feedback' element={<AdminManageFeedback />} />
        <Route exact path='/admin/reports' element={<Reports />} />
      </Routes>
      {shouldDisplayHeaderFooter && <Footer />}
    </CartContext.Provider>
  );
}

export default App;

 // // import logo from './logo.svg';
// import {React,useState, useEffect } from "react";
// import './App.css';
// import { Routes, Route, useLocation } from 'react-router-dom';

// // Assets
// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap/dist/js/bootstrap.js";

// // Website Components
// import Header from './components/Header';
// import Footer from './components/Footer';
// import Home from './components/HomeScreen/Home';
// import AboutUs from './components/AboutUsScreen/AboutUs';
// import ContactForm from './components/ContactUsScreen/contactUs';
// import Login from './components/LoginScreen/Login';
// import CustomerCart from './components/CustomerPanel/CustomerCart/CustomerCart';
// import Products from './components/ProductScreen/Products';
// // // import SingleProduct from './components/ProductScreen/SingleProduct'; // Import renamed component
// import Categories from "./components/CategoryScreen/Category";
// import ProductDetail from './components/ProductScreen/ProductDetail';
// import Payment from "./components/PaymentScreen/Payment";
// import AudioBook from "./components/ProductScreen/AudioBook";
// import VideoBook from "./components/ProductScreen/VideoBook";
// import E_Book from "./components/ProductScreen/E_Book";

// // Customer Panel
// import CustomerRegisteration from './components/CustomerPanel/CustomerRegistration/CustomerRegisteration';
// import CustomerDashboard from './components/CustomerPanel/CustomerDashboard/CustomerDashboard';
// import CustomerForgetPassword from './components/CustomerPanel/CustomerForgetPassword/CustomerForgetPassword';
// import CustomerProfile from './components/CustomerPanel/CustomerProfile/CustomerProfile';
// import CustomerOrders from './components/CustomerPanel/CustomerOrders/CustomerOrders';

// // Employee Panel
// import EmployeeDashboard from './components/EmployeePanel/EmployeeDashboard/EmployeeDashboard';
// import EmployeeManageOrders from './components/EmployeePanel/EmployeeManageOrders/EmployeeManageOrders';
// import EmployeeViewCategory from './components/EmployeePanel/EmployeeViewCategory/EmployeeViewCategory';
// import EmployeeManageBookType from './components/EmployeePanel/EmployeeManageBookType/EmployeeManageBookType';
// import EmployeeManageProducts from './components/EmployeePanel/EmployeeManageProducts/EmployeeManageProducts';
// import EmployeeProfile from './components/EmployeePanel/EmployeeProfile/EmployeeProfile';
// import EmployeeForgetPassword from './components/EmployeePanel/EmployeeForgetPassword/EmployeeForgetPassword';
// import EmployeeAddBookType from './components/EmployeePanel/EmployeeManageBookType/EmployeeAddBookType';
// import EmployeeAddProducts from './components/EmployeePanel/EmployeeManageProducts/EmployeeAddProducts';

// // Admin Panel
// import AdminDashboard from './components/AdminPanel/AdminDashboard/AdminDashboard';
// import AdminManageCategory from './components/AdminPanel/AdminManageCategory/AdminManageCategory';
// import AdminManageEmployees from './components/AdminPanel/AdminManageEmployees/AdminManageEmployees';
// import AdminManageFeedback from './components/AdminPanel/AdminManageFeedback/AdminManageFeedback';
// import AdminManageOrders from './components/AdminPanel/AdminManageOrders/AdminManageOrders';
// import AdminManageProducts from './components/AdminPanel/AdminManageProducts/AdminManageProducts';
// import AdminProfile from './components/AdminPanel/AdminProfile/AdminProfile';
// import AdminViewCustomers from './components/AdminPanel/AdminViewCustomers/AdminViewCustomers';
// import Reports from './components/AdminPanel/Reports/Reports';
// import AdminManageBookType from './components/AdminPanel/AdminManageBookType/AdminManageBookType';
// import AdminAddCategory from './components/AdminPanel/AdminManageCategory/AdminAddCategory';
// import AdminAddBookType from './components/AdminPanel/AdminManageBookType/AdminAddBookType';
// import AdminAddEmployees from './components/AdminPanel/AdminManageEmployees/AdminAddEmployees';
// import AdminAddProducts from './components/AdminPanel/AdminManageProducts/AdminAddProducts';

// import Invoice from "./components/CustomerPanel/CustomerOrders/Invoice";
// import Entertainment from "./components/CategoryScreen/Entertainment";

// function App() {
//   const location = useLocation();
//   const [products, setProducts] = useState([]);

//   const handleAddProduct = (newProduct) => {
//     setProducts((prevProducts) => [...prevProducts, newProduct]);
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location.pathname]);

//   const ScrollToTop = () => {
//     const { pathname } = useLocation();
  
//     useEffect(() => {
//       window.scrollTo(0, 0);
//     }, [pathname]);
  
//     return null;
//   };

//   const noHeaderFooterRoutes = [
//     // '/login', 
//     // '/register',
//     '/admin/dashboard',
//     '/admin/manage-orders',
//     '/admin/manage-categories',
//     '/admin/add-category',
//     '/admin/manage-booktype',
//     '/admin/add-booktype',
//     '/admin/manage-products',
//     '/admin/add-products',
//     '/admin/view-products',
//     '/admin/manage-employees',
//     '/admin/add-employees',
//     '/admin/view-customers',
//     '/admin/profile',
//     '/admin/manage-feedback',
//     '/admin/reports'
// ];

//   const shouldDisplayHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  
//   return (
//     <>
//     <ScrollToTop/>
//       {shouldDisplayHeaderFooter && <Header />}
//       <Routes>
//         <Route exact path='/' element={<Home />} />
//         <Route exact path='/aboutus' element={<AboutUs />} />
//         <Route exact path='/contactus' element={<ContactForm />} />
//         <Route exact path='/login' element={<Login />} />
//         <Route exact path='/cart' element={<CustomerCart />} />
//         <Route exact path='/payment' element={<Payment />} />
//         <Route exact path="/categories" element={<Categories />} />
//         <Route exact path="/products/Entertainment" element={<Entertainment />} />
//         <Route exact path="/products/Technology" element={<Entertainment />} />

//         <Route exact path='/products' element={<Products addToCart={CustomerCart.addToCart}/>} />
//         <Route path="/product-detail/:id" element={<ProductDetail addToCart={CustomerCart.addToCart}/>} />
//         {/* <Route exact path='/product/:id' element={<ProductDetail />} /> */}
//         <Route exact path='/audio-book' element={<AudioBook />} />
//         <Route exact path='/video-book' element={<VideoBook />} />
//         <Route exact path='/e-book' element={<E_Book />} />
//         <Route exact path='/invoice' element={<Invoice/>} />
        
//         {/* Customer */}
//         <Route exact path='/register' element={<CustomerRegisteration />} />
//         <Route exact path='/customer/dashboard' element={<CustomerDashboard />} />
//         <Route exact path='/customer/orders' element={<CustomerOrders />} />
//         <Route exact path='/customer/profile' element={<CustomerProfile />} />
//         <Route exact path='/customer/forget-password' element={<CustomerForgetPassword />} />
//         {/* <Route exact path='/customer/help-support' element={<CustomerHelpSupport />} /> */}
        
//         {/* Employee */}
//         <Route exact path='/employee/dashboard' element={<EmployeeDashboard />} />
//         <Route exact path='/employee/manage-orders' element={<EmployeeManageOrders />} />
//         <Route exact path='/employee/manage-categories' element={<EmployeeViewCategory />} />
//         <Route exact path='/employee/manage-booktype' element={<EmployeeManageBookType />} />
//         <Route exact path='/employee/add-booktype' element={<EmployeeAddBookType />} />
//         <Route exact path='/employee/manage-products' element={<EmployeeManageProducts />} />
//         <Route exact path='/employee/add-products' element={<EmployeeAddProducts />} />
//         <Route exact path='/employee/profile' element={<EmployeeProfile />} />
//         <Route exact path='/employee/forget-password' element={<EmployeeForgetPassword />} />
        
//         {/* Admin */}
//         <Route exact path='/admin/dashboard' element={<AdminDashboard />} />
//         <Route exact path='/admin/manage-orders' element={<AdminManageOrders />} />
//         <Route exact path='/admin/manage-categories' element={<AdminManageCategory />} />
//         <Route exact path='/admin/add-category' element={<AdminAddCategory />} />
//         <Route exact path='/admin/manage-booktype' element={<AdminManageBookType />} />
//         <Route exact path='/admin/add-booktype' element={<AdminAddBookType />} />
//         <Route exact path='/admin/manage-products' element={<AdminManageProducts products={products} />} />
//         <Route exact path='/admin/add-products' element={<AdminAddProducts onAddProduct={handleAddProduct} />} />
//         <Route exact path='/admin/manage-employees' element={<AdminManageEmployees />} />
//         <Route exact path='/admin/add-employees' element={<AdminAddEmployees />} />
//         <Route exact path='/admin/view-customers' element={<AdminViewCustomers />} />
//         <Route exact path='/admin/profile' element={<AdminProfile />} />
//         <Route exact path='/admin/manage-feedback' element={<AdminManageFeedback />} />
//         <Route exact path='/admin/reports' element={<Reports />} />
       
//       </Routes>
//       {shouldDisplayHeaderFooter && <Footer />}
//     </>
//   );
// }

// export default App;
