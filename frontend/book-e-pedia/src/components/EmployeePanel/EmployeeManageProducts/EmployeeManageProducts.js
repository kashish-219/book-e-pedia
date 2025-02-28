

import EmployeeSidebar from '../EmployeeSidebar/EmployeeSidebar';


  import React, { useState, useEffect } from "react";
  import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
  import { Link } from "react-router-dom";
  import "./EmployeeManageProducts.css";
  import { useNavigate } from "react-router-dom";
  function EmployeeManageProducts({ products }) {
    const [productList, setProductList] = useState(products || []);
  
    useEffect(() => {
      setProductList(products);
    }, [products]);
  
    // Define handleEdit function inside AdminManageProducts component
    const navigate = useNavigate();
  
    const handleEdit = (product) => {
      navigate("/employee/add-products", { state: { product } });
    };
  
    const handleDelete = (productId) => {
      setProductList(
        productList.filter((product) => product.Product_ID !== productId)
      );
    };
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
    const handleSidebarToggle = () => {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    };
    return (
      <div
        className={`dashboard-main-container ${
          isSidebarCollapsed ? "collapsed" : ""
        }`}
      >
        <div
          className={`top-main-dashboard-navbar ${
            isSidebarCollapsed ? "collapsed" : ""
          }`}
        >
          <EmployeeNavbar onToggleSidebar={handleSidebarToggle} />
        </div>
  
        <div
          className={`sidebar-main-section ${
            isSidebarCollapsed ? "collapsed" : ""
          }`}
        >
          <EmployeeSidebar isCollapsed={isSidebarCollapsed} />
        </div>
  
        <div
          className={`dashboard-main-content ${
            isSidebarCollapsed ? "expanded" : ""
          }`}
        >
          <Link to="/employee/add-products" className="btn btn-primary">
            <i className="fa fa-plus-circle"></i> Add Product
          </Link>
          <div className="admin-view-book-type-container">
            <h1 className="admin-view-book-type-title">Manage Products</h1>
  
            <table className="admin-view-book-type-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>Language</th>
                  <th>Number of Pages</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Cover Image</th>
                  <th>Back Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productList.length === 0 ? (
                  <tr>
                    <td colSpan="14">No products available</td>
                  </tr>
                ) : (
                  productList.map((product) => (
                    <tr key={product.Product_ID}>
                      <td>{product.Product_ID || "N/A"}</td>
                      <td>{product.Product_Name}</td>
                      <td>{product.Product_Description}</td>
                      <td>{product.Category_Name}</td>
                      <td>{product.Author_Name}</td>
                      <td>{product.Publisher_Name}</td>
                      <td>{product.Language}</td>
                      <td>{product.Number_of_Pages}</td>
                      <td>{product.Duration}</td>
                      <td>{product.Product_Price}</td>
                      <td>{product.Stock}</td>
                      <td>
                        {product.Cover_Image && (
                          <img src={product.Cover_Image} alt="Cover" width={50} />
                        )}
                      </td>
                      <td>
                        {product.Back_Image && (
                          <img src={product.Back_Image} alt="Back" width={50} />
                        )}
                      </td>
  
                      <td>
                          <button
                            onClick={() => handleEdit(product)}
                            className="admin-view-book-type-edit-btn"
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                        
  
                        <button
                          onClick={() => handleDelete(product.Product_ID)}
                          className="admin-view-book-type-delete-btn"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  

  

export default EmployeeManageProducts
