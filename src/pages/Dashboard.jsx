// import { useEffect, useState } from "react";
// import "../styles/dashboard.css";

// // --- ICONS (Clean SVG) ---
// const IconProfile = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
// const IconCreate = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
// const IconList = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
// const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
// const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>;
// const IconID = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" /></svg>;
// const IconMail = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>;
// const IconPhone = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>;

// export default function Dashboard({ goToLogin }) {
//   const [user, setUser] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'create' | 'view' | 'edit' | 'investors'
  
//   // Data States
//   const [editProfile, setEditProfile] = useState({ name: "", email: "", mobile: "", proofId: "" });
//   const [portfolio, setPortfolio] = useState({ name: "", risk: "Low" });
//   const [selectedInvestor, setSelectedInvestor] = useState(null);

//   useEffect(() => {
//     const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
//     const allUsers = JSON.parse(localStorage.getItem("portsure_users")) || [];
//     setUser(loggedUser);
//     setUsers(allUsers);
    
//     if (loggedUser) {
//       setEditProfile({
//         name: loggedUser.name || "",
//         email: loggedUser.email || "",
//         mobile: loggedUser.mobile || "",
//         proofId: loggedUser.proofId || "",
//       });
//     }
//   }, []);

//   if (!user) return <div style={{padding:"50px", textAlign:'center', color:'#64748b'}}>Loading Dashboard...</div>;

//   const logout = () => {
//     localStorage.removeItem("loggedUser");
//     goToLogin();
//   };

//   // --- ACTIONS ---
//   const saveProfile = () => {
//     const updatedUsers = [...users];
//     const index = updatedUsers.findIndex((u) => u.id === user.id);
//     updatedUsers[index] = { ...updatedUsers[index], ...editProfile };
//     localStorage.setItem("portsure_users", JSON.stringify(updatedUsers));
//     localStorage.setItem("loggedUser", JSON.stringify(updatedUsers[index]));
//     setUsers(updatedUsers);
//     setUser(updatedUsers[index]);
//     alert("Profile updated successfully");
//     setActiveTab("profile");
//   };

//   const createPortfolio = () => {
//     if (!portfolio.name) return alert("Please enter portfolio name");
//     const updatedUsers = [...users];
//     const index = updatedUsers.findIndex((u) => u.id === user.id);
//     const newPortfolio = {
//       portfolioId: `PF-${Date.now()}`,
//       name: portfolio.name,
//       risk: portfolio.risk,
//     };
//     if (!updatedUsers[index].portfolios) updatedUsers[index].portfolios = [];
//     updatedUsers[index].portfolios.push(newPortfolio);
//     localStorage.setItem("portsure_users", JSON.stringify(updatedUsers));
//     localStorage.setItem("loggedUser", JSON.stringify(updatedUsers[index]));
//     setUsers(updatedUsers);
//     setUser(updatedUsers[index]);
//     setPortfolio({ name: "", risk: "Low" });
//     alert("Portfolio created successfully!");
//     setActiveTab("view");
//   };

//   const getRiskClass = (risk) => {
//     if(risk === 'High') return 'status-high';
//     if(risk === 'Medium') return 'status-med';
//     return 'status-low';
//   };

//   // --- CONTENT RENDERER ---
//   const renderContent = () => {
//     // 1. PROFILE TAB (NO BOXES)
//     if (activeTab === "profile") {
//       return (
//         <>
//           <div className="page-header">
//             <h2>My Profile</h2>
//             <p>Manage your personal information</p>
//           </div>

//           <div className="profile-section-container">
//             {/* Header Banner */}
//             <div className="profile-header-banner">
//               <div className="large-avatar">{user.name.charAt(0)}</div>
//               <div>
//                 <h2>{user.name}</h2>
//                 <span className="role-tag">{user.role} ACCOUNT</span>
//               </div>
//             </div>

//             {/* Clean Data List */}
//             <div className="profile-details-list">
//               <div className="detail-item">
//                 <span className="detail-label"><IconID /> User ID</span>
//                 <span className="detail-value">{user.id}</span>
//               </div>

//               <div className="detail-item">
//                 <span className="detail-label"><IconMail /> Email Address</span>
//                 <span className="detail-value">{user.email}</span>
//               </div>

