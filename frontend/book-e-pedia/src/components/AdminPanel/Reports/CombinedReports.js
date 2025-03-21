import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

function CombinedReports() {
  const [reportType, setReportType] = useState('product');
  const [revenueData, setRevenueData] = useState([]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    fetchRevenueData();
  }, [reportType]);

  const fetchRevenueData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/revenue-report/?type=${reportType}`);
      const text = await response.text(); // Read the response as text
      console.log("Raw response:", text); // Log it to see if it's an error page
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = JSON.parse(text); // Parse JSON manually
      console.log("Fetched data:", data);
      setRevenueData(data);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  const downloadCSV = () => {
    if (!revenueData || revenueData.length === 0) return;

    const csvRows = [];
    const headers = reportType === 'product' 
      ? ["Product Name", "Total Revenue"]
      : ["Category Name", "Total Revenue"];
    
    // Add report metadata to CSV
    csvRows.push(["Company Name: Book-E-Pedia"]);
    csvRows.push([`Report Type: ${reportType === 'product' ? 'Revenue by Product' : 'Revenue by Category'}`]);
    csvRows.push([`Download Time: ${new Date().toLocaleString()}`]);
    csvRows.push([]); // Empty row for spacing
    csvRows.push(headers); // Add headers

    for (const item of revenueData) {
      const values = reportType === 'product'
        ? [item.Product_ID__Product_Name, item.total_revenue]
        : [item.Product_ID__Category_ID__Category_Name, item.total_revenue];
      csvRows.push(values);
    }

    const csvString = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'revenue_report.csv');
    a.click();
  };

  const downloadPDF = async () => {
    const input = document.getElementById("revenue-table");
    
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
    pdf.text("Combined Revenue Report", 10, 20);
    pdf.text(`Report Type: ${reportType === 'product' ? 'Revenue by Product' : 'Revenue by Category'}`, 10, 30);
    pdf.text(`Download Time: ${new Date().toLocaleString()}`, 10, 40);
    // pdf.text("Generated by: Book-E-Pedia", 10, 50);
    pdf.addImage(imgData, "PNG", 10, 60, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("revenue_report.pdf");
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
    <div className={`top-main-dashboard-navbar  ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <AdminNavbar onToggleSidebar={handleSidebarToggle} />
    </div>

    <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <AdminSidebar isCollapsed={isSidebarCollapsed} />
    </div>
      <h1 className="mt-4">Combined Revenue Reports</h1>
      <label htmlFor="reportType">Select Report Type: </label>
      <select
        id="reportType"
        value={reportType}
        onChange={(e) => setReportType(e.target.value)}
      >
        <option value="product">Revenue by Product</option>
        <option value="category">Revenue by Category</option>
      </select>

      <h2>Revenue Data</h2>
      <button onClick={downloadCSV}>Download as CSV</button>
      <button onClick={downloadPDF}>Download as PDF</button>
      <table id="revenue-table">
        <thead>
          <tr>
            <th>{reportType === 'product' ? 'Product Name' : 'Category Name'}</th>
            <th>Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {revenueData.length === 0 ? (
            <tr>
              <td colSpan="2">No data available</td>
            </tr>
          ) : (
            revenueData.map((item, index) => (
              <tr key={index}>
                <td>{reportType === 'product' ? item.Product_ID__Product_Name : item.Product_ID__Category_ID__Category_Name}</td>
                <td>{item.total_revenue}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CombinedReports;