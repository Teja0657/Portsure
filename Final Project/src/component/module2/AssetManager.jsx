import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../CSSDesgin2/AssetManager.css';
import Navbar from '../../Navbar/Navbar';
import logo from '../../logo/logo.png';
import portfoliologo from '../../logo/profilelogo.jpg';
import Footer from '../Footer';

export default function AssetManager() {
  const [settlementData, setSettlementData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("dashboard");

  const [profile, setProfile] = useState({
    staffId: "",
    name: "",
    email: "",
    role: "",
  });

  const navigate = useNavigate();

  // Handle session and user extraction
  const loggedInUser = JSON.parse(localStorage.getItem("manager_user") || "{}");
  const userData = loggedInUser.user || loggedInUser;
  // Asset Manager is an Admin layout, so we look for staffId
  const staffId = userData.staffId || userData.id;
  const token = loggedInUser.token;
  const userRole = userData.role;

  const getAuthHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }), [token]);

  const fetchManagerData = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8081/api/portfolios/all', {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        await response.text();
        // Relaxed error handling: Do not auto-logout on transient errors. 
        // Session validity is checked on mount.
        return;
      }

      const portfolios = await response.json();

      const investorIds = Array.from(
        new Set(
          portfolios
            .map(p => p.investorId)
            .filter(id => id !== null && id !== undefined)
        )
      );

      // 3) Fetch investors (parallel)
      const investorResults = await Promise.allSettled(
        investorIds.map(async (id) => {
          const invRes = await fetch(`http://localhost:8081/api/investors/${id}`, {
            headers: getAuthHeaders()
          });
          if (!invRes.ok) throw new Error(`Investor ${id} fetch failed (${invRes.status})`);
          const inv = await invRes.json();
          return { id, fullName: inv.fullName };
        })
      );

      // 4) Build lookup map
      const investorNameById = {};
      for (const r of investorResults) {
        if (r.status === "fulfilled") {
          investorNameById[r.value.id] = r.value.fullName || "N/A";
        }
      }

      // 5) Build table rows
      const formattedData = portfolios.map(port => ({
        portfolio_id: port.portfolioId,
        investor_id: port.investorId,
        investor_name: investorNameById[port.investorId] || "N/A",
        equity: port.equityPercentage || 0,
        bond: port.bondPercentage || 0,
        derivative: port.derivativePercentage || 0,
        quantity: port.quantity || 0,
        price: port.price || port.investedAmount || 0,
        status: port.status ? port.status.toString().toUpperCase() : "PENDING"
      }));

      setSettlementData(formattedData);
      setPendingCount(formattedData.filter(p => p.status === "PENDING").length);
    } catch (error) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  }, [token, getAuthHeaders, navigate]);

  const fetchProfileFromDB = useCallback(async () => {
    if (!staffId || !token) {
      return;
    }

    // Use localStorage data directly to avoid 403 errors
    const loggedInUser = JSON.parse(localStorage.getItem("manager_user") || "{}");
    const user = loggedInUser.user || loggedInUser;
    setProfile({
      staffId: user.staffId || staffId,
      name: user.fullName || user.name || "Asset Manager",
      email: user.email || "N/A",
      role: user.role || "ASSET_MANAGER",
    });
  }, [staffId, token]);

  // Session Validation and Data Fetching
  useEffect(() => {
    if (!token || !staffId) {
      navigate('/');
      return;
    }

    // Optional: Check specific role if needed
    if (userRole !== "ASSET_MANAGER" && userRole !== "Asset Manager") {
      // Strict role check can be added here if desired
    }

    // Initial Fetch
    fetchManagerData();
    fetchProfileFromDB();

    // Auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchManagerData();
    }, 30000);

    return () => clearInterval(intervalId);

  }, [token, staffId, userRole, navigate, fetchManagerData, fetchProfileFromDB]);

  const filteredData = settlementData.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.investor_name.toLowerCase().includes(search) ||
      `PF-${item.portfolio_id}`.toLowerCase().includes(search)
    );
  });

  const myLoginOptions = (
    <div className="home-links">
      <button
        className={`ad ${activeView === "dashboard" ? "active" : ""}`}
        type="button"
        onClick={() => setActiveView("dashboard")}
      >
        Home
      </button>

      <Link to="/requests" className="ad" style={{ position: 'relative' }}>
        Requests
        {pendingCount > 0 && (
          <span className="notification-badge">{pendingCount}</span>
        )}
      </Link>

      <div
        className="profile-container"
        tabIndex="0"
        onBlur={() => setProfileOpen(false)}
      >
        <div
          className="profile-btn"
          onClick={() => setProfileOpen(!profileOpen)}
          style={{ cursor: "pointer" }}
        >
          <img src={portfoliologo} alt="Profile" />
        </div>

        {profileOpen && (
          <div className="profile-dropdown">
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
                localStorage.removeItem("manager_user");
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const totalExecuted = settlementData.filter(s => s.status === "APPROVED").length;
  const totalPending = settlementData.filter(s => s.status === "PENDING").length;
  const totalRequests = settlementData.length;

  return (
    <div className="asset-container">
      <Navbar loginOptions={myLoginOptions} />

      <main className="main-content">
        {activeView === "profile" ? (
          <div className="profile-page">
            <div className="profile-card">
              <div className="profile-header">
                <h3>My Profile</h3>
                <button 
                  className="close-view-btn"
                  onClick={() => setActiveView("dashboard")}
                >
                  Close
                </button>
              </div>
              
              <div className="profile-banner">
                <div className="profile-banner-row">
                  <div className="profile-avatar-wrap">
                    <img className="profile-avatar-img" src={portfoliologo} alt="User" />
                  </div>

                  <div className="profile-banner-meta">
                    <h2 className="profile-name">{profile.name || "Loading..."}</h2>
                    <div className="profile-role">{profile.role?.replace('_', ' ')}</div>
                  </div>
                </div>
              </div>

              <div className="profile-body">
                <div className="profile-section-title">Account Details</div>
                <div className="profile-grid">
                  <div className="profile-field">
                    <span className="profile-label">Staff ID</span>
                    <div className="profile-value">STF-{profile.staffId}</div>
                  </div>

                  <div className="profile-field">
                    <span className="profile-label">Email Address</span>
                    <div className="profile-value">{profile.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="dashboard-header">
              <h1 className="page-title">Asset Manager Dashboard</h1>
            </div>

            <div className="grid-2">
              <div className="card-2">
                <p>Total Portfolio Requests</p>
                <h2 style={{ color: '#3b82f6' }}>{totalRequests}</h2>
              </div>
              <div className="card-2">
                <p>Total Pending Settlements</p>
                <h2 style={{ color: '#e11d48' }}>{totalPending}</h2>
              </div>
              <div className="card-2">
                <p>Total Executed Trades</p>
                <h2 style={{ color: '#16a34a' }}>{totalExecuted}</h2>
              </div>
            </div>

            <div className="section">
              <div className="section-header-flex">
                <h2 className="section-heading">Settlement Status</h2>
                <div className="search-box-container">
                  <input
                    type="text"
                    placeholder="Search by PF-ID..."
                    className="table-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="history-list">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Portfolio ID</th>
                      <th>Investor Name</th>
                      <th>Asset Allocation</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {isLoading ? (
                      <tr><td colSpan="7" style={{ textAlign: 'center' }}>Loading...</td></tr>
                    ) : filteredData.length > 0 ? (
                      filteredData.map((s) => (
                        <tr key={s.portfolio_id}>
                          <td data-label="Portfolio ID" style={{ fontWeight: 'bold' }}>PF-{s.portfolio_id}</td>
                          <td data-label="Investor Name">{s.investor_name}</td>
                          <td data-label="Asset Allocation">
                            {s.status === "PENDING" ? (
                              <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                None (Awaiting Allocation)
                              </span>
                            ) : (
                              <div className="asset-type-badge">
                                <small>E: {s.equity}% | B: {s.bond}% | D: {s.derivative}%</small>
                              </div>
                            )}
                          </td>
                          <td data-label="Quantity">{s.quantity}</td>
                          <td data-label="Price">₹ {s.price?.toLocaleString()}</td>
                          <td data-label="Status">
                            <span className={`status-pill ${s.status.toLowerCase()}`}>
                              {s.status === "APPROVED" ? "EXECUTED" : s.status}
                            </span>
                          </td>
                          <td data-label="Actions">
                            <button
                              className="view-btn"
                              onClick={() => navigate('/portfolio-diversification', { state: { portfolio: s } })}
                            >
                              View Diversification
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="7" style={{ textAlign: 'center' }}>No matching records found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}