//               <div className="detail-item">
//                 <span className="detail-label"><IconPhone /> Mobile Number</span>
//                 <span className="detail-value">{user.mobile}</span>
//               </div>

//               <div className="detail-item">
//                 <span className="detail-label"><IconProfile /> Proof ID</span>
//                 <span className="detail-value">{user.proofId}</span>
//               </div>
//             </div>

//             {/* Edit Button */}
//             <div style={{padding: "0 40px 40px 40px"}}>
//                <button className="btn-secondary" onClick={() => setActiveTab('edit')}>
//                  Edit Profile Details
//                </button>
//             </div>
//           </div>
//         </>
//       );
//     }

//     // 2. CREATE TAB
//     if (activeTab === "create") {
//       return (
//         <>
//           <div className="page-header">
//             <h2>New Investment</h2>
//             <p>Create a new portfolio to track your assets.</p>
//           </div>
//           <div className="form-card">
//             <div className="form-group">
//               <label>Portfolio Name</label>
//               <input 
//                 placeholder="e.g. Technology Growth Fund" 
//                 value={portfolio.name} 
//                 onChange={(e) => setPortfolio({ ...portfolio, name: e.target.value })} 
//               />
//             </div>
//             <div className="form-group">
//               <label>Risk Tolerance</label>
//               <select value={portfolio.risk} onChange={(e) => setPortfolio({ ...portfolio, risk: e.target.value })}>
//                 <option>Low</option>
//                 <option>Medium</option>
//                 <option>High</option>
//               </select>
//             </div>
//             <button className="btn-primary" onClick={createPortfolio}>Create Portfolio</button>
//           </div>
//         </>
//       );
//     }

//     // 3. VIEW PORTFOLIOS TAB
//     if (activeTab === "view") {
//       const portfolios = user.portfolios || [];
//       return (
//         <>
//           <div className="page-header">
//             <h2>My Portfolios</h2>
//             <p>Manage and track your active investments.</p>
//           </div>
//           <div className="table-container">
//             {portfolios.length === 0 ? (
//               <div style={{padding:'40px', textAlign:'center', color:'#64748b'}}>
//                 <p>No portfolios found.</p>
//                 <button className="btn-secondary" onClick={() => setActiveTab('create')}>Create New</button>
//               </div>
//             ) : (
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Portfolio ID</th>
//                     <th>Name</th>
//                     <th>Risk Category</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {portfolios.map((p) => (
//                     <tr key={p.portfolioId}>
//                       <td style={{fontFamily:'monospace', color:'var(--primary)'}}>{p.portfolioId}</td>
//                       <td style={{fontWeight:'600'}}>{p.name}</td>
//                       <td><span className={`status-pill ${getRiskClass(p.risk)}`}>{p.risk}</span></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </>
//       );
//     }

//     // 4. ADMIN TAB
//     if (activeTab === "investors") {
//       if(selectedInvestor) {
//         return (
//           <>
//              <button className="btn-secondary" onClick={() => setSelectedInvestor(null)} style={{marginBottom:'20px'}}>
//                ← Back to List
//              </button>
//              <div className="page-header">
//                <h2>{selectedInvestor.name}</h2>
//                <p>{selectedInvestor.email}</p>
//              </div>
             
//              <h3 style={{marginBottom:'15px'}}>User Portfolios</h3>
//              <div className="table-container">
//                {selectedInvestor.portfolios && selectedInvestor.portfolios.length > 0 ? (
//                  <table>
//                    <thead>
//                      <tr><th>ID</th><th>Name</th><th>Risk</th></tr>
//                    </thead>
//                    <tbody>
//                      {selectedInvestor.portfolios.map((p) => (
//                        <tr key={p.portfolioId}>
//                          <td style={{fontFamily:'monospace', color:'var(--primary)'}}>{p.portfolioId}</td>
//                          <td>{p.name}</td>
//                          <td><span className={`status-pill ${getRiskClass(p.risk)}`}>{p.risk}</span></td>
//                        </tr>
//                      ))}
//                    </tbody>
//                  </table>
//                ) : <div style={{padding:'20px'}}>No portfolios created.</div>}
//              </div>
//           </>
//         )
//       }
//       return (
//         <>
//           <div className="page-header">
//             <h2>Investor Directory</h2>
//             <p>Manage registered investors and their portfolios.</p>
//           </div>
//           <div className="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Investor ID</th>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.filter(u => u.role === "INVESTOR").map(inv => (
//                   <tr key={inv.id}>
//                     <td style={{fontFamily:'monospace', fontWeight:'600'}}>{inv.id}</td>
//                     <td>{inv.name}</td>
//                     <td>{inv.email}</td>
//                     <td>
//                       <button className="btn-secondary" style={{padding:'6px 12px', fontSize:'0.8rem'}} onClick={() => setSelectedInvestor(inv)}>
//                         View Details
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )
//     }

//     // 5. EDIT TAB
//     if (activeTab === "edit") {
//       return (
//         <>
//            <div className="page-header">
//             <h2>Account Settings</h2>
//             <p>Update your personal profile information.</p>
//           </div>
//           <div className="form-card">
//             <div className="form-group">
//               <label>Full Name</label>
//               <input value={editProfile.name} onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })} />
//             </div>
//             <div className="form-group">
//               <label>Email Address</label>
//               <input value={editProfile.email} onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })} />
//             </div>
//             <div className="form-group">
//               <label>Mobile Number</label>
//               <input value={editProfile.mobile} onChange={(e) => setEditProfile({ ...editProfile, mobile: e.target.value })} />
//             </div>
//             <div className="form-group">
//               <label>Proof ID</label>
//               <input value={editProfile.proofId} onChange={(e) => setEditProfile({ ...editProfile, proofId: e.target.value })} />
//             </div>
//             <button className="btn-primary" onClick={saveProfile}>Save Changes</button>
//           </div>
//         </>
//       );
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       {/* SIDEBAR */}
//       <aside className="sidebar">
//         <div className="sidebar-header">
//           <span className="brand-text">PortSure.</span>
//         </div>

//         <nav className="sidebar-menu">
//           <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
//             <IconProfile /> Profile
//           </button>

//           {/* INVESTOR MENU */}
//           {user.role === "INVESTOR" && (
//             <>
//               <button className={`nav-item ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>
//                 <IconCreate /> Create Portfolio
//               </button>
//               <button className={`nav-item ${activeTab === 'view' ? 'active' : ''}`} onClick={() => setActiveTab('view')}>
//                 <IconList /> My Portfolios
//               </button>
//             </>
//           )}

//           {/* ADMIN MENU */}
//           {user.role === "ADMIN" && (
//              <button className={`nav-item ${activeTab === 'investors' ? 'active' : ''}`} onClick={() => setActiveTab('investors')}>
//                <IconUsers /> Investor List
//              </button>
//           )}

//           <button className={`nav-item ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => setActiveTab('edit')}>
//             <IconEdit /> Settings
//           </button>
//         </nav>

//         <div className="sidebar-footer">
//           <div className="user-badge">
//             <div className="avatar">{user.name.charAt(0)}</div>
//             <div className="user-info">
//               <h4>{user.name.split(' ')[0]}</h4>
//               <span>{user.role}</span>
//             </div>
//           </div>
//           <button className="logout-btn" onClick={logout}>Sign Out</button>
//         </div>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="main-content">
//         {renderContent()}
//       </main>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import "../styles/dashboard.css";

// // --- ICONS ---
// const IconProfile = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
// const IconCreate = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
// const IconList = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
// const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
// const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>;
// const IconID = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" /></svg>;
// const IconMail = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>;
// const IconPhone = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>;

// export default function Dashboard({ goToLogin }) {
//   const [user, setUser] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'create' | 'view' | 'edit' | 'investors'
  
//   // Data States (Proof ID removed)
//   const [editProfile, setEditProfile] = useState({ name: "", email: "", mobile: "" });
//   const [portfolio, setPortfolio] = useState({ name: "", risk: "Low" });
//   const [selectedInvestor, setSelectedInvestor] = useState(null);

//   useEffect(() => {
//     const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
//     const allUsers = JSON.parse(localStorage.getItem("portsure_users")) || [];
//     setUser(loggedUser);
//     setUsers(allUsers);
    
