import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

function ProductReports() {
  const [reportType, setReportType] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/product-reports/", {
          report_type: "products_by_category",
        });
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error.response?.data || error.message);
      }
    };

    fetchCategories();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/product-reports/", {
        report_type: reportType === 'products_by_category' ? 'products_in_category' : reportType,
        category_id: selectedCategory === "all" ? null : selectedCategory,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
      setData([]);
    }
    setLoading(false);
  };

  const downloadCSV = () => {
    if (!data || data.length === 0) return;

    const csvRows = [];
    const headers = reportType === 'products_by_category' 
      ? ["Product ID", "Product Name", "Price", "Stock", "Category ID", "Category Name", "Is Active", "Image URL"]
      : ["Product ID", "Product Name", "Price", "Stock", "Category ID", "Is Active", "Image URL"];
    
    // Add report metadata to CSV
    csvRows.push(["Company Name: Book-E-Pedia"]);
    csvRows.push(["Report Type: Product Report"]);
    csvRows.push([`Download Time: ${new Date().toLocaleString()}`]);
    csvRows.push([`Selected Category: ${selectedCategory || "All"}`]);
    csvRows.push([]); // Empty row for spacing
    csvRows.push(headers.join(",")); // Add headers

    for (const row of data) {
      const values = reportType === 'products_by_category'
        ? [
            row.Product_ID,
            row.Product_Name,
            row.Product_Price,
            row.Stock,
            row.Category_ID,
            row.Category_ID__Category_Name,
            row.IsActive,
            `http://127.0.0.1:8000/static/images/${row.Cover_Photo}` // Image URL
          ]
        : [
            row.Product_ID,
            row.Product_Name,
            row.Product_Price,
            row.Stock,
            row.Category_ID,
            row.IsActive,
            `http://127.0.0.1:8000/static/images/${row.Cover_Photo}` // Image URL
          ];
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'product_report.csv');
    a.click();
  };

  const downloadPDF = async () => {
    const input = document.getElementById("report-table");
    
    // Create a canvas from the table
    const canvas = await html2canvas(input, {
      useCORS: true,
      allowTaint: true,
      scale: 2
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add report title and company name
    pdf.setFontSize(20); // Larger font size for company name
    pdf.text("Book-E-Pedia", pdf.internal.pageSize.getWidth() / 2, 10, { align: "center" }); // Center align
    pdf.setFontSize(12);
    pdf.text("Product Report", 10, 20);
    pdf.text(`Download Time: ${new Date().toLocaleString()}`, 10, 30);
    pdf.text(`Selected Category: ${selectedCategory || "All"}`, 10, 40);
    pdf.addImage(imgData, "PNG", 10, 50, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("product_report.pdf");
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
    <div className={`top-main-dashboard-navbar  ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <AdminNavbar onToggleSidebar={handleSidebarToggle} />
    </div>

    <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <AdminSidebar isCollapsed={isSidebarCollapsed} />
    </div>
      <h1 className="mt-4">Product Reports</h1>
      <div>
        <label>
          Select Report Type:
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="">Select...</option>
            <option value="top_selling">Top-Selling Products</option>
            <option value="products_by_category">Products by Category</option>
            <option value="low_stock">Low Stock Products</option>
          </select>
        </label>
      </div>

      {reportType === 'products_by_category' && (
        <div>
          <label>
            Select Category:
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">Select a category...</option>
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.Category_ID} value={category.Category_ID}>
                  {category.Category_Name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <button onClick={fetchData} disabled={loading}>
        {loading ? "Fetching..." : "Fetch Report"}
      </button>

      {data && (
        <div>
          <h2>Report Data:</h2>
          {Array.isArray(data) && data.length > 0 ? (
            <div>
              <button onClick={downloadCSV}>Download as CSV</button>
              <button onClick={downloadPDF}>Download as PDF</button>
              <table id="report-table" border="1">
                <thead>
                  <tr>
                    {reportType === 'top_selling' && (
                      <>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Cover Photo</th>
                        <th>Category ID</th>
                        <th>Is Active</th>
                      </>
                    )}
                    {reportType === 'products_by_category' && (
                      <>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Cover Photo</th>
                        <th>Category ID</th>
                        <th>Category Name</th>
                        <th>Is Active</th>
                      </>
                    )}
                    {reportType === 'low_stock' && (
                      <>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Cover Photo</th>
                        <th>Category ID</th>
                        <th>Is Active</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      {reportType === 'top_selling' && (
                        <>
                          <td>{item.Product_ID}</td>
                          <td>{item.Product_Name}</td>
                          <td>{item.Product_Price}</td>
                          <td>{item.Stock}</td>
                          <td>
                            <img 
                              src={`http://127.0.0.1:8000/static/images/${item.Cover_Photo}`}  
                              alt="Cover" 
                              width="50" 
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          </td>
                          <td>{item.Category_ID}</td>
                          <td>{item.IsActive}</td>
                        </>
                      )}
                      {reportType === 'products_by_category' && (
                        <>
                          <td>{item.Product_ID}</td>
                          <td>{item.Product_Name}</td>
                          <td>{item.Product_Price}</td>
                          <td>{item.Stock}</td>
                          <td>
                            <img 
                              src={`http://127.0.0.1:8000/static/images/${item.Cover_Photo}`}  
                              alt="Cover" 
                              width="50" 
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          </td>
                          <td>{item.Category_ID}</td>
                          <td>{item.Category_ID__Category_Name}</td>
                          <td>{item.IsActive}</td>
                        </>
                      )}
                      {reportType === 'low_stock' && (
                        <>
                          <td>{item.Product_ID}</td>
                          <td>{item.Product_Name}</td>
                          <td>{item.Product_Price}</td>
                          <td>{item.Stock}</td>
                          <td>
                            <img 
                              src={`http://127.0.0.1:8000/static/images/${item.Cover_Photo}`}  
                              alt="Cover" 
                              width="50" 
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          </td>
                          <td>{item.Category_ID}</td>
                          <td>{item.IsActive}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductReports;