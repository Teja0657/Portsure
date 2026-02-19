import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import "../../CSSDesgin5/InvestorDashboard.css";
import logo from "../../logo/logo.png";
import Profilelogo from "../../logo/profilelogo.jpg";
import NotificationPanel from '../module2/TradeCature';
export default function InvestorDashboard() {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem('investor_user') || '{}');
  // Handle nested user object if present (from new Admin/Investor login structure)
  const userData = loggedInUser.user || loggedInUser;
  const investorId = userData.investorId || userData.id;
  const token = loggedInUser.token;

  useEffect(() => {
    if (!token || !investorId) {
      console.warn("No valid session found, redirecting to login.");
      navigate('/');
    }
  }, [token, investorId, navigate]);

  const [activeView, setActiveView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState("");
  const [portfolioName, setPortfolioName] = useState("");
  const [investment, setInvestment] = useState("");
  const [portfolioData, setPortfolioData] = useState([]);

  const [expandedRowId, setExpandedRowId] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [readAlerts, setReadAlerts] = useState(() => {
    const saved = localStorage.getItem('investor_read_alerts');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [editUser, setEditUser] = useState({ ...userData });
  const [passwords, setPasswords] = useState({ current: "", next: "" });

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const toggleRow = async (id) => {
    if (expandedRowId === id) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(id);
      try {
        const allowedStatuses = ['APPROVED', 'EXECUTED', 'COMPLETED'];
        const port = portfolioData.find(p => p.portfolioId === id);
        const status = String(port?.status || '').toUpperCase();

        console.log(`Portfolio ${id} status: "${status}"`);
        console.log(`Allowed statuses:`, allowedStatuses);
        console.log(`Will fetch risk score:`, allowedStatuses.includes(status));

        if (!allowedStatuses.includes(status)) {
          // Mark riskScore as null for clarity in UI and skip the network call
          setPortfolioData(prevData => prevData.map(p =>
            p.portfolioId === id ? { ...p, riskScore: null } : p
          ));
          console.log(`Skipping risk score fetch - status "${status}" not in allowed list`);
          return;
        }

        console.log(`Fetching risk score from: http://localhost:8081/api/risk-scores/portfolio/${id}`);
        const response = await fetch(`http://localhost:8081/api/risk-scores/portfolio/${id}`, {
          headers: getAuthHeaders()
        });
        
        console.log(`Risk score API response status:`, response.status);
        
        if (response.ok) {
          const scoreData = await response.json();
          console.log(`Risk score data received:`, scoreData);

          setPortfolioData(prevData => prevData.map(port =>
            port.portfolioId === id ? { ...port, riskScore: scoreData } : port
          ));
        } else {
          const errorText = await response.text();
          console.error(`Risk score fetch failed: ${response.status} - ${errorText}`);
          setPortfolioData(prevData => prevData.map(p =>
            p.portfolioId === id ? { ...p, riskScore: null } : p
          ));
        }
      } catch (err) {
        console.error("Risk Score fetch error:", err);
        setPortfolioData(prevData => prevData.map(p =>
          p.portfolioId === id ? { ...p, riskScore: null } : p
        ));
      }
    }
  };
  const fetchPortfolios = useCallback(async () => {
    if (!investorId) {
      console.error("Session missing: No Investor ID found.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/portfolios/investor/${investorId}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setPortfolioData(data);
      } else {
        console.error("Failed to fetch portfolios:", response.status);
        // Relaxed error handling: Do not auto-logout on transient errors.
      }
    } catch (err) {
      console.error("Network Error (GET): Is Spring Boot running?", err);
    }
  }, [investorId, token, navigate]);

  const fetchAlerts = useCallback(async () => {
    if (!investorId || portfolioData.length === 0) return;

    try {
      const exposureRes = await fetch(`http://localhost:8081/api/alerts/investor/${investorId}`, {
        headers: getAuthHeaders()
      });
      const exposureData = exposureRes.ok ? await exposureRes.json() : [];

      const allLogsArrays = [];

      const breaches = allLogsArrays.flat()
        .filter(log => log.status === "BREACH" || log.status === "NON-COMPLIANT")
        .map((log, index) => ({
          ...log,

          portfolioId: log.portfolio?.portfolioId || log.portfolioId || "N/A",
          date: log.timestamp || log.date || new Date().toISOString(),
          id: log.id || `compliance-${index}`,

          alertType: "Compliance Breach",
          message: log.findings || "No findings reported"
        }));

      setAlerts([...exposureData, ...breaches]);

    } catch (err) {
      console.error("Error fetching notification alerts:", err);
    }
  }, [investorId, portfolioData, token]);
  
  // Persist readAlerts to localStorage
  useEffect(() => {
    localStorage.setItem('investor_read_alerts', JSON.stringify([...readAlerts]));
  }, [readAlerts]);
  
  useEffect(() => {
    if (portfolioData.length > 0) {
      fetchAlerts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioData.length]);
  useEffect(() => {
    if (token && investorId) {
      fetchPortfolios();

      // Auto-refresh every 30 seconds
      const intervalId = setInterval(() => {
        fetchPortfolios();
      }, 30000);

      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, investorId, fetchPortfolios]);

  const handleResendClick = (port) => {
    setPortfolioName(port.portfolioName);
    setInvestment(port.investedAmount);
    setEditingPortfolioId(port.portfolioId);
    setIsEditMode(true);
    setActiveView('createPortfolio');
  };

  const resetForm = () => {
    setPortfolioName("");
    setInvestment("");
    setIsEditMode(false);
    setEditingPortfolioId(null);
    setActiveView('dashboard');
  };

  const handleSendRequest = async () => {
    if (!investorId) {
      alert("Session expired. Please log in again.");
      navigate('/');
      return;
    }

    if (!portfolioName || !investment) {
      alert("Please enter portfolio name and amount.");
      return;
    }

    const payload = {
      portfolioName: portfolioName,
      investedAmount: parseFloat(investment)
    };

    try {
      const url = isEditMode
        ? `http://localhost:8081/api/portfolios/resubmit/${editingPortfolioId}`
        : `http://localhost:8081/api/portfolios/submit/${investorId}`;

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        // alert(isEditMode ? `Request for PF-${editingPortfolioId} resent!` : `Success! Portfolio PF-${data.portfolioId} created.`);

        fetchPortfolios();
        resetForm();
      } else {
        const errorText = await response.text();
        console.error("Backend Error:", errorText);
        alert("Server Error: " + errorText);
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Could not connect to the server.");
    }
  };
  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/investors/update/${investorId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(editUser),
      });

      if (response.ok) {
        const updatedData = await response.json();
        // Preserve token while updating user data
        localStorage.setItem('investor_user', JSON.stringify({ token, user: updatedData }));
        alert("Profile updated successfully!");
        setActiveView('profile');
        window.location.reload();
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("Connection error while updating profile.");
    }
  };
  const handlePasswordUpdate = async () => {
    if (!passwords.current || !passwords.next) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/investors/update-password/${investorId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          password: passwords.current,
          fullName: passwords.next
        }),
      });

      const message = await response.text();
      if (response.ok) {
        alert("Password updated successfully!");
        setPasswords({ current: "", next: "" });
        setActiveView('dashboard');
      } else {
        alert(message);
      }
    } catch (err) {
      console.error("Password Update Error:", err);
    }
  };
  const filteredPortfolios = portfolioData.filter(port => {
    const searchLower = searchTerm.toLowerCase().trim();
    const portfolioIdStr = `pf-${port.portfolioId}`.toLowerCase();
    const portfolioNameLower = (port.portfolioName || "").toLowerCase();
    
    return portfolioNameLower.includes(searchLower) || 
           portfolioIdStr.includes(searchLower) ||
           port.portfolioId?.toString().includes(searchLower);
  });
  const navOptions = (
    <div className="home-links">
      <button
        onClick={resetForm}
        className={`ad ${activeView === 'dashboard' ? 'active' : ''}`}
      >
        Home
      </button>
      <Link to="/portfolio-performances" className="ad">Performance Dashboard</Link>
      <div className="notification-icon" onClick={() => setActiveView('notifications')} style={{ cursor: 'pointer', position: 'relative' }}>
        🔔 {(() => {
          const unreadCount = alerts.filter((alert, index) => {
            const alertId = alert.id || alert.alertId || index;
            return !readAlerts.has(alertId);
          }).length;
          return unreadCount > 0 && <span className="badge" style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', padding: '2px 5px', fontSize: '10px' }}>{unreadCount}</span>;
        })()}
      </div>
      <div
        className="profile-container"
        tabIndex="0"
        onBlur={() => setProfileOpen(false)}
      >
        <div
          className="profile-btn"
          onClick={() => setProfileOpen(!profileOpen)}
        >
          <img src={Profilelogo} alt="Profile" />
        </div>
        {profileOpen && (
          <div className="profile-dropdown">
            <button onMouseDown={(e) => { e.preventDefault(); setProfileOpen(false); setActiveView('profile'); }}>My Profile</button>
            <button onMouseDown={(e) => { e.preventDefault(); setProfileOpen(false); setActiveView('password'); }}>Update Password</button>
            <button onMouseDown={(e) => { e.preventDefault(); setProfileOpen(false); setActiveView('terms'); }}>Terms & Conditions</button>
            <hr />
            <button className="logout-btn" onMouseDown={(e) => {
              e.preventDefault();
              setProfileOpen(false);
              localStorage.removeItem('investor_user');
              navigate('/');
            }}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <Navbar loginOptions={navOptions} />
      <div className='label'>Welcome {userData.fullName || "User"}!</div>

      <main className="dashboard-content">
        {/* CREATE / EDIT PORTFOLIO VIEW */}
        {activeView === 'createPortfolio' && (
          <section className="inner-view-section">
            <div className="module-card1">
              <div className="module-header">
                <h3>{isEditMode ? `Resend Request (PF-${editingPortfolioId})` : "Create New Portfolio"}</h3>
                <button className="close-view-btn" onClick={resetForm}>Close</button>
              </div>
              <div className="form-container2">
                <div className="form-grid-2">
                  <label>Portfolio Name
                    <input
                      type="text"
                      placeholder="e.g. Tech Growth"
                      value={portfolioName}
                      onChange={(e) => setPortfolioName(e.target.value)}
                    />
                  </label>
                  <label>Initial Investment (₹)
                    <input
                      type="number"
                      placeholder="0.00"
                      value={investment}
                      onChange={(e) => setInvestment(e.target.value)}
                    />
                  </label>
                </div>
                <button className="submit-btn2" onClick={handleSendRequest}>
                  {isEditMode ? "Confirm & Resend" : "Send Request"}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* PROFILE VIEW */}
        {activeView === 'profile' && (
          <section className="inner-view-section">
            <div className="module-card1">
              <div className="module-header">
                <h3>My Profile</h3>
                <button className="close-view-btn" onClick={() => setActiveView('dashboard')}>Close</button>
              </div>
              <div className="profile-details">
                <img src={Profilelogo} className="large-profile-img" alt="User" />
                <div className="profile-info-grid">
                  <p><strong>Investor ID:</strong> INF-{userData.investorId || userData.id || 'N/A'}</p>
                  <p><strong>Name:</strong> {userData.fullName}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>Phone:</strong> {userData.phoneNumber}</p>
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button className="submit-btn2" onClick={() => setActiveView('editProfile')}>
                      ✏️ Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        {/* UPDATE PROFILE VIEW */}
        {activeView === 'editProfile' && (
          <section className="inner-view-section">
            <div className="module-card1">
              <div className="module-header">
                <h3>Update Profile</h3>
                <button className="close-view-btn" onClick={() => setActiveView('profile')}>Back</button>
              </div>
              <div className="form-container2">
                <div className="form-grid-2">
                  <label>Full Name
                    <input
                      type="text"
                      value={editUser.fullName || ""}
                      onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
                    />
                  </label>
                  <label>Phone Number
                    <input
                      type="text"
                      value={editUser.phoneNumber || ""}
                      onChange={(e) => setEditUser({ ...editUser, phoneNumber: e.target.value })}
                    />
                  </label>
                  <label>Email
                    <input
                      type="text"
                      value={editUser.email || ""}
                      onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    />
                  </label>
                </div>

                <button className="submit-btn2" onClick={handleUpdateProfile} style={{ marginTop: '20px' }}>
                  Save Changes
                </button>
              </div>
            </div>
          </section>
        )}
        {activeView === 'notifications' && (
          <NotificationPanel
            alerts={alerts}
            readAlerts={readAlerts}
            setReadAlerts={setReadAlerts}
            onClose={() => setActiveView('dashboard')}
          />
        )}
        {/* PASSWORD VIEW */}
        {activeView === 'password' && (
          <section className="inner-view-section">
            <div className="module-card1">
              <div className="module-header">
                <h3>Update Password</h3>
                <button className="close-view-btn" onClick={() => setActiveView('dashboard')}>Close</button>
              </div>
              <div className="form-container">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                />
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.next}
                  onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                />
                <button className="submit-btn" onClick={handlePasswordUpdate}>Update Password</button>
              </div>
            </div>
          </section>
        )}

        {/* TERMS VIEW */}
        {activeView === 'terms' && (
          <section className="inner-view-section">
            <div className="module-card1">
              <div className="module-header">
                <h3>Terms & Conditions</h3>
                <button className="close-view-btn" onClick={() => setActiveView('dashboard')}>Close</button>
              </div>
              <div className="terms-text">
                <p>1. Data Privacy: Your portfolio data is encrypted.</p>
                <p>2. Compliance: All reports follow SEBI or MiFID II standards.</p>
                <div style={{ marginLeft: '30px' }}>
                  <p><strong>SEBI (Securities and Exchange Board of India) Rules:</strong></p>
                  <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                    <li>Risk Management: Derivative percentage cannot exceed Bond percentage</li>
                    <li>Regulatory Cap: Derivatives cannot exceed 50% of total portfolio</li>
                    <li>Liquidity Requirement: Bonds must constitute at least 10% of portfolio</li>
                  </ul>
                  <p><strong>MiFID II (Markets in Financial Instruments Directive) Rules:</strong></p>
                  <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                    <li>Speculative Control: Derivatives cannot exceed Equity allocation</li>
                    <li>Risk Asset Cap: Combined Equity and Derivatives must not exceed 80%</li>
                    <li>Diversification Standard: Combined Bond and Equity must be at least 30%</li>
                  </ul>
                </div>
                <p>3. Usage: System is for authorized investor use only.</p>
              </div>
            </div>
          </section>
        )}

        {/* DASHBOARD SUMMARY & TABLE */}
        {activeView === 'dashboard' && (
          <>
            <section className="section-header">
              <div className="account-summary-grid">
                <div className="stat-card">
                  <div className="stat-icon portfolio-icon">📁</div>
                  <div className="stat-content"><p>Total Portfolios</p><h3>{portfolioData.length}</h3></div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon invested-icon">📈</div>
                  <div className="stat-content">
                    <p>Total Invested</p>
                    <h3>₹ {portfolioData.reduce((acc, curr) => acc + (curr.investedAmount || 0), 0).toLocaleString()}</h3>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon gain-loss-icon">💰</div>
                  <div className="stat-content">
                    <p>Total Gain/Loss</p>
                    <h3 style={{
                      color: (() => {
                        let totalGainLoss = 0;

                        // Calculate total gain/loss by summing individual portfolio gains/losses
                        portfolioData.forEach((curr, idx) => {
                          const allowedStatuses = ['APPROVED', 'EXECUTED', 'COMPLETED'];
                          const isApproved = allowedStatuses.includes(String(curr.status || '').toUpperCase());
                          if (!isApproved) return;

                          const invested = Number(curr.investedAmount || 0);

                          // Use portfolioId as seed for consistent random-like behavior
                          const seed = curr.portfolioId || idx;

                          // True random distribution: 60% profit, 40% loss (not sequential)
                          // Use a hash-like function for better randomization
                          const hash = (seed * 2654435761) % 100; // Large prime for distribution
                          const isProfit = hash < 60; // 60% chance of profit

                          // Generate unique decimal return percentage for EACH portfolio
                          let returnPercentage;
                          if (isProfit) {
                            // Profit: 2.0% to 15.9% with decimals
                            const variation = ((seed * 17 + seed * seed * 13) % 1400) / 100;
                            returnPercentage = 0.02 + variation / 100;
                          } else {
                            // Loss: -2.0% to -12.9% with decimals
                            const variation = ((seed * 23 + seed * seed * 19) % 1100) / 100;
                            returnPercentage = -0.02 - variation / 100;
                          }

                          const finalValue = invested * (1 + returnPercentage);
                          const gainLoss = finalValue - invested;

                          // Sum all gains and losses
                          totalGainLoss += gainLoss;
                        });

                        return totalGainLoss >= 0 ? 'green' : 'red';
                      })()
                    }}>
                      ₹ {(() => {
                        let totalGainLoss = 0;

                        // Calculate total gain/loss by summing individual portfolio gains/losses
                        portfolioData.forEach((curr, idx) => {
                          const allowedStatuses = ['APPROVED', 'EXECUTED', 'COMPLETED'];
                          const isApproved = allowedStatuses.includes(String(curr.status || '').toUpperCase());
                          if (!isApproved) return;

                          const invested = Number(curr.investedAmount || 0);

                          // Use portfolioId as seed for consistent random-like behavior
                          const seed = curr.portfolioId || idx;

                          // True random distribution: 60% profit, 40% loss (not sequential)
                          // Use a hash-like function for better randomization
                          const hash = (seed * 2654435761) % 100; // Large prime for distribution
                          const isProfit = hash < 60; // 60% chance of profit

                          // Generate unique decimal return percentage for EACH portfolio
                          let returnPercentage;
                          if (isProfit) {
                            // Profit: 2.0% to 15.9% with decimals
                            const variation = ((seed * 17 + seed * seed * 13) % 1400) / 100;
                            returnPercentage = 0.02 + variation / 100;
                          } else {
                            // Loss: -2.0% to -12.9% with decimals
                            const variation = ((seed * 23 + seed * seed * 19) % 1100) / 100;
                            returnPercentage = -0.02 - variation / 100;
                          }

                          const finalValue = invested * (1 + returnPercentage);
                          const gainLoss = finalValue - invested;

                          // Sum all gains and losses
                          totalGainLoss += gainLoss;
                        });

                        return totalGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                      })()}
                    </h3>
                  </div>
                </div>
              </div>
              <button className="btn-create-small" onClick={() => setActiveView('createPortfolio')}>
                <span className="plus-plus">+</span> Create Portfolio
              </button>
            </section>

            <section className="portfolio-section">
              <div className="module-card">
                <div className="module-header">
                  <h3>My Portfolios</h3>
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Search ID or Name..."
                      className="table-search-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="pad">
                  <table className="portfolio-table">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Portfolio ID</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPortfolios.length > 0 ? (
                        filteredPortfolios.map((port, index) => (
                          <React.Fragment key={port.portfolioId}>
                            <tr
                              className={`portfolio-row ${expandedRowId === port.portfolioId ? 'active-row' : ''}`}
                              onClick={() => toggleRow(port.portfolioId)}
                              style={{ cursor: 'pointer' }}
                            >
                              <td data-label="Sr.No">{index + 1}</td>
                              <td data-label="Portfolio ID"><strong>PF-{port.portfolioId}</strong></td>
                              <td data-label="Name">{port.portfolioName}</td>
                              <td data-label="Amount">₹{port.investedAmount?.toLocaleString()}</td>
                              <td data-label="Status">
                                <span className={`status-badge ${(port.status || 'Pending').toLowerCase()}`}>
                                  {port.status || "Pending"}
                                </span>
                              </td>
                              <td data-label="Quantity">{port.quantity || 0} units</td>
                            </tr>

                            {expandedRowId === port.portfolioId && (
                              <tr className="expansion-row">
                                <td colSpan="6">
                                  <div className="allocation-details">
                                    <div className="allocation-header">
                                      <h4>Allocation Breakdown</h4>
                                      <button className="resend-btn" onClick={(e) => { e.stopPropagation(); handleResendClick(port); }}>
                                        🔄 Resend Request
                                      </button>
                                    </div>
                                    <div className="details-grid">
                                      <div className="detail-item">
                                        <label>Equity: <span>{port.equityPercentage || 0}%</span></label>
                                        <div className="progress-mini">
                                          <div style={{ width: `${port.equityPercentage || 0}%`, backgroundColor: '#2563eb' }}></div>
                                        </div>
                                      </div>
                                      <div className="detail-item">
                                        <label>Bonds: <span>{port.bondPercentage || 0}%</span></label>
                                        <div className="progress-mini">
                                          <div style={{ width: `${port.bondPercentage || 0}%`, backgroundColor: '#10b981' }}></div>
                                        </div>
                                      </div>
                                      <div className="detail-item">
                                        <label>Derivatives: <span>{port.derivativePercentage || 0}%</span></label>
                                        <div className="progress-mini">
                                          <div style={{ width: `${port.derivativePercentage || 0}%`, backgroundColor: '#f59e0b' }}></div>
                                        </div>
                                      </div>
                                      <div className="detail-item">
                                        <label>Total Risk Score:</label>
                                        <span className={`risk-value-large ${port.riskScore?.calculatedScore > 70 ? 'high-risk' : 'low-risk'}`}>
                                          {port.riskScore?.calculatedScore !== undefined ? `${port.riskScore.calculatedScore}%` : 'N/A'}
                                        </span>
                                      </div>
                                      <div className="detail-item">
                                        <label>Regulation Type:</label>
                                        <span className="regulation-tag">
                                          {port.regulationType || "Not Specified"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <tr><td colSpan="6" style={{ textAlign: 'center' }}>No records found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <footer className="home-footer1">
        <img src={logo} alt="PortSure Admin" className="hero-logo-footer" />
        <h5>@2025 PortSure – Portfolio Risk Analysis & Investment Compliance System</h5>
      </footer>
    </div>
  );
}