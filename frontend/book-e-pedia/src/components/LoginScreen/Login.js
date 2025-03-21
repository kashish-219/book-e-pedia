import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // for React Router v6+
import "./Login.css";
import loginimg from "./istockphoto-1218656325-612x612.png";
import { Button, FormGroup, Label, Input, CardImg } from "reactstrap";
import axios from 'axios'; // Make sure to import axios

function Login(props) {
    const baseUrl = "http://127.0.0.1:8000/api"; // API URL
    const [formError, setFormError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loginFormData, setLoginFormData] = useState({ "email": '', "password": '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const inputHandler = (event) => {
        setLoginFormData({
            ...loginFormData,
            [event.target.name]: event.target.value
        });
    };

    const submitHandler = (event) => {
        event.preventDefault(); // Prevent form submission

        // Hardcoded admin credentials
        const adminEmail = "admin"; 
        const adminPassword = "admin123"; 

        // Check if the entered credentials match the admin credentials
        if (loginFormData.email === adminEmail && loginFormData.password === adminPassword) {
            // If admin login, redirect to admin dashboard
            localStorage.setItem('admin_login', true);
            // navigate('/admin/dashboard');
            window.location.href = '/admin/dashboard';
        } else {
            const formData = new FormData();
            formData.append('email', loginFormData.email);
            formData.append('password', loginFormData.password);

            // Submit data to API for regular user login
            axios.post(baseUrl + '/login/', JSON.stringify(loginFormData), {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                if (response.data.bool === false) {
                    setFormError(true);
                    setErrorMsg(response.data.msg);
                } else {
                    localStorage.setItem('customer_login', true);
                    localStorage.setItem('customer_username', response.data.user);
                    localStorage.setItem('customer_id', response.data.user_id);
                    // Redirect to the customer dashboard after successful login
                    // navigate('/customer/dashboard');
                    window.location.href = '/customer/dashboard';
                }
            })
            .catch(() => {
                setFormError(true);
                setErrorMsg('An error occurred. Please try again.');
            });
        }
    };

    const checkCustomer = localStorage.getItem('customer_login');
    if (checkCustomer) {
        //window.location.href = '/customer/dashboard';
    }

    if (localStorage.getItem('customer_login') === 'true') {
        navigate('/customer/dashboard');
    }

    const buttonEnable = loginFormData.email !== '' && loginFormData.password !== '';
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="login-background">
            <div className="login-box">
                <div className="login-container">
                    <div className="row app-des">
                        <div className="col left-background">
                            <h2>Book-E-Pedia</h2>
                            <br />
                            <CardImg className="mobile-img" src={loginimg} alt="Login-img" />
                            <br />
                            <br />
                            <p>
                                <h3>"Welcome to Your Digital Bookshelf!"</h3>
                                <br />
                                <h5>
                                    Discover, explore, and enjoy the world of books—all in one
                                    place. Log in to access your personalized collection, browse
                                    new arrivals, and find your next great read.
                                </h5>
                            </p>
                        </div>
                        <div className="col login-form">
                            <form onSubmit={submitHandler}>
                                <h2 className="font-weight-bold mb-4" style={{ fontSize: '45px', fontWeight: 'bold' }}>Login</h2>
                                <br />
                                <FormGroup>
                                    <i className="fas fa-user fa-2x"></i>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Label className="font-weight-bold mb-2" style={{ fontSize: '23px' }}>Email</Label>
                                    <Input
                                        className="mb-3"
                                        name="email"
                                        type="text"
                                        placeholder="Email"
                                        value={loginFormData.email}
                                        onChange={inputHandler}
                                        required
                                    />
                                    <i className="fas fa-lock fa-2x"></i>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Label className="font-weight-bold mb-2" style={{ fontSize: '23px' }}>Password</Label>
                                    <div className="password-field">
                                        <Input
                                            className="mb-3"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            value={loginFormData.password}
                                            onChange={inputHandler}
                                            required
                                        />
                                        <Button
                                            className="toggle-password"
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                        >
                                            <i className="far fa-eye" id="togglePassword">{showPassword ? " Hide" : " Show"}</i>
                                        </Button>
                                    </div>
                                    <br />
                                    {formError && (
                                        <div className="error-message">{errorMsg}</div>
                                    )}
                                    <div className="pass">
                                        <a href="/customer/forget-password">Forgot password?</a>
                                    </div>

                                    <div className="mt-3">
                                        <Button type="submit" disabled={!buttonEnable} color="primary" className="btn">
                                            Login
                                        </Button>
                                    </div>
                                    <br />
                                    <div className="signup-link">
                                        Not a member?{" "}
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate("/register");
                                            }}
                                        >
                                            Signup now
                                        </a>
                                    </div>
                                </FormGroup>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // for React Router v6+
// import "./Login.css";
// import loginimg from "./istockphoto-1218656325-612x612.png";
// import { Button, FormGroup, Label, Input, CardImg } from "reactstrap";
// import axios from 'axios'; // Make sure to import axios

