import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

function CustomerReports() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };


  const [reportType, setReportType] = useState("all_customers");
  const [customerId, setCustomerId] = useState("");
  const [date, setDate] = useState("");
  const [data, setData] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      let formattedDate = date;

      if (reportType === "orders_by_date" && date) {
        const [year, month, day] = date.split("-");
        formattedDate = `${year}-${month}-${day}`;
      }

      const response = await axios.get("http://127.0.0.1:8000/customer-reports/", {
        params: {
          report_type: reportType,
          customer_id: reportType === "customer_by_id" ? customerId.trim() : undefined,
          date: formattedDate,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
      setData([]);
    }
    setLoading(false);
  };

  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(order);

    setData((prevData) => {
      if (!Array.isArray(prevData)) return prevData;
      return [...prevData].sort((a, b) => {
        if (a[column] === null) return 1;
        if (b[column] === null) return -1;
        if (typeof a[column] === "string") {
          return order === "asc"
            ? a[column].localeCompare(b[column])
            : b[column].localeCompare(a[column]);
        }
        return order === "asc" ? a[column] - b[column] : b[column] - a[column];
      });
    });
  };

  const downloadCSV = () => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.error("No data available for CSV download.");
      return;
    }

    const dataArray = Array.isArray(data) ? data : [data]; // Ensure it's always an array
    const csvRows = [];

    // Add report metadata to CSV
    csvRows.push(["Company Name: Book-E-Pedia"]);
    csvRows.push([`Report Type: ${reportType}`]);
    csvRows.push([`Download Time: ${new Date().toLocaleString()}`]);
    csvRows.push([]); // Empty row for spacing

    const headers = Object.keys(dataArray[0] || {}); // Prevent error if dataArray[0] is empty
    if (headers.length === 0) {
      console.error("No headers found for CSV export.");
      return;
    }

    csvRows.push(headers.join(",")); // Add headers

    for (const row of dataArray) {
      const values = headers.map((header) => {
        const value = row[header] !== undefined ? row[header] : "";
        return `"${String(value).replace(/"/g, '\\"')}"`; // Escape quotes properly
      });
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customer_report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
      pdf.text("Customer Report", 10, 20);
      pdf.text(`Report Type: ${reportType}`, 10, 30);
      pdf.text(`Download Time: ${new Date().toLocaleString()}`, 10, 40);
      pdf.addImage(imgData, 'PNG', 10, 50, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("customer_report.pdf");
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
      <h1 className="mt-4">Customer Reports</h1>
      <div>
        <label>
          Report Type:
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="all_customers">All Customers</option>
            <option value="customer_by_id">Customer by ID</option>
            <option value="highest_total_amount">Highest Total Amount</option>
            <option value="most_frequent_orders">Most Frequent Orders</option>
            <option value="orders_by_date">Orders by Date</option>
          </select>
        </label>
      </div>

      {reportType === "customer_by_id" && (
        <div>
          <label>
            Customer ID:
            <input type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
          </label>
        </div>
      )}

      {reportType === "orders_by_date" && (
        <div>
          <label>
            Date:
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>
      )}

      <button onClick={fetchData} disabled={loading}>
        {loading ? "Fetching..." : "Fetch Report"}
      </button>

      {data !== null && (
        <div>
          <h2>Report Data:</h2>
          {Array.isArray(data) && data.length > 0 ? (
            <div>
              <button onClick={downloadCSV}>Download as CSV</button>
              <button onClick={downloadPDF}>Download as PDF</button>
              <table id="report-table" border="1">
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th key={key} onClick={() => handleSort(key)} style={{ cursor: "pointer" }}>
                        {key} {sortColumn === key ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      {Object.values(item).map((value, idx) => (
                        <td key={idx}>{value !== null ? value.toString() : "N/A"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : typeof data === "object" && Object.keys(data).length > 0 ? (
            <div>
              <button onClick={downloadCSV}>Download as CSV</button>
              <button onClick={downloadPDF}>Download as PDF</button>
              <table id="report-table" border="1">
                <thead>
                  <tr>
                    {Object.keys(data).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {Object.values(data).map((value, index) => (
                      <td key={index}>{value !== null ? value.toString() : "N/A"}</td>
                    ))}
                  </tr>
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

export default CustomerReports;