//     if (loggedUser) {
//       setEditProfile({
//         name: loggedUser.name || "",
//         email: loggedUser.email || "",
//         mobile: loggedUser.mobile || "",
//         // Proof ID removed
//       });
//     }
//   }, []);

//   if (!user) return <div style={{padding:"50px", textAlign:'center', color:'#64748b'}}>Loading Dashboard...</div>;

//   const logout = () => {
//     localStorage.removeItem("loggedUser");
//     goToLogin();
//   };

//   // --- ACTIONS ---
//   const saveProfile = () => {
//     const updatedUsers = [...users];
//     const index = updatedUsers.findIndex((u) => u.id === user.id);
//     updatedUsers[index] = { ...updatedUsers[index], ...editProfile };
//     localStorage.setItem("portsure_users", JSON.stringify(updatedUsers));
//     localStorage.setItem("loggedUser", JSON.stringify(updatedUsers[index]));
//     setUsers(updatedUsers);
//     setUser(updatedUsers[index]);
//     alert("Profile updated successfully");
//     setActiveTab("profile");
//   };

//   const createPortfolio = () => {
//     if (!portfolio.name) return alert("Please enter portfolio name");
//     const updatedUsers = [...users];
//     const index = updatedUsers.findIndex((u) => u.id === user.id);
//     const newPortfolio = {
//       portfolioId: `PF-${Date.now()}`,
//       name: portfolio.name,
//       risk: portfolio.risk,
//     };
//     if (!updatedUsers[index].portfolios) updatedUsers[index].portfolios = [];
//     updatedUsers[index].portfolios.push(newPortfolio);
//     localStorage.setItem("portsure_users", JSON.stringify(updatedUsers));
//     localStorage.setItem("loggedUser", JSON.stringify(updatedUsers[index]));
//     setUsers(updatedUsers);
//     setUser(updatedUsers[index]);
//     setPortfolio({ name: "", risk: "Low" });
//     alert("Portfolio created successfully!");
//     setActiveTab("view");
//   };

//   const getRiskClass = (risk) => {
//     if(risk === 'High') return 'status-high';
//     if(risk === 'Medium') return 'status-med';
//     return 'status-low';
//   };

//   // --- CONTENT RENDERER ---
//   const renderContent = () => {
//     // 1. PROFILE TAB
//     if (activeTab === "profile") {
//       return (
//         <>
//           <div className="page-header">
//             <h2>My Profile</h2>
//             <p>Manage your personal information</p>
//           </div>

//           <div className="profile-section-container">
//             {/* Header Banner */}
//             <div className="profile-header-banner">
//               <div className="large-avatar">{user.name.charAt(0)}</div>
//               <div>
//                 <h2>{user.name}</h2>
//                 <span className="role-tag">{user.role} ACCOUNT</span>
//               </div>
//             </div>

//             {/* Clean Data List - Proof ID Removed */}
//             <div className="profile-details-list">
//               <div className="detail-item">
//                 <span className="detail-label"><IconID /> User ID</span>
//                 <span className="detail-value">{user.id}</span>
//               </div>

//               <div className="detail-item">
//                 <span className="detail-label"><IconMail /> Email Address</span>
//                 <span className="detail-value">{user.email}</span>
//               </div>

//               <div className="detail-item">
//                 <span className="detail-label"><IconPhone /> Mobile Number</span>
//                 <span className="detail-value">{user.mobile}</span>
//               </div>
//             </div>

//             {/* Edit Button */}
//             <div style={{padding: "0 40px 40px 40px"}}>
//                <button className="btn-secondary" onClick={() => setActiveTab('edit')}>
//                  Edit Profile Details
//                </button>
//             </div>
//           </div>
//         </>
//       );
//     }

//     // 2. CREATE TAB
//     if (activeTab === "create") {
//       return (
//         <>
//           <div className="page-header">
//             <h2>New Investment</h2>
//             <p>Create a new portfolio to track your assets.</p>
//           </div>
//           <div className="form-card">
//             <div className="form-group">
//               <label>Portfolio Name</label>
//               <input 
//                 placeholder="e.g. Technology Growth Fund" 
//                 value={portfolio.name} 
//                 onChange={(e) => setPortfolio({ ...portfolio, name: e.target.value })} 
//               />
//             </div>
//             <div className="form-group">
//               <label>Risk Tolerance</label>
//               <select value={portfolio.risk} onChange={(e) => setPortfolio({ ...portfolio, risk: e.target.value })}>
//                 <option>Low</option>
//                 <option>Medium</option>
//                 <option>High</option>
//               </select>
//             </div>
//             <button className="btn-primary" onClick={createPortfolio}>Create Portfolio</button>
//           </div>
//         </>
//       );
//     }