// function Login(props) {
//     const baseUrl = "http://127.0.0.1:8000/api"; // API URL
//     const [formError, setFormError] = useState(false);
//     const [errorMsg, setErrorMsg] = useState('');
//     const [loginFormData, setLoginFormData] = useState({ "email": '', "password": '' });
//     const [showPassword, setShowPassword] = useState(false);
//     const navigate = useNavigate();

//     const inputHandler = (event) => {
//         setLoginFormData({
//             ...loginFormData,
//             [event.target.name]: event.target.value
//         });
//     };

//     const submitHandler = (event) => {
//         event.preventDefault(); // Prevent form submission
//         const formData = new FormData();
//         formData.append('email', loginFormData.email);
//         formData.append('password', loginFormData.password);

//         // Submit data
//         // Send JSON data instead of FormData
//         axios.post(baseUrl + '/login/', JSON.stringify(loginFormData), {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//         .then((response) => {
//             if (response.data.bool === false) {
//                 setFormError(true);
//                 setErrorMsg(response.data.msg);
//             } else {
//                 localStorage.setItem('customer_login', true);
//                 localStorage.setItem('customer_username', response.data.user);
//                 localStorage.setItem('customer_id', response.data.user_id); 
//                 // console.log('customer_id:', response.data.user_id);


//                 setFormError(false);
//                 setErrorMsg('');
//                 // navigate('/customer/dashboard');  // Redirect after successful login
//             }
//         })
//         .catch(() => {
//             setFormError(true);
//             setErrorMsg('An error occurred. Please try again.');
//         });
//     };

//     const checkCustomer = localStorage.getItem('customer_login');
//     if (checkCustomer) {
//         //window.location.href = '/customer/dashboard';
//     }

//     if (localStorage.getItem('customer_login') === 'true') {
//         navigate('/customer/dashboard');
//     }
    

//     const buttonEnable = loginFormData.email !== '' && loginFormData.password !== '';
//     const togglePasswordVisibility = () => setShowPassword(!showPassword);

//     return (
//         <div className="login-background">
//             <div className="login-box">
//                 <div className="login-container">
//                     <div className="row app-des">
//                         <div className="col left-background">
//                             <h2>Book-E-Pedia</h2>
//                             <br />
//                             <CardImg className="mobile-img" src={loginimg} alt="Login-img" />
//                             <br />
//                             <br />
//                             <p>
//                                 <h3>"Welcome to Your Digital Bookshelf!"</h3>
//                                 <br />
//                                 <h5>
//                                     Discover, explore, and enjoy the world of books—all in one
//                                     place. Log in to access your personalized collection, browse
//                                     new arrivals, and find your next great read.
//                                 </h5>
//                             </p>
//                         </div>
//                         <div className="col login-form">
//                             <form onSubmit={submitHandler}>
//                                 <h2 className="font-weight-bold mb-4" style={{ fontSize: '45px', fontWeight: 'bold' }}>Login</h2>
//                                 <br />
//                                 <FormGroup>
//                                     <i className="fas fa-user fa-2x"></i>&nbsp;&nbsp;&nbsp;&nbsp;
//                                     <Label className="font-weight-bold mb-2" style={{ fontSize: '23px' }}>Email</Label>
//                                     <Input
//                                         className="mb-3"
//                                         name="email"
//                                         type="text"
//                                         placeholder="Email"
//                                         value={loginFormData.email}
//                                         onChange={inputHandler}
//                                         required
//                                     />
//                                     <i className="fas fa-lock fa-2x"></i>&nbsp;&nbsp;&nbsp;&nbsp;
//                                     <Label className="font-weight-bold mb-2" style={{ fontSize: '23px' }}>Password</Label>
//                                     <div className="password-field">
//                                         <Input
//                                             className="mb-3"
//                                             name="password"
//                                             type={showPassword ? "text" : "password"}
//                                             placeholder="Password"
//                                             value={loginFormData.password}
//                                             onChange={inputHandler}
//                                             required
//                                         />
//                                         <Button
//                                             className="toggle-password"
//                                             type="button"
//                                             onClick={togglePasswordVisibility}
//                                         >
//                                             <i className="far fa-eye" id="togglePassword">{showPassword ? " Hide" : " Show"}</i>
//                                         </Button>
//                                     </div>
//                                     <br />
//                                     {formError && (
//                                         <div className="error-message">{errorMsg}</div>
//                                     )}
//                                     <div className="pass">
//                                         <a href="/customer/forget-password">Forgot password?</a>
//                                     </div>

//                                     <div className="mt-3">
//                                         <Button type="submit" disabled={!buttonEnable} color="primary" className="btn">
//                                             Login
//                                         </Button>
//                                     </div>
//                                     <br />
//                                     <div className="signup-link">
//                                         Not a member?{" "}
//                                         <a
//                                             href="#"
//                                             onClick={(e) => {
//                                                 e.preventDefault();
//                                                 navigate("/register");
//                                             }}
//                                         >
//                                             Signup now
//                                         </a>
//                                     </div>
//                                 </FormGroup>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Login;
