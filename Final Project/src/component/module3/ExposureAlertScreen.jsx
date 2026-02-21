import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Snackbar } from "@mui/material";
import "../../CSSDesgin3/ExposureAlertScreen.css";
import Navbar from "../../Navbar/Navbar";
import logo from "../../logo/logo.png";
import Footer from "../Footer";

function getExposureData(allocation) {
  const equity = allocation?.Equity || 0;
  const bond = allocation?.Bond || 0;
  const derivative = allocation?.Derivative || 0;

  const total = equity + bond + derivative;
  if (total === 0) {
    return [
      { name: "Equity", value: 0 },
      { name: "Bond", value: 0 },
      { name: "Derivative", value: 0 },
    ];
  }

  return [
    { name: "Equity", value: (equity / total) * 100 },
    { name: "Bond", value: (bond / total) * 100 },
    { name: "Derivative", value: (derivative / total) * 100 },
  ];
}

const safeDate = (ts) => {
  if (!ts) return "N/A";

  // Works for ISO like: 2026-02-08T07:28:14.095+00:00
  const d1 = new Date(ts);
  if (!isNaN(d1.getTime())) return d1.toLocaleString();

  // Fallback for formats like: 2026-02-08 07:28:14
  const d2 = new Date(String(ts).replace(" ", "T"));
  if (!isNaN(d2.getTime())) return d2.toLocaleString();

  return String(ts);
};

