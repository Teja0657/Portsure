import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, AlertTriangle, CheckCircle } from "lucide-react";
import "../../CSSDesgin4/ComplianceDashboard.css";
import Navbar from "../../Navbar/Navbar.jsx";
import logo from "../../logo/logo.png";
import profileLogo from "../../logo/profilelogo.jpg";

function SummaryCard({ title, value, variant = "default", icon: Icon }) {
  return (
    <div className={`card summary-card ${variant}`}>
      <div className="card-icon-container">{Icon && <Icon size={28} />}</div>
      <div className="card-text-container">
        <span className="summary-card-title">{title}</span>
        <span className="summary-card-value">{value}</span>
      </div>
    </div>
  );
}

export default function ComplianceDashboard() {
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem("compliance_user") || "{}");
  // Handle nested user object if present (from new Admin/Investor login structure)
  const userData = loggedInUser.user || loggedInUser;
  const staffId = userData.staffId || userData.id;
  const token = loggedInUser.token;

  useEffect(() => {
    if (!token || !staffId) {
      navigate('/');
    }
  }, [token, staffId, navigate]);

  const [profile, setProfile] = useState({
    staffId: "",
    name: "",
    email: "",
    role: "",
  });

  const [complianceLogs, setComplianceLogs] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, nonCompliant: 0, compliant: 0 });
  const [auditing, setAuditing] = useState(false);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const fetchData = async () => {
    try {
      const logsRes = await fetch("http://localhost:8081/api/compliance/logs", {
        headers: getAuthHeaders()
      });
      const logsData = await logsRes.json();

      const portfolioRes = await fetch("http://localhost:8081/api/portfolios/all", {
        headers: getAuthHeaders()
      });
      const portfolioData = await portfolioRes.json();

      const totalCount = Array.isArray(portfolioData) ? portfolioData.length : 0;
      const logs = Array.isArray(logsData) ? logsData : [];

      const compliantLogs = logs.filter((l) =>
        l.complianceStatus?.toUpperCase() === "COMPLIANCE" ||
        l.complianceStatus?.toUpperCase() === "COMPLIANT"
      );
      const nonCompliantLogs = logs.filter((l) =>
        ["BREACH", "NON-COMPLIANT", "NON_COMPLIANT", "NON-COMPLIANCE", "CRITICAL_BREACH"].includes(l.complianceStatus?.toUpperCase())
      );

      setMetrics({
        total: totalCount,
        compliant: compliantLogs.length,
        nonCompliant: nonCompliantLogs.length,
      });
      setComplianceLogs(logsData);
    } catch (err) {
      // Error handling
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();

      // Auto-refresh every 30 seconds
      const intervalId = setInterval(() => {
        fetchData();
      }, 30000);

      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (activeView !== "profile") return;
      if (!staffId) {
        return;
      }

      // Use localStorage data directly to avoid 403 errors
      const loggedInUser = JSON.parse(localStorage.getItem("compliance_user") || "{}");
      const user = loggedInUser.user || loggedInUser;
      setProfile({
        staffId: user.staffId || staffId,
        name: user.fullName || user.name || "Compliance Officer",
        email: user.email || "N/A",
        role: user.role || "COMPLIANCE_OFFICER",
      });
    };

    fetchProfile();
  }, [activeView, staffId]);

  // Filter to show only NON-COMPLIANT reports
  const alerts = complianceLogs.filter((log) =>
    ["BREACH", "NON-COMPLIANT", "NON_COMPLIANT", "NON-COMPLIANCE", "CRITICAL_BREACH"].includes(log.complianceStatus?.toUpperCase())
  );

  const handleAuditAll = async () => {
    // if (!window.confirm("This will audit all portfolios.")) return;
    setAuditing(true);

    // Clear all logs immediately
    setComplianceLogs([]);
    setMetrics({ total: 0, nonCompliant: 0, compliant: 0 });

    try {
      const res = await fetch("http://localhost:8081/api/compliance/audit-all", {
        method: "POST",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        // alert("Audit completed successfully!");
        await fetchData();
      } else {
        alert("Audit failed: " + await res.text());
        await fetchData(); // Refetch to show any existing logs
      }
    } catch (err) {
      alert("Failed to trigger audit.");
      await fetchData(); // Refetch to show any existing logs
    } finally {
      setAuditing(false);
    }
  };

  const navOptions = (
    <div className="home-links">
      <button
        type="button"
        className={`ad ${activeView === "dashboard" ? "active" : ""}`}
        onClick={() => setActiveView("dashboard")}
      >
        Home
      </button>

      <Link to="/compliance-logs" className="ad">Logs</Link>
      <Link to="/risk-score" className="ad">Risk Score</Link>
      <Link to="/exposure-alerts" className="ad">Alerts</Link>

      {/* Profile dropdown */}
      <div
        className="cd-profile-container"
        tabIndex="0"
        onBlur={() => setProfileOpen(false)}
      >
        <div
          className="cd-profile-btn"
          onClick={() => setProfileOpen((p) => !p)}
        >
          <img src={profileLogo} alt="Profile" />
        </div>

        {profileOpen && (
          <div className="cd-profile-dropdown">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setProfileOpen(false);
                setActiveView("profile");
              }}
            >
              My Profile
            </button>

            <hr />

            <button
              type="button"
              className="logout-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                setProfileOpen(false);
                localStorage.removeItem("compliance_user");
                navigate("/");
              }}
            >
              LogOut
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout-1">
      <Navbar loginOptions={navOptions} />

      {activeView === "profile" ? (
        <main className="cd-profile-page">
          <div className="cd-profile-card">
            <div className="cd-profile-header">
              <h3>My Profile</h3>
              <button 
                className="close-view-btn"
                onClick={() => setActiveView("dashboard")}
              >
                Close
              </button>
            </div>
            
            <div className="cd-profile-banner">
              <div className="cd-profile-banner-row">
                <div className="cd-profile-avatar-wrap">
                  <img className="cd-profile-avatar-img" src={profileLogo} alt="User" />
                </div>
                <div className="cd-profile-banner-meta">

                  <h2 className="cd-profile-name">{profile.name || "Compliance Officer"}</h2>
                  <div className="cd-profile-role">{profile.role?.replace("_", " ") || "—"}</div>
                </div>
              </div>
            </div>

            <div className="cd-profile-body">
              <div className="cd-profile-section-title">Account Details</div>

              <div className="cd-profile-grid">
                <div className="cd-profile-field">
                  <span className="cd-profile-label">Staff ID</span>
                  <div className="cd-profile-value">STF-{profile.staffId || "—"}</div>
                </div>

                <div className="cd-profile-field">
                  <span className="cd-profile-label">Email</span>
                  <div className="cd-profile-value">{profile.email || "—"}</div>
                </div>

              </div>
            </div>
          </div>
        </main>
      ) : (
        <>
          <h1 className="section-title-1">COMPLIANCE DASHBOARD</h1>

          <div className="kpi-grid-1 dual-grid">
            <SummaryCard
              title="Total Portfolios"
              value={metrics.total}
              icon={Briefcase}
              variant="total"
            />
            <SummaryCard
              title={`Compliant Portfolios`}
              value={metrics.compliant}
              icon={CheckCircle}
              variant="success"
            />
            <SummaryCard
              title="Non-Compliant Portfolios"
              value={metrics.nonCompliant}
              icon={AlertTriangle}
              variant="danger"
            />
          </div>

          <div className="card-3">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
              <h2 className="recent-alerts-header">NON-COMPLIANT LOGS</h2>
              <button
                className="run-audit-btn"
                onClick={handleAuditAll}
                disabled={auditing}
                style={{
                  background: "var(--primary)",
                  color: "white",
                  padding: "0.625rem 1.25rem",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  border: "none",
                  cursor: auditing ? "not-allowed" : "pointer",
                  opacity: auditing ? 0.6 : 1,
                  transition: "var(--transition-base)",
                  boxShadow: "var(--shadow-sm)",
                  marginRight: "50px"
                }}
                onMouseEnter={(e) => !auditing && (e.target.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
              >
                {auditing ? "Auditing..." : "Run Audit"}
              </button>
            </div>
            <div className="alerts-container">
              <table className="alerts-table">
                <thead>
                  <tr>
                    <th>Portfolio ID</th>
                    <th>Description</th>
                    <th>Regulation Type</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.length > 0 ? (
                    alerts.map((alert, idx) => (
                      <tr key={alert.logId || `${alert.portfolioId}-${idx}`} className="alert-row">
                        <td data-label="Portfolio ID">PF-{alert.portfolioId}</td>
                        <td data-label="Description" className="findings">{alert.findings}</td>
                        <td data-label="Regulation Type"><span className="alert-tag">{alert.regulationType}</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="no-data-msg">
                        No non-compliant portfolios detected. All portfolios are compliant.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <footer className="home-footer1">
        <img src={logo} alt="PortSure footer logo" className="hero-logo-footer" />
        <h5>© 2025 PortSure – Portfolio Risk Analysis & Investment Compliance System</h5>
      </footer>
    </div>
  );
}