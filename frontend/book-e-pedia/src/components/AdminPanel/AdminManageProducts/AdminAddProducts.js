// export default AdminAddProducts;
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "./AdminAddProducts.css";

function AdminAddProducts({ onAddProduct }) {
  const location = useLocation();
  const productToEdit = location.state?.product;

  const [formData, setFormData] = useState({
    Product_ID: productToEdit?.Product_ID || "",
    Product_Name: productToEdit?.Product_Name || "",
    Category_Name: productToEdit?.Category_Name || "",
    Category_ID: productToEdit?.Category_ID || "", // Add Category_ID to state
    Book_Name: productToEdit?.Book_Name || "",
    Product_Description: productToEdit?.Product_Description || "",
    Author_Name: productToEdit?.Author_Name || "",
    Publisher_Name: productToEdit?.Publisher_Name || "",
    Language: productToEdit?.Language || "",
    Number_of_Pages: productToEdit?.Number_of_Pages || "",
    Duration: productToEdit?.Duration || "",
    Product_Price: productToEdit?.Product_Price || 0.0,
    Stock: productToEdit?.Stock || 0,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const categoryMapping = {
    Fiction: 1,
    "Non-Fiction": 2,
    "Self-Help": 3,
    Science: 4,
    Biography: 5,
  };

  const handleChange = (e) => {
  const { name, files, value } = e.target;

  // Check if it's a file input and handle it safely
  if (files && files.length > 0) {
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0], // Store the file for validation
    }));
  } else if (files && files.length === 0) {
    setFormData((prevData) => ({
      ...prevData,
      [name]: null, // Reset the file input if no file is selected
    }));
  } else {
    // Handle regular text fields
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
};
  const validateForm = () => {
  let newErrors = {};

  // Validate all common fields
  if (!formData.Product_Name.trim()) newErrors.Product_Name = "Please enter Product name.";
  else if (formData.Product_Name.length > 150) {
      newErrors.Product_Name = "Product name should not be more than 150 letters.";
    }


  if (!formData.Category_Name.trim()) newErrors.Category_Name = "Please Select Category.";

  if (!formData.Book_Name.trim()) newErrors.Book_Name = "Please Select Book type.";

  if (!formData.Product_Description.trim()) newErrors.Product_Description = "Please enter Description of Product.";
  else if (formData.Product_Description.length > 250) {
      newErrors.Product_Description = "Product description should not be more than 250 letters.";
    }

  if (!formData.Author_Name.trim()) newErrors.Author_Name = "Please enter Author name.";
  else if (formData.Author_Name.length > 50) {
      newErrors.Author_Name = "Author name should not be more than 50 letters.";
    }

  if (!formData.Publisher_Name.trim()) newErrors.Publisher_Name = "Please enter Publisher name.";
  else if (formData.Publisher_Name.length > 50) {
      newErrors.Publisher_Name = "Publisher name should not be more than 50 letters.";
    }

  if (!formData.Language.trim()) newErrors.Language = "Please enter Language.";
  else if (formData.Language.length > 20) {
      newErrors.Language = "Language of the Book should not be more than 20 letters.";
    }

  if (!formData.Product_Price || isNaN(formData.Product_Price) || formData.Product_Price <= 0) {
    newErrors.Product_Price = "Enter a valid price.";
  }

  if (!formData.Stock || isNaN(formData.Stock) || Number(formData.Stock) < 1) {
    newErrors.Stock = "Stock must be at least 1.";
  }

  // **Conditional Validation based on Book Type**
  if (formData.Book_Name === "Physical Book" || formData.Book_Name === "E-Book") {
    if (!formData.Number_of_Pages || formData.Number_of_Pages <= 0) {
      newErrors.Number_of_Pages = "Enter a valid number of pages for physical and e-book.";
    }
  }

  if (formData.Book_Name === "Audio Book" || formData.Book_Name === "Video Book") {
    if (!formData.Duration || formData.Duration.trim() === "") {
      newErrors.Duration = "Duration is required for audio and video books.";
    }
  }

  if (!formData.Cover_Image || !(formData.Cover_Image instanceof File)) {
  newErrors.Cover_Image = "Cover photo is required.";
}

if (!formData.Back_Image || !(formData.Back_Image instanceof File)) {
  newErrors.Back_Image = "Back photo is required.";
}

  // Update all errors at once
  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted", formData);

      const updatedProduct = {
        ...formData,
        Product_ID: productToEdit?.Product_ID || getNextProductId(), // Use existing ID if editing
      };

      if (productToEdit) {
        alert("Product updated successfully!");
      } else {
        alert("Product added successfully!");
      }

      onAddProduct(updatedProduct);
      navigate("/admin/manage-products"); // Navigate back to the product list
    }
  };

  const getNextProductId = () => {
    const lastId = parseInt(localStorage.getItem("lastProductId") || "10000", 10); // Default start from 10000
    const nextId = lastId + 1;
    localStorage.setItem("lastProductId", nextId.toString());
    return nextId;
  };
  // Remove this function if image upload is not required
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: URL.createObjectURL(files[0]), // Convert file to temporary URL
      });
    }
  };
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Top Navbar */}
      <div className={`top-main-dashboard-navbar  ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      {/* Sidebar */}
      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Main Content */}
      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
      
    <div className="admin-add-product-container">
      
      <h1 className="admin-add-product-title" style={{ textAlign: "center" }}>
        {productToEdit ? "Edit Product" : "Add New Product"}
      </h1>
      <form onSubmit={handleSubmit} className="admin-add-product-form">
        <div className="form-row">
          <div className="admin-add-product-field">
            <label htmlFor="Product_Name">Product Name</label>
            <input
              type="text"
              id="Product_Name"
              name="Product_Name"
              value={formData.Product_Name}
              onChange={handleChange}
                />
                {errors.Product_Name && <p className="error-text">*{errors.Product_Name}</p>}
          </div>
          <div className="admin-add-product-field">
            <label htmlFor="Author_Name">Author</label>
            <input
              type="text"
              id="Author_Name"
              name="Author_Name"
              value={formData.Author_Name}
              onChange={handleChange}
                />
                {errors.Author_Name && <p className="error-text">*{errors.Author_Name}</p>}
          </div>
        

        {/* Product Description Full Row */}
        <div className="admin-add-product-field admin-add-product-description">
          <label htmlFor="Product_Description">Product Description</label>
          <textarea
            id="Product_Description"
            name="Product_Description"
            value={formData.Product_Description}
            onChange={handleChange}
            placeholder="Enter a detailed description"
                ></textarea>
                {errors.Product_Description && <p className="error-text">*{errors.Product_Description}</p>}
        </div>

        
          <div className="admin-add-product-field">
            <label htmlFor="Category_Name">Category Name</label>
            <select
              id="Category_Name"
              name="Category_Name"
              value={formData.Category_Name}
              onChange={handleChange}
            >
              <option value="">-- Select Category --</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Self-Help">Self-Help</option>
              <option value="Science">Science</option>
              <option value="Biography">Biography</option>
                </select>
                {errors.Category_Name && <p className="error-text">*{errors.Category_Name}</p>}
          </div>
          <div className="admin-add-product-field">
            <label htmlFor="Book_Name">Book Type</label>
            <select
              id="Book_Name"
              name="Book_Name"
              value={formData.Book_Name}
              onChange={handleChange}
            >
              <option value="">-- Select Book Type --</option>
              <option value="Physical Book">Physical Book</option>
              <option value="E-Book">E-Book</option>
              <option value="Audio Book">Audio Book</option>
              <option value="Video Book">Video Book</option>
                </select>
                {errors.Book_Name && <p className="error-text">*{errors.Book_Name}</p>}
          </div>
          {/* Remaining Fields */}
          <div className="admin-add-product-field">
            <label htmlFor="Publisher_Name">Publisher</label>
            <input
              type="text"
              id="Publisher_Name"
              name="Publisher_Name"
              value={formData.Publisher_Name}
              onChange={handleChange}
                />
                {errors.Publisher_Name && <p className="error-text">*{errors.Publisher_Name}</p>}
          </div>

          <div className="admin-add-product-field">
            <label htmlFor="Language">Language</label>
            <input
              type="text"
              id="Language"
              name="Language"
              value={formData.Language}
                  onChange={handleChange}
            />
            {errors.Language && <p className="error-text">*{errors.Language}</p>}
          </div>

          <div className="admin-add-product-field">
            <label htmlFor="Number_of_Pages">Number of Pages</label>
            <input
              type="text"
              id="Number_of_Pages"
              name="Number_of_Pages"
              value={formData.Number_of_Pages}
              onChange={handleChange}
                />
                {errors.Number_of_Pages && <p className="error-text">*{errors.Number_of_Pages}</p>}
          </div>

          <div className="admin-add-product-field">
            <label htmlFor="Duration">Duration</label>
            <input
              type="text"
              id="Duration"
              name="Duration"
              value={formData.Duration}
              onChange={handleChange}
                />
                {errors.Duration && <p className="error-text">*{errors.Duration}</p>}
          </div>

          <div className="admin-add-product-field">
            <label htmlFor="Product_Price">Price</label>
            <input
              type="number"
              id="Product_Price"
              name="Product_Price"
              value={formData.Product_Price}
              onChange={handleChange}
                />
                {errors.Product_Price && <p className="error-text">*{errors.Product_Price}</p>}
          </div>

          <div className="admin-add-product-field">
            <label htmlFor="Stock">Stock</label>
            <input
              type="number"
              id="Stock"
              name="Stock"
              value={formData.Stock}
              onChange={handleChange}
              //min="1"
                />
                {errors.Stock && <p className="error-text">*{errors.Stock}</p>}
          </div>

          <div className="admin-add-product-field">
  	  <label htmlFor="Cover_Image">Cover Image</label>
  	  <input
    		type="file"
    		id="Cover_Image"
    		name="Cover_Image"
    		onChange={handleChange}
  	  />
          {errors.Cover_Image && <p className="error-text">*{errors.Cover_Image}</p>}
	  </div>

	  <div className="admin-add-product-field">
          <label htmlFor="Back_Image">Back Image</label>
          <input
                type="file"
    	        id="Back_Image"
    		name="Back_Image"
    		onChange={handleChange}
  	  />
  	  {errors.Back_Image && <p className="error-text">*{errors.Back_Image}</p>}
 	</div>

          <button type="submit" className="admin-add-product-submit-btn">
            {productToEdit ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
}

export default AdminAddProducts;
