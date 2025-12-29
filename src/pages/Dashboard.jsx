
import { useEffect, useState } from "react";
import "../styles/dashboard.css";

export default function Dashboard({ goToLogin }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [showInvestors, setShowInvestors] = useState(false);

  // ===== Edit Profile =====
  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    proofId: "",
  });

  // ===== Portfolio =====
  const [portfolio, setPortfolio] = useState({
    name: "",
    risk: "Low",
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    const allUsers =
      JSON.parse(localStorage.getItem("portsure_users")) || [];

    setUser(loggedUser);
    setUsers(allUsers);

    if (loggedUser) {
      setEditProfile({
        name: loggedUser.name || "",
        email: loggedUser.email || "",
        mobile: loggedUser.mobile || "",
        proofId: loggedUser.proofId || "",
      });
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("loggedUser");
    goToLogin();
  };

  /* ================= SAVE PROFILE ================= */
  const saveProfile = () => {
    const updatedUsers = [...users];
    const index = updatedUsers.findIndex((u) => u.id === user.id);

    updatedUsers[index] = {
      ...updatedUsers[index],
      ...editProfile,
    };

    localStorage.setItem("portsure_users", JSON.stringify(updatedUsers));
    localStorage.setItem(
      "loggedUser",
      JSON.stringify(updatedUsers[index])
    );

    setUsers(updatedUsers);
    setUser(updatedUsers[index]);
    setEditMode(false);

    alert("Profile updated successfully");
  };

  /* ================= INVESTOR: CREATE PORTFOLIO ================= */
  const createPortfolio = () => {
    if (!portfolio.name)
      return alert("Please enter portfolio name");

    const updatedUsers = [...users];
    const index = updatedUsers.findIndex(
      (u) => u.id === user.id
    );

    const newPortfolio = {
      portfolioId: `PF-${Date.now()}`,
      name: portfolio.name,
      risk: portfolio.risk,
    };

    if (!updatedUsers[index].portfolios) {
      updatedUsers[index].portfolios = [];
    }

    updatedUsers[index].portfolios.push(newPortfolio);

    localStorage.setItem(
      "portsure_users",
      JSON.stringify(updatedUsers)
    );
    localStorage.setItem(
      "loggedUser",
      JSON.stringify(updatedUsers[index])
    );

    setUsers(updatedUsers);
    setUser(updatedUsers[index]);
    setPortfolio({ name: "", risk: "Low" });

    alert("Portfolio created successfully");
  };

  return (
    <div className="dashboard">
      {/* ================= HEADER ================= */}
      <header className="dashboard-header">
        <h2>PortSure Dashboard</h2>
        <div>
          <span>{user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* ================= PROFILE (ADMIN & INVESTOR) ================= */}
        <h3>{user.role} Profile</h3>

        {!editMode ? (
          <>
            <p><b>ID:</b> {user.id}</p>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Mobile:</b> {user.mobile}</p>
            <p><b>Proof ID:</b> {user.proofId}</p>

            <button onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <div className="edit-profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={editProfile.name}
                onChange={(e) =>
                  setEditProfile({
                    ...editProfile,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={editProfile.email}
                onChange={(e) =>
                  setEditProfile({
                    ...editProfile,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="text"
                value={editProfile.mobile}
                onChange={(e) =>
                  setEditProfile({
                    ...editProfile,
                    mobile: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Proof ID</label>
              <input
                type="text"
                value={editProfile.proofId}
                onChange={(e) =>
                  setEditProfile({
                    ...editProfile,
                    proofId: e.target.value,
                  })
                }
              />
            </div>

            <div className="profile-actions">
              <button onClick={saveProfile}>Save</button>
              <button onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <br/>
        <br/>
        <hr />
        <br/>
        {/* ================= INVESTOR VIEW ================= */}
        {user.role === "INVESTOR" && (
          <>
            <h3>Create Portfolio</h3>
            <input
              placeholder="Portfolio Name"
              value={portfolio.name}
              onChange={(e) =>
                setPortfolio({
                  ...portfolio,
                  name: e.target.value,
                })
              }
            />

            <select
              value={portfolio.risk}
              onChange={(e) =>
                setPortfolio({
                  ...portfolio,
                  risk: e.target.value,
                })
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <button onClick={createPortfolio}>
              Create Portfolio
            </button>
            <br/>
            <br/>
            <h3>My Portfolios</h3>
            <table>
              <thead>
                <tr>
                  <th>Portfolio ID</th>
                  <th>Name</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {(user.portfolios || []).map((p) => (
                  <tr key={p.portfolioId}>
                    <td>{p.portfolioId}</td>
                    <td>{p.name}</td>
                    <td>{p.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ================= ADMIN VIEW ================= */}
        {user.role === "ADMIN" && !selectedInvestor && (
          <>
            <button
              onClick={() => setShowInvestors(!showInvestors)}
            >
              {showInvestors
                ? "Hide Investor List"
                : "View Investor List"}
            </button>

            {showInvestors && (
              <>
                <h3>Investor List</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Investor ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>No. of Portfolios</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter((u) => u.role === "INVESTOR")
                      .map((inv) => (
                        <tr key={inv.id}>
                          <td
                            style={{
                              color: "#1f8a5b",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                            onClick={() =>
                              setSelectedInvestor(inv)
                            }
                          >
                            {inv.id}
                          </td>
                          <td>{inv.name}</td>
                          <td>{inv.email}</td>
                          <td>
                            {inv.portfolios
                              ? inv.portfolios.length
                              : 0}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}

        {/* ================= ADMIN → READ-ONLY INVESTOR VIEW ================= */}
        {user.role === "ADMIN" && selectedInvestor && (
          <>
            <button
              onClick={() => setSelectedInvestor(null)}
              style={{ marginBottom: "15px" }}
            >
              ← Back to Investor List
            </button>

            <h3>Investor Details</h3>
            <p><b>ID:</b> {selectedInvestor.id}</p>
            <p><b>Name:</b> {selectedInvestor.name}</p>
            <p><b>Email:</b> {selectedInvestor.email}</p>

            <h3>Investor Portfolios (Read-Only)</h3>

            {selectedInvestor.portfolios &&
            selectedInvestor.portfolios.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Portfolio ID</th>
                    <th>Portfolio Name</th>
                    <th>Risk Category</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvestor.portfolios.map((p) => (
                    <tr key={p.portfolioId}>
                      <td>{p.portfolioId}</td>
                      <td>{p.name}</td>
                      <td>{p.risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>This investor has no portfolios.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
