import { useEffect, useState } from "react";
import "../styles/dashboard.css";

// --- SVG ICONS ---
const PortSureLogo = () => (
  <svg className="sidebar-logo" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 7V12C3 17.5228 6.77614 22.2587 12 23.5C17.2239 22.2587 21 17.5228 21 12V7L12 2Z" fillOpacity="0.4"/>
    <path d="M12 22C6.96998 20.8222 3.5066 16.4839 3.0401 11.5201L12 22Z" fill="currentColor"/>
  </svg>
);
const IconProfile = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
const IconCreate = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const IconList = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>;

export default function Dashboard({ goToLogin }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");

  // Data States
  const [editProfile, setEditProfile] = useState({ name: "", email: "", mobile: "" });
  
  // NEW: Asset Allocation State
  const [portfolio, setPortfolio] = useState({ 
    id: null, // Used for editing existing portfolios
    name: "", 
    equities: "", 
    bonds: "", 
    derivatives: "" 
  });
  
  const [selectedInvestor, setSelectedInvestor] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    const allUsers = JSON.parse(localStorage.getItem("portsure_users")) || [];
    setUser(loggedUser);
    setUsers(allUsers);
    
    if (loggedUser) {
      setEditProfile({
        name: loggedUser.name || "",
        email: loggedUser.email || "",
        mobile: loggedUser.mobile || "",
      });
    }
  }, []);

  if (!user) return <div style={{padding:"50px", textAlign:'center', color:'#64748b'}}>Loading Dashboard...</div>;

  const logout = () => {
    localStorage.removeItem("loggedUser");
    goToLogin();
  };

  const saveProfile = () => {
    const updatedUsers = [...users];
    const index = updatedUsers.findIndex((u) => u.id === user.id);
    updatedUsers[index] = { ...updatedUsers[index], ...editProfile };
    localStorage.setItem("portsure_users", JSON.stringify(updatedUsers));
    localStorage.setItem("loggedUser", JSON.stringify(updatedUsers[index]));
    setUsers(updatedUsers);
    setUser(updatedUsers[index]);
    alert("Profile updated successfully");
    setActiveTab("profile");
  };

  // --- NEW: Handle Asset Logic ---
  const handlePortfolioSubmit = () => {
    if (!portfolio.name) return alert("Please enter portfolio name");
    
    const eq = parseInt(portfolio.equities) || 0;
    const bd = parseInt(portfolio.bonds) || 0;
    const dr = parseInt(portfolio.derivatives) || 0;
    
    if ((eq + bd + dr) !== 100) {
      return alert(`Total allocation must be exactly 100%. Current total: ${eq + bd + dr}%`);
    }

    const updatedUsers = [...users];
    const userIndex = updatedUsers.findIndex((u) => u.id === user.id);
    
    if (!updatedUsers[userIndex].portfolios) updatedUsers[userIndex].portfolios = [];

    // Check if we are editing an existing portfolio
    if (portfolio.id) {
       const pIndex = updatedUsers[userIndex].portfolios.findIndex(p => p.portfolioId === portfolio.id);
       if (pIndex !== -1) {
         updatedUsers[userIndex].portfolios[pIndex].name = portfolio.name;
         updatedUsers[userIndex].portfolios[pIndex].assets = { equities: eq, bonds: bd, derivatives: dr };
         updatedUsers[userIndex].portfolios[pIndex].status = "PENDING"; // Reset to pending on edit
         alert("Portfolio updated! Request sent to Asset Manager.");
       }
    } else {
      // Create New
      const newPortfolio = {
        portfolioId: `PF-${Date.now()}`,
        name: portfolio.name,
        date: new Date().toLocaleDateString(),
        status: "PENDING", // Default status
        assets: { equities: eq, bonds: bd, derivatives: dr }
      };
      updatedUsers[userIndex].portfolios.push(newPortfolio);
      alert("Portfolio created! Assets pending Manager approval.");
    }

    localStorage.setItem("portsure_users", JSON.stringify(updatedUsers));
    localStorage.setItem("loggedUser", JSON.stringify(updatedUsers[userIndex]));
    setUsers(updatedUsers);
    setUser(updatedUsers[userIndex]);
    
    // Reset Form
    setPortfolio({ id: null, name: "", equities: "", bonds: "", derivatives: "" });
    setActiveTab("view");
  };

  const handleEditRequest = (p) => {
    setPortfolio({
      id: p.portfolioId,
      name: p.name,
      equities: p.assets.equities,
      bonds: p.assets.bonds,
      derivatives: p.assets.derivatives
    });
    setActiveTab("create"); // Re-use create tab for editing
  };

  const handleApprove = (investorId, portfolioId) => {
    const updatedUsers = [...users];
    const uIndex = updatedUsers.findIndex(u => u.id === investorId);
    const pIndex = updatedUsers[uIndex].portfolios.findIndex(p => p.portfolioId === portfolioId);
    
    updatedUsers[uIndex].portfolios[pIndex].status = "APPROVED";
    
    localStorage.setItem("portsure_users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    
    // Update local view if viewing that investor
    if (selectedInvestor && selectedInvestor.id === investorId) {
      setSelectedInvestor(updatedUsers[uIndex]);
    }
    alert("Portfolio Assets Approved!");
  };

  const getStatusClass = (status) => {
    return status === 'APPROVED' ? 'status-low' : 'status-med'; // Reuse CSS classes: low=green, med=yellow
  };

  // --- CONTENT RENDERER ---
  const renderContent = () => {
    if (activeTab === "profile") {
      return (
        <div className="profile-section-container">
          <div className="profile-header-banner">
            <div className="large-avatar">{user.name.charAt(0)}</div>
            <div>
              <h2>{user.name}</h2>
              <span className="role-tag">{user.role} ACCOUNT</span>
            </div>
          </div>
          <div className="profile-details-list">
             <div className="detail-item">
              <span className="detail-label">User ID</span>
              <span className="detail-value">{user.id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email Address</span>
              <span className="detail-value">{user.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Mobile Number</span>
              <span className="detail-value">{user.mobile}</span>
            </div>
          </div>
          <div style={{padding: "0 30px 30px 30px"}}>
             <button className="btn-secondary" onClick={() => setActiveTab('edit')}>Edit Profile Details</button>
          </div>
        </div>
      );
    }

    // 2. CREATE / EDIT PORTFOLIO TAB
    if (activeTab === "create") {
      return (
        <>
          <div className="page-header">
            <h2>{portfolio.id ? "Edit Portfolio" : "New Investment"}</h2>
            <p>{portfolio.id ? "Update assets. Changes require re-approval." : "Request asset allocation from Manager."}</p>
          </div>
          <div className="form-card" style={{maxWidth: '600px'}}>
            <div className="form-group">
              <label>Portfolio Name</label>
              <input 
                placeholder="e.g. Retirement Fund" 
                value={portfolio.name} 
                onChange={(e) => setPortfolio({ ...portfolio, name: e.target.value })} 
              />
            </div>
            
            {/* NEW: Asset Allocation Section */}
            <div style={{background:'#f8fafc', padding:'20px', borderRadius:'12px', marginBottom:'20px', border:'1px dashed #cbd5e1'}}>
              <h4 style={{margin:'0 0 15px 0', color:'#475569'}}>Asset Allocation (Total must be 100%)</h4>
              <div className="form-group">
                <label>Equities (%)</label>
                <input type="number" placeholder="0" value={portfolio.equities} onChange={(e) => setPortfolio({ ...portfolio, equities: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Bonds (%)</label>
                <input type="number" placeholder="0" value={portfolio.bonds} onChange={(e) => setPortfolio({ ...portfolio, bonds: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Derivatives (%)</label>
                <input type="number" placeholder="0" value={portfolio.derivatives} onChange={(e) => setPortfolio({ ...portfolio, derivatives: e.target.value })} />
              </div>
              <div style={{textAlign:'right', fontSize:'0.9rem', fontWeight:'bold', color: (parseInt(portfolio.equities||0)+parseInt(portfolio.bonds||0)+parseInt(portfolio.derivatives||0))===100?'#10b981':'#ef4444'}}>
                Total: {(parseInt(portfolio.equities)||0) + (parseInt(portfolio.bonds)||0) + (parseInt(portfolio.derivatives)||0)}%
              </div>
            </div>

            <button className="btn-primary" onClick={handlePortfolioSubmit}>
              {portfolio.id ? "Submit Changes for Approval" : "Request Assets"}
            </button>
            {portfolio.id && <button className="btn-secondary" style={{marginLeft:'10px'}} onClick={() => { setPortfolio({id:null, name:"", equities:"", bonds:"", derivatives:""}); setActiveTab("view"); }}>Cancel</button>}
          </div>
        </>
      );
    }

    // 3. VIEW PORTFOLIOS TAB
    if (activeTab === "view") {
      const portfolios = user.portfolios || [];
      return (
        <>
          <div className="page-header">
            <h2>My Portfolios</h2>
            <p>Track status and allocations.</p>
          </div>
          <div className="table-container">
            {portfolios.length === 0 ? (
              <div style={{padding:'50px', textAlign:'center', color:'#64748b'}}>
                <p>No portfolios found.</p>
                <button className="btn-secondary" style={{marginTop:'10px'}} onClick={() => setActiveTab('create')}>Create New</button>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Assets</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolios.map((p) => (
                    <tr key={p.portfolioId}>
                      <td>
                        <div style={{fontWeight:'700'}}>{p.name}</div>
                        <div style={{fontSize:'0.75rem', color:'#94a3b8', fontFamily:'monospace'}}>{p.portfolioId}</div>
                      </td>
                      <td>
                        {p.status === 'APPROVED' ? (
                          <div style={{fontSize:'0.85rem'}}>
                            <div>Equities: <b>{p.assets.equities}%</b></div>
                            <div>Bonds: <b>{p.assets.bonds}%</b></div>
                            <div>Deriv: <b>{p.assets.derivatives}%</b></div>
                          </div>
                        ) : (
                          <span style={{color:'#94a3b8', fontStyle:'italic'}}>Allocation Pending</span>
                        )}
                      </td>
                      <td><span className={`status-pill ${getStatusClass(p.status)}`}>{p.status}</span></td>
                      <td>
                        <button className="btn-secondary" style={{padding:'5px 10px', fontSize:'0.8rem'}} onClick={() => handleEditRequest(p)}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      );
    }

    // 4. MANAGER TAB
    if (activeTab === "investors") {
      if(selectedInvestor) {
        return (
          <>
             <button className="btn-secondary" onClick={() => setSelectedInvestor(null)} style={{marginBottom:'20px'}}>
               ← Back
             </button>
             <div className="page-header">
               <h2>{selectedInvestor.name}</h2>
               <p>Manage Approvals</p>
             </div>
             
             <div className="table-container">
               {selectedInvestor.portfolios && selectedInvestor.portfolios.length > 0 ? (
                 <table>
                   <thead>
                     <tr><th>Portfolio</th><th>Requested Allocation</th><th>Status</th><th>Action</th></tr>
                   </thead>
                   <tbody>
                     {selectedInvestor.portfolios.map((p) => (
                       <tr key={p.portfolioId}>
                         <td>
                           <b>{p.name}</b>
                           <div style={{fontSize:'0.75rem'}}>{p.date}</div>
                         </td>
                         <td>
                            <div style={{fontSize:'0.85rem'}}>E: {p.assets.equities}% | B: {p.assets.bonds}% | D: {p.assets.derivatives}%</div>
                         </td>
                         <td><span className={`status-pill ${getStatusClass(p.status)}`}>{p.status}</span></td>
                         <td>
                           {p.status === 'PENDING' && (
                             <button 
                               className="btn-primary" 
                               style={{padding:'6px 12px', fontSize:'0.75rem'}}
                               onClick={() => handleApprove(selectedInvestor.id, p.portfolioId)}
                             >
                               Approve
                             </button>
                           )}
                           {p.status === 'APPROVED' && <span style={{color:'#10b981', fontSize:'0.8rem', fontWeight:'bold'}}>✓ Active</span>}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               ) : <div style={{padding:'30px', textAlign:'center'}}>No portfolios.</div>}
             </div>
          </>
        )
      }
      return (
        <>
          <div className="page-header">
            <h2>Investor Directory</h2>
            <p>Select an investor to approve assets.</p>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Investor</th>
                  <th>Action</th>
               </tr>
              </thead>
              <tbody>
                {users.filter(u => u.role === "INVESTOR").map(inv => (
                  <tr key={inv.id}>
                    <td>
                      <div style={{fontWeight:'bold'}}>{inv.name}</div>
                      <div style={{fontSize:'0.8rem', color:'#64748b'}}>{inv.email}</div>
                    </td>
                    <td>
                      <button className="btn-secondary" style={{padding:'8px 16px', fontSize:'0.8rem'}} onClick={() => setSelectedInvestor(inv)}>
                         View Portfolios
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )
    }

    if (activeTab === "edit") {
      return (
        <>
           <div className="page-header">
            <h2>Account Details</h2>
          </div>
          <div className="form-card" style={{maxWidth:'600px'}}>
            <div className="form-group">
              <label>Full Name</label>
              <input value={editProfile.name} onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input value={editProfile.email} onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input value={editProfile.mobile} onChange={(e) => setEditProfile({ ...editProfile, mobile: e.target.value })} />
            </div>
            <button className="btn-primary" onClick={saveProfile}>Save Changes</button>
          </div>
        </>
      );
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <PortSureLogo />
          <span className="brand-text">PortSure</span>
        </div>
        <nav className="sidebar-menu">
          <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <IconProfile /> <span className="nav-label">Profile</span>
          </button>
          {user.role === "INVESTOR" && (
            <>
              <button className={`nav-item ${activeTab === 'create' ? 'active' : ''}`} onClick={() => {setPortfolio({id:null, name:"", equities:"", bonds:"", derivatives:""}); setActiveTab('create');}}>
                <IconCreate /> <span className="nav-label">Create Portfolio</span>
              </button>
              <button className={`nav-item ${activeTab === 'view' ? 'active' : ''}`} onClick={() => setActiveTab('view')}>
                <IconList /> <span className="nav-label">My Portfolios</span>
              </button>
            </>
          )}
          {(user.role === "COMPLIANCE" || user.role === "MANAGER") && (
             <button className={`nav-item ${activeTab === 'investors' ? 'active' : ''}`} onClick={() => setActiveTab('investors')}>
               <IconUsers /> <span className="nav-label">Investor Directory</span>
             </button>
          )}
          <button className={`nav-item ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => setActiveTab('edit')}>
            <IconEdit /> <span className="nav-label">Edit Profile</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="user-badge">
            <div className="avatar">{user.name.charAt(0)}</div>
            <div className="user-info">
              <h4>{user.name.split(' ')[0]}</h4>
              <span>{user.role}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>Sign Out</button>
        </div>
      </aside>
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}