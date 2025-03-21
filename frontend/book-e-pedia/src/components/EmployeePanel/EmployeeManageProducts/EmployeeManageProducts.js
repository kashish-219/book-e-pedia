import EmployeeSidebar from '../EmployeeSidebar/EmployeeSidebar';
import React, { useState, useEffect } from "react";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import { Link, useNavigate } from "react-router-dom";
import "./EmployeeManageProducts.css";

function EmployeeManageProducts() {
  const [productList, setProductList] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // Fetch only active products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/products/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
  
        // Filter only active products
        const activeProducts = data.data.filter(product => product.IsActive === "1");
        
        setProductList(activeProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, []);
  

  const handleEdit = (product) => {
    navigate("/employee/add-products", { state: { product } });
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/products/${productId}/`, {
          method: "PATCH", // Use PATCH instead of DELETE to mark as inactive
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ IsActive: 0 }), // Set IsActive to 0 (inactive)
        });

        if (!response.ok) {
          throw new Error("Failed to update product status.");
        }

        // Remove the product from the frontend state
        setProductList((prevProducts) =>
          prevProducts.filter((product) => product.Product_ID !== productId)
        );

        console.log(`Product ID ${productId} marked as inactive.`);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
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
                  <td colSpan="14">No active products available</td>
                </tr>
              ) : (
                productList.map((product) => (
                  <tr key={product.Product_ID}>
                    <td>{product.Product_ID || "N/A"}</td>
                    <td>{product.Product_Name}</td>
                    <td>{product.Product_Description}</td>
                    <td>{product.Category_ID?.Category_Name || "N/A"}</td> 
                    <td>{product.Author}</td>
                    <td>{product.Publisher}</td>
                    <td>{product.Language}</td>
                    <td>{product.Number_of_Pages}</td>
                    <td>{product.Time_Duration}</td>
                    <td>{product.Product_Price}</td>
                    <td>{product.Stock}</td>
                    <td>
                      {product.Cover_Photo && (
                        <img src={product.Cover_Photo} alt="Cover" width={50} />
                      )}
                    </td>
                    <td>
                      {product.Back_Photo && (
                        <img src={product.Back_Photo} alt="Back" width={50} />
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

export default EmployeeManageProducts;
