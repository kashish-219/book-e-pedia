import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

function OrderReports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/order-reports/", {
        start_date: startDate,
        end_date: endDate,
        order_status: orderStatus,
        price_range: priceRange,
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
    const headers = ["Master Order ID", "Customer ID", "First Name", "Last Name", "Quantity", "Amount", "Status", "Date"];
    
    // Add report metadata to CSV
    csvRows.push(["Company Name: Book-E-Pedia"]);
    csvRows.push(["Report Type: Order Report"]);
    csvRows.push([`Download Time: ${new Date().toLocaleString()}`]);
    csvRows.push([`Date Range: ${startDate} to ${endDate}`]);
    csvRows.push([`Order Status: ${orderStatus || "All"}`]);
    csvRows.push([`Price Range: ${priceRange || "All"}`]);
    csvRows.push([]); // Empty row for spacing
    csvRows.push(headers.join(",")); // Add headers

    for (const row of data) {
      const values = [
        row.MasterOrder_ID,
        row.Cust_ID,
        row.Cust_ID__Fname,
        row.Cust_ID__Lname,
        row.T_Quantity,
        row.T_Amount,
        row.Order_Status,
        row.Order_DateTime,
      ];
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'order_report.csv');
    a.click();
  };

  const downloadPDF = () => {
    const input = document.getElementById("report-table");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add report title and company name
      pdf.setFontSize(20); // Larger font size for company name
      pdf.text("Book-E-Pedia", pdf.internal.pageSize.getWidth() / 2, 10, { align: "center" }); // Center align
      pdf.setFontSize(12);
      pdf.text("Order Report", 10, 20);
      pdf.text(`Download Time: ${new Date().toLocaleString()}`, 10, 30);
      pdf.text(`Date Range: ${startDate} to ${endDate}`, 10, 40);
      pdf.text(`Order Status: ${orderStatus || "All"}`, 10, 50);
      pdf.text(`Price Range: ${priceRange || "All"}`, 10, 60);
      pdf.addImage(imgData, 'PNG', 10, 70, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("order_report.pdf");
    });
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
    <div className={`top-main-dashboard-navbar  ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <AdminNavbar onToggleSidebar={handleSidebarToggle} />
    </div>

    <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <AdminSidebar isCollapsed={isSidebarCollapsed} />
    </div>
      <h1 className="mt-4">Order Reports</h1>
      <div>
        <label>
          Start Date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          End Date:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Order Status:
          <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
            <option value="">All</option>
            <option value="Delivered">Delivered</option>
            <option value="Pending">Pending</option>
            <option value="Canceled">Canceled</option>
            <option value="Processing">Processing</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Price Range:
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
            <option value="">All</option>
            <option value="0-500">0 - 500</option>
            <option value="500-1000">500 - 1000</option>
            <option value="1000-2000">1000 - 2000</option>
            <option value="more_than_2000">More than 2000</option>
          </select>
        </label>
      </div>
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
                    <th>Master Order ID</th>
                    <th>Customer ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.MasterOrder_ID}</td>
                      <td>{item.Cust_ID}</td>
                      <td>{item.Cust_ID__Fname}</td>
                      <td>{item.Cust_ID__Lname}</td>
                      <td>{item.T_Quantity}</td>
                      <td>{item.T_Amount}</td>
                      <td>{item.Order_Status}</td>
                      <td>{item.Order_DateTime}</td>
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

export default OrderReports;