//     // 3. VIEW PORTFOLIOS TAB
//     if (activeTab === "view") {
//       const portfolios = user.portfolios || [];
//       return (
//         <>
//           <div className="page-header">
//             <h2>My Portfolios</h2>
//             <p>Manage and track your active investments.</p>
//           </div>
//           <div className="table-container">
//             {portfolios.length === 0 ? (
//               <div style={{padding:'40px', textAlign:'center', color:'#64748b'}}>
//                 <p>No portfolios found.</p>
//                 <button className="btn-secondary" onClick={() => setActiveTab('create')}>Create New</button>
//               </div>
//             ) : (
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Portfolio ID</th>
//                     <th>Name</th>
//                     <th>Risk Category</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {portfolios.map((p) => (
//                     <tr key={p.portfolioId}>
//                       <td style={{fontFamily:'monospace', color:'var(--primary)'}}>{p.portfolioId}</td>
//                       <td style={{fontWeight:'600'}}>{p.name}</td>
//                       <td><span className={`status-pill ${getRiskClass(p.risk)}`}>{p.risk}</span></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </>
//       );
//     }

//     // 4. ADMIN TAB
//     if (activeTab === "investors") {
//       if(selectedInvestor) {
//         return (
//           <>
//              <button className="btn-secondary" onClick={() => setSelectedInvestor(null)} style={{marginBottom:'20px'}}>
//                ← Back to List
//              </button>
//              <div className="page-header">
//                <h2>{selectedInvestor.name}</h2>
//                <p>{selectedInvestor.email}</p>
//              </div>
             
//              <h3 style={{marginBottom:'15px'}}>User Portfolios</h3>
//              <div className="table-container">
//                {selectedInvestor.portfolios && selectedInvestor.portfolios.length > 0 ? (
//                  <table>
//                    <thead>
//                      <tr><th>ID</th><th>Name</th><th>Risk</th></tr>
//                    </thead>
//                    <tbody>
//                      {selectedInvestor.portfolios.map((p) => (
//                        <tr key={p.portfolioId}>
//                          <td style={{fontFamily:'monospace', color:'var(--primary)'}}>{p.portfolioId}</td>
//                          <td>{p.name}</td>
//                          <td><span className={`status-pill ${getRiskClass(p.risk)}`}>{p.risk}</span></td>
//                        </tr>
//                      ))}
//                    </tbody>
//                  </table>
//                ) : <div style={{padding:'20px'}}>No portfolios created.</div>}
//              </div>
//           </>
//         )
//       }
//       return (
//         <>
//           <div className="page-header">
//             <h2>Investor Directory</h2>
//             <p>Manage registered investors and their portfolios.</p>
//           </div>
//           <div className="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Investor ID</th>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.filter(u => u.role === "INVESTOR").map(inv => (
//                   <tr key={inv.id}>
//                     <td style={{fontFamily:'monospace', fontWeight:'600'}}>{inv.id}</td>
//                     <td>{inv.name}</td>
//                     <td>{inv.email}</td>
//                     <td>
//                       <button className="btn-secondary" style={{padding:'6px 12px', fontSize:'0.8rem'}} onClick={() => setSelectedInvestor(inv)}>
//                         View Details
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )
//     }