export default function ExposureAlertScreen() {
  const [investors, setInvestors] = useState([]);
  const [selectedInvestorId, setSelectedInvestorId] = useState("");

  // map key: "PF-<id>"
  const [portfolios, setPortfolios] = useState({});
  const [loading, setLoading] = useState(false);

  const [selectedPortfolio, setSelectedPortfolio] = useState("");

  const [alertSent, setAlertSent] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [alertHistory, setAlertHistory] = useState([]);

  const [limits] = useState({
    Equity: 60,
    Bond: 70,
    Derivative: 50,
  });

  // Session & Auth
  // Session Isolation: Compliance context
  const loggedInUser = JSON.parse(localStorage.getItem("compliance_user") || "{}");
  const token = loggedInUser.token;

  const getAuthHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }), [token]);

  // 1) Load investors
  useEffect(() => {
    if (!token) return;

    const loadInvestors = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/investors/getAllInvestors", {
          headers: getAuthHeaders()
        });

        if (!res.ok) {
          await res.text();
          setInvestors([]);
          setSelectedInvestorId("");
          return;
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setInvestors(list);

        if (list.length > 0) {
          setSelectedInvestorId(String(list[0].investorId));
        } else {
          setSelectedInvestorId("");
        }
      } catch (err) {
        setInvestors([]);
        setSelectedInvestorId("");
      }
    };

    loadInvestors();
  }, [token, getAuthHeaders]);

  // 2) Load portfolios for selected investor
  useEffect(() => {
    if (!selectedInvestorId || !token) return;

    const loadPortfolios = async () => {
      setLoading(true);
      try {
        const investorId = Number(selectedInvestorId);

        const res = await fetch(`http://localhost:8081/api/portfolios/investor/${investorId}`, {
          headers: getAuthHeaders()
        });
        if (!res.ok) {
          await res.text();
          setPortfolios({});
          setSelectedPortfolio("");
          return;
        }

        const data = await res.json();

        const map = {};
        (Array.isArray(data) ? data : []).forEach((p) => {
          const key = `PF-${p.portfolioId}`;
          map[key] = {
            dbId: p.portfolioId,
            name: p.portfolioName,
            Equity: p.equityPercentage || 0,
            Bond: p.bondPercentage || 0,
            Derivative: p.derivativePercentage || 0,
          };
        });

        setPortfolios(map);

        const firstKey = Object.keys(map)[0];
        setSelectedPortfolio(firstKey || "");
      } catch (err) {
        setPortfolios({});
        setSelectedPortfolio("");
      } finally {
        setLoading(false);
      }
    };

    loadPortfolios();
  }, [selectedInvestorId, token, getAuthHeaders]);

  // 3) Load alert history for selected portfolio
  useEffect(() => {
    const fetchHistory = async () => {
      const dbId = portfolios[selectedPortfolio]?.dbId;
      if (!dbId || !token) {
        setAlertHistory([]);
        return;
      }

      try {
        const res = await fetch(`http://localhost:8081/api/alerts/portfolio/${dbId}`, {
          headers: getAuthHeaders()
        });

        if (!res.ok) {
          await res.text();
          setAlertHistory([]);
          return;
        }

        const data = await res.json();
        setAlertHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        setAlertHistory([]);
      }
    };

    fetchHistory();
  }, [selectedPortfolio, portfolios, alertSent, token, getAuthHeaders]);

  // reset warning display when switching portfolio
  useEffect(() => {
    setIsDismissed(false);
  }, [selectedPortfolio]);

  const allocation = portfolios[selectedPortfolio];
  const exposure = allocation ? getExposureData(allocation) : [];
  const activeBreaches = exposure.filter((e) => e.value > limits[e.name]);

  async function handleSendAlert() {
    const dbId = portfolios[selectedPortfolio]?.dbId;
    if (!dbId || activeBreaches.length === 0 || !token) return;

    const breachNames = activeBreaches.map((b) => b.name).join(", ");
    const firstBreach = activeBreaches[0];

    // ExposureAlertService payload
    const alertPayload = {
      investorId: Number(selectedInvestorId),
      assetType: breachNames,
      exposureValue: parseFloat(firstBreach.value.toFixed(2)),
      limitValue: limits[firstBreach.name],
      status: "CRITICAL_BREACH",
    };

    try {
      // Save exposure alert
      const alertRes = await fetch(`http://localhost:8081/api/alerts/send/${dbId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(alertPayload),
      });

      if (!alertRes.ok) {
        const text = await alertRes.text();
        alert(text || "Failed to save exposure alert.");
        return;
      }

      setAlertSent(true);
      setIsDismissed(true);
    } catch (err) {
      alert("Network error while sending alert.");
    }
  }

  const handleDeleteAlert = async (alertId) => {
    if (!window.confirm("Delete this alert record?")) return;
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8081/api/alerts/delete/${alertId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        const text = await res.text();
        alert(text || "Delete failed");
        return;
      }

      setAlertHistory((prev) => prev.filter((a) => a.alertId !== alertId));
    } catch (err) {
      alert("Network error while deleting.");
    }
  };

  const navOptions = (
    <div className="home-links">
      <Link to="/compliance-officer" className="ad">Home</Link>
      <Link to="/compliance-logs" className="ad">Logs</Link>
      <Link to="/risk-score" className="ad">Risk Score</Link>
      <Link to="/exposure-alerts" className="ad active">Alerts</Link>
    </div>
  );

  return (
    <div className="home">
      <Navbar loginOptions={navOptions} />
      <h2 className="exposure-title">Exposure Alert</h2>

      <main className="exposure-main-content">
        <section className="selection-card">
          <h3 className="card-header-title">Portfolio Selection</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Investor</label>
              <select
                value={selectedInvestorId}
                onChange={(e) => setSelectedInvestorId(String(e.target.value))}
                className="simple-select"
              >
                <option value="" disabled>
                  Choose an Investor
                </option>
                {investors.map((inv) => (
                  <option key={inv.investorId} value={String(inv.investorId)}>
                    {inv.fullName ?? "Unknown"} (ID: {inv.investorId})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Portfolio</label>
              <select
                value={selectedPortfolio}
                onChange={(e) => setSelectedPortfolio(e.target.value)}
                className="simple-select"
                disabled={loading || Object.keys(portfolios).length === 0}
              >
                {loading ? (
                  <option>Loading...</option>
                ) : Object.keys(portfolios).length > 0 ? (
                  Object.keys(portfolios).map((p) => (
                    <option key={p} value={p}>
                      {p} - {portfolios[p].name}
                    </option>
                  ))
                ) : (
                  <option>No Portfolios Found</option>
                )}
              </select>
            </div>
          </div>
        </section>

        <section className="data-card exposure-details">
          <h3 className="card-header-title">Current Exposure Status</h3>

          <div className="alert-box-container">
            {activeBreaches.length > 0 && !isDismissed ? (
              <div className="simple-alert warning-alert">
                <div className="alert-text">
                  <strong>Warning!</strong> Exposure limit breached in{" "}
                  {activeBreaches.map((b) => b.name).join(", ")}.
                </div>
                <button className="alert-btn" onClick={handleSendAlert}>
                  Send Notification & Log Audit
                </button>
              </div>
            ) : (
              <div className="simple-alert success-alert">
                <strong>{isDismissed ? "Audit Captured:" : "Status Safe:"}</strong>
                {isDismissed ? " Compliance log created." : " Portfolio is within limits."}
              </div>
            )}
          </div>

          <div className="table-container">
            <table className="simple-exposure-table">
              <thead>
                <tr>
                  <th>Asset Type</th>
                  <th>Actual Exposure</th>
                  <th>Policy Limit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {exposure.map((e) => (
                  <tr key={e.name}>
                    <td data-label="Asset Type" style={{ fontWeight: "600" }}>{e.name}</td>
                    <td data-label="Actual Exposure" className={e.value > limits[e.name] ? "text-danger" : ""}>
                      {e.value.toFixed(2)}%
                    </td>
                    <td data-label="Policy Limit">{limits[e.name]}%</td>
                    <td data-label="Status">
                      <span
                        className={`status-badge ${e.value > limits[e.name] ? "breach" : "ok"
                          }`}
                      >
                        {e.value > limits[e.name] ? "BREACH" : "OK"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="data-card history-card">
          <h3 className="card-header-title">Historical Alert Log</h3>

          <div className="tablecontainer1">
            <table className="simpletable1">
              <thead>
                <tr>
                  <th>Asset Class</th>
                  <th>Value at Breach</th>
                  <th>Date & Time</th>
                  <th style={{ textAlign: "center" }}>Manage</th>
                </tr>
              </thead>
              <tbody>
                {alertHistory.length > 0 ? (
                  alertHistory.map((alert) => (
                    <tr key={alert.alertId}>
                      <td data-label="Asset Class">{alert.assetType}</td>
                      <td data-label="Value at Breach" className="text-danger">{alert.exposureValue}%</td>
                      <td data-label="Date & Time" style={{ color: "#666" }}>{safeDate(alert.timestamp)}</td>
                      <td data-label="Manage" style={{ textAlign: "center" }}>
                        <button
                          onClick={() => handleDeleteAlert(alert.alertId)}
                          className="delete-btn-style"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "30px", color: "#999" }}>
                      No history found for this portfolio.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* <Snackbar
        open={alertSent}
        autoHideDuration={3000}
        onClose={() => setAlertSent(false)}
        message="Compliance Alert & Audit Logged Successfully"
      /> */}

      <Footer />
    </div>
  );
}