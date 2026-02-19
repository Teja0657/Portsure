import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar/Navbar";
import "../../CSSDesgin4/ComplianceLogs.css";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../logo/logo.png";

export default function ComplianceLogs() {
  const [logs, setLogs] = useState([]);
  const [auditing, setAuditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [regulationFilter, setRegulationFilter] = useState("ALL");

  // Session Isolation
  const loggedInUser = JSON.parse(localStorage.getItem("compliance_user") || "{}");
  const token = loggedInUser.token;

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const fetchLogs = () => {
    if (!token) return;
    fetch("http://localhost:8081/api/compliance/logs", {
      headers: getAuthHeaders()
    })
      .then(async (res) => {
        if (!res.ok) {
          return [];
        }
        return res.json();
      })
      .then((data) => setLogs(Array.isArray(data) ? data : []))
      .catch((err) => {});
  };

  useEffect(() => {
    fetchLogs();
  }, [token]);

  const deleteLog = async (logId) => {
    if (!token) return;
    // if (!window.confirm(`Are you sure you want to delete Log ID: ${logId}?`)) return;

    try {
      const response = await fetch(`http://localhost:8081/api/compliance/logs/${logId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (response.ok) {
        // alert("Log deleted successfully.");
        fetchLogs();
      } else {
        alert("Failed to delete the log.");
      }
    } catch (err) {
      alert("Connection error while trying to delete.");
    }
  };

  // ... generateCSV and generatePDF are strictly client-side and don't need changes ...

  const generateCSV = () => {
    const headers = "SlNo,PortfolioID,RegulationType,Findings,Date,Status\n";
    const csvData = logs
      .map(
        (l, index) =>
          `${index + 1},PF-${l.portfolioId},${l.regulationType},"${String(l.findings ?? "").replace(/"/g, '""')}",${l.date},${l.complianceStatus}`
      )
      .join("\n");

    const blob = new Blob([headers + csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Compliance_Report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Sl.No", "Portfolio ID", "Regulation", "Findings", "Date", "Status"];
    const tableRows = logs.map((log, index) => [
      index + 1,
      `PF-${log.portfolioId}`,
      log.regulationType,
      log.findings,
      log.date,
      log.complianceStatus,
    ]);

    doc.setFontSize(18);
    doc.text("Regulatory Compliance Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [30, 41, 59] },
    });

    doc.save(`Compliance_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handleAuditAll = async () => {
    if (!token) {
      alert("Session invalid. Please login.");
      return;
    }
    // if (!window.confirm("Can you confirm to audit all portfolios")) return;
    setAuditing(true);

    // Clear all logs immediately
    setLogs([]);

    try {
      const res = await fetch("http://localhost:8081/api/compliance/audit-all", {
        method: "POST",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        // alert("Audit completed successfully!");
        fetchLogs();
      } else {
        alert("Audit failed: " + await res.text());
        fetchLogs(); // Refetch to show any existing logs
      }
    } catch (err) {
      alert("Failed to trigger audit.");
      fetchLogs(); // Refetch to show any existing logs
    } finally {
      setAuditing(false);
    }
  };

  const navOptions = (
    <div className="home-links">
      <Link to="/compliance-officer" className="ad">Home</Link>
      <Link to="/compliance-logs" className="ad active">Logs</Link>
      <Link to="/risk-score" className="ad">Risk Score</Link>
      <Link to="/exposure-alerts" className="ad">Alerts</Link>
    </div>
  );

  // Filter logs based on regulation and search term
  const filteredLogs = logs.filter((log) => {
    // First filter by regulation type
    if (regulationFilter !== "ALL") {
      const logRegulation = (log.regulationType || "").toUpperCase();
      if (logRegulation !== regulationFilter) return false;
    }

    // Then filter by portfolio ID search
    if (!searchTerm) return true;
    const portfolioId = `PF-${log.portfolioId}`.toLowerCase();
    return portfolioId.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="report-container">
      <Navbar loginOptions={navOptions} />

      <div className="report-content">
        <div className="report-header">
          <h2>Regulatory Compliance Report</h2>
          <div className="export-actions">
            <button className="export-btn audit" onClick={handleAuditAll} disabled={auditing}>
              {auditing ? "Auditing..." : "Run Audit"}
            </button>
            <button className="export-btn csv" onClick={generateCSV}>CSV</button>
            <button className="export-btn pdf" onClick={generatePDF}>PDF</button>
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by Portfolio ID (e.g., PF-1001)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="regulation-filter"
            value={regulationFilter}
            onChange={(e) => setRegulationFilter(e.target.value)}
          >
            <option value="ALL">All Regulations</option>
            <option value="SEBI">SEBI</option>
            <option value="MIFID_II">MiFID_II</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="compliance-table">
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Portfolio ID</th>
                <th>Regulation Type</th>
                <th>Findings</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <tr key={log.logId}>
                    <td data-label="Sl.No">{index + 1}</td>
                    <td data-label="Portfolio ID">PF-{log.portfolioId}</td>
                    <td data-label="Regulation Type">{log.regulationType}</td>
                    <td data-label="Findings" className="findings-text">{log.findings}</td>
                    <td data-label="Date">{log.date}</td>
                    <td data-label="Status">
                      <span className={`status-pill ${(log.complianceStatus || "").toUpperCase().includes('NON-COMPLIANCE') ||
                        (log.complianceStatus || "").toUpperCase().includes('NON-COMPLIANT') ||
                        (log.complianceStatus || "").toUpperCase().includes('BREACH')
                        ? 'non-compliance'
                        : 'compliance'
                        }`}>
                        {log.complianceStatus}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <button
                        className="delete-btn-small"
                        onClick={() => deleteLog(log.logId)}
                        title="Delete log"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    {searchTerm ? `No logs found for "${searchTerm}"` : "No compliance logs available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="home-footer1">
        <img src={logo} alt="PortSure footer logo" className="hero-logo-footer" />
        <h5>© 2025 PortSure – Portfolio Risk Analysis & Investment Compliance System</h5>
      </footer>
    </div>
  );
}