//     // 5. EDIT TAB
//     if (activeTab === "edit") {
//       return (
//         <>
//            <div className="page-header">
//             <h2>Account Settings</h2>
//             <p>Update your personal profile information.</p>
//           </div>
//           <div className="form-card">
//             <div className="form-group">
//               <label>Full Name</label>
//               <input value={editProfile.name} onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })} />
//             </div>
//             <div className="form-group">
//               <label>Email Address</label>
//               <input value={editProfile.email} onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })} />
//             </div>
//             <div className="form-group">
//               <label>Mobile Number</label>
//               <input value={editProfile.mobile} onChange={(e) => setEditProfile({ ...editProfile, mobile: e.target.value })} />
//             </div>
//             {/* Proof ID input removed */}
//             <button className="btn-primary" onClick={saveProfile}>Save Changes</button>
//           </div>
//         </>
//       );
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       {/* SIDEBAR */}
//       <aside className="sidebar">
//         <div className="sidebar-header">
//           <span className="brand-text">PortSure.</span>
//         </div>

//         <nav className="sidebar-menu">
//           <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
//             <IconProfile /> Profile
//           </button>

//           {/* INVESTOR MENU */}
//           {user.role === "INVESTOR" && (
//             <>
//               <button className={`nav-item ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>
//                 <IconCreate /> Create Portfolio
//               </button>
//               <button className={`nav-item ${activeTab === 'view' ? 'active' : ''}`} onClick={() => setActiveTab('view')}>
//                 <IconList /> My Portfolios
//               </button>
//             </>
//           )}

//           {/* ADMIN MENU */}
//           {user.role === "ADMIN" && (
//              <button className={`nav-item ${activeTab === 'investors' ? 'active' : ''}`} onClick={() => setActiveTab('investors')}>
//                <IconUsers /> Investor List
//              </button>
//           )}

//           <button className={`nav-item ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => setActiveTab('edit')}>
//             <IconEdit /> Settings
//           </button>
//         </nav>

//         <div className="sidebar-footer">
//           <div className="user-badge">
//             <div className="avatar">{user.name.charAt(0)}</div>
//             <div className="user-info">
//               <h4>{user.name.split(' ')[0]}</h4>
//               <span>{user.role}</span>
//             </div>
//           </div>
//           <button className="logout-btn" onClick={logout}>Sign Out</button>
//         </div>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="main-content">
//         {renderContent()}
//       </main>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import "../styles/dashboard.css";

// --- SVG ICONS (SAME AS BEFORE) ---
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
  const [portfolio, setPortfolio] = useState({ name: "", risk: "Low" });
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

  // --- ACTIONS (SAME AS BEFORE) ---
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

  const createPortfolio = () => {
    if (!portfolio.name) return alert("Please enter portfolio name");
    const updatedUsers = [...users];
    const index = updatedUsers.findIndex((u) => u.id === user.id);
    const newPortfolio = {
      portfolioId: `PF-${Date.now()}`,
      name: portfolio.name,
      risk: portfolio.risk,
      date: new Date().toLocaleDateString()
    };
    if (!updatedUsers[index].portfolios) updatedUsers[index].portfolios = [];
    updatedUsers[index].portfolios.push(newPortfolio);
    localStorage.setItem("portsure_users", JSON.stringify(updatedUsers));
    localStorage.setItem("loggedUser", JSON.stringify(updatedUsers[index]));
    setUsers(updatedUsers);
    setUser(updatedUsers[index]);
    setPortfolio({ name: "", risk: "Low" });
    alert("Portfolio created successfully!");
    setActiveTab("view");
  };

  const getRiskClass = (risk) => {
    if(risk === 'High') return 'status-high';
    if(risk === 'Medium') return 'status-med';
    return 'status-low';
  };

  // --- CONTENT RENDERER ---
  const renderContent = () => {
    // 1. PROFILE TAB - UPDATED (Removed Page Header)
    if (activeTab === "profile") {
      return (
        <>
          {/* HEADER REMOVED HERE */}
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
            {/* Adjusted padding to match new tighter CSS */}
            <div style={{padding: "0 30px 30px 30px"}}>
               <button className="btn-secondary" onClick={() => setActiveTab('edit')}>Edit Profile Details</button>
            </div>
          </div>
        </>
      );
    }

    // 2. CREATE TAB (Investors Only)
    if (activeTab === "create") {
      return (
        <>
          <div className="page-header">
            <h2>New Investment</h2>
            <p>Create a new portfolio to track your assets.</p>
          </div>
          <div className="form-card" style={{maxWidth: '600px'}}>
            <div className="form-group">
              <label>Portfolio Name</label>
              <input 
                placeholder="e.g. Technology Growth Fund" 
                value={portfolio.name} 
                onChange={(e) => setPortfolio({ ...portfolio, name: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Risk Tolerance</label>
              <select value={portfolio.risk} onChange={(e) => setPortfolio({ ...portfolio, risk: e.target.value })}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <button className="btn-primary" onClick={createPortfolio}>Create Portfolio</button>
          </div>
        </>
      );
    }

    // 3. VIEW PORTFOLIOS TAB (Investors Only)
    if (activeTab === "view") {
      const portfolios = user.portfolios || [];
      return (
        <>
          <div className="page-header">
            <h2>My Portfolios</h2>
            <p>Manage and track your active investments.</p>
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
                    <th>Portfolio ID</th>
                    <th>Name</th>
                    <th>Date Created</th>
                    <th>Risk Category</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolios.map((p) => (
                    <tr key={p.portfolioId}>
                      <td style={{fontFamily:'monospace', color:'var(--primary)'}}>{p.portfolioId}</td>
                      <td style={{fontWeight:'600'}}>{p.name}</td>
                      <td>{p.date}</td>
                      <td><span className={`status-pill ${getRiskClass(p.risk)}`}>{p.risk}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      );
    }

    // 4. COMPLIANCE / MANAGER TAB (View Investors)
    if (activeTab === "investors") {
      if(selectedInvestor) {
        return (
          <>
             <button className="btn-secondary" onClick={() => setSelectedInvestor(null)} style={{marginBottom:'20px'}}>
               ← Back to List
             </button>
             <div className="page-header">
               <h2>{selectedInvestor.name}</h2>
               <p>{selectedInvestor.email} | {selectedInvestor.id}</p>
             </div>
             
             <h3 style={{marginBottom:'15px', color:'var(--text-main)'}}>User Portfolios</h3>
             <div className="table-container">
               {selectedInvestor.portfolios && selectedInvestor.portfolios.length > 0 ? (
                 <table>
                   <thead>
                     <tr><th>ID</th><th>Name</th><th>Date</th><th>Risk</th></tr>
                   </thead>
                   <tbody>
                     {selectedInvestor.portfolios.map((p) => (
                       <tr key={p.portfolioId}>
                         <td style={{fontFamily:'monospace', color:'var(--primary)'}}>{p.portfolioId}</td>
                         <td style={{fontWeight:'600'}}>{p.name}</td>
                         <td>{p.date}</td>
                         <td><span className={`status-pill ${getRiskClass(p.risk)}`}>{p.risk}</span></td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               ) : <div style={{padding:'30px', textAlign:'center', color:'#94a3b8'}}>No portfolios created by this user.</div>}
             </div>
          </>
        )
      }
      return (
        <>
          <div className="page-header">
            <h2>Investor Directory</h2>
            <p>Manage registered investors and compliance.</p>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Investor ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.role === "INVESTOR").map(inv => (
                  <tr key={inv.id}>
                    <td style={{fontFamily:'monospace', fontWeight:'600'}}>{inv.id}</td>
                    <td>{inv.name}</td>
                    <td>{inv.email}</td>
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

    // 5. EDIT TAB
    if (activeTab === "edit") {
      return (
        <>
           <div className="page-header">
            <h2>Account Settings</h2>
            <p>Update your personal profile information.</p>
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
      {/* SIDEBAR (SAME AS BEFORE) */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <PortSureLogo />
          <span className="brand-text">PortSure</span>
        </div>

        <nav className="sidebar-menu">
          <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <IconProfile /> Profile
          </button>

          {user.role === "INVESTOR" && (
            <>
              <button className={`nav-item ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>
                <IconCreate /> Create Portfolio
              </button>
              <button className={`nav-item ${activeTab === 'view' ? 'active' : ''}`} onClick={() => setActiveTab('view')}>
                <IconList /> My Portfolios
              </button>
            </>
          )}

          {(user.role === "COMPLIANCE" || user.role === "MANAGER") && (
             <button className={`nav-item ${activeTab === 'investors' ? 'active' : ''}`} onClick={() => setActiveTab('investors')}>
               <IconUsers /> Investor Directory
             </button>
          )}

          <button className={`nav-item ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => setActiveTab('edit')}>
            <IconEdit /> Settings
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