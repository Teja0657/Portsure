import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";
import logo from "../../logo/logo.png";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import "../../CSSDesgin5/PerformanceDashboard.css";

const marketPrices = [
  { month: "Jan", price: 10 },
  { month: "Feb", price: 11.5 },
  { month: "Mar", price: 12.6 },
  { month: "Apr", price: 12.0 },
  { month: "May", price: 12.2 },
  { month: "Jun", price: 11.8 },
  { month: "Jul", price: 11.0 },
  { month: "Aug", price: 11.6 },
  { month: "Sep", price: 12.1 },
  { month: "Oct", price: 12.8 },
  { month: "Nov", price: 13.5 },
  { month: "Dec", price: 14.0 }
];

function PerformanceDashboard() {
  const navigate = useNavigate();

  // Session Isolation: Investor context
  const loggedInUser = JSON.parse(localStorage.getItem("investor_user") || "{}");
  // Handle nested user object if present
  const userData = loggedInUser.user || loggedInUser;
  const investorId = userData.investorId || userData.id;
  const token = loggedInUser.token;

  const [portfolios, setPortfolios] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!investorId || !token) {
      console.warn("No valid session found (Performance), redirecting.");
      navigate("/");
    }
  }, [investorId, token, navigate]);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  useEffect(() => {
    if (!token || !investorId) return;

    fetch(`http://localhost:8081/api/portfolios/investor/${investorId}`, {
      headers: getAuthHeaders()
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            navigate("/");
          }
          throw new Error("Failed to fetch");
        }
        return res.json();
      })
      .then(data => {
        setPortfolios(data || []);
        setSelectedId(data?.[0]?.portfolioId || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [investorId, token, navigate]);

  const activeData = useMemo(() => {
    return portfolios.find(
      p => String(p.portfolioId) === String(selectedId)
    );
  }, [selectedId, portfolios]);

  const allowedStatuses = ["APPROVED", "EXECUTED", "COMPLETED"];

  const {
    monthlyData,
    totalReturn,
    volatility,
    riskAdjusted,
    efficiencyScore,
    finalValue,
    baseGrowth,
    invested
  } = useMemo(() => {
    if (
      !activeData ||
      !allowedStatuses.includes(
        String(activeData.status || "").toUpperCase()
      )
    ) {
      return {
        monthlyData: marketPrices.map(p => ({ name: p.month, value: 0 })),
        totalReturn: "0.00",
        volatility: "0.00",
        riskAdjusted: "0.00",
        efficiencyScore: "0.0",
        finalValue: 0,
        baseGrowth: 0,
        invested: 0
      };
    }

    const invested = Number(activeData.investedAmount || 0);

    const sorted = [...portfolios].sort(
      (a, b) => a.portfolioId - b.portfolioId
    );

    const index = sorted.findIndex(
      p => p.portfolioId === activeData.portfolioId
    );

    // Use portfolioId as seed for consistent random-like behavior
    const seed = activeData.portfolioId || index;

    // True random distribution: 60% profit, 40% loss (not sequential)
    // Use a hash-like function for better randomization
    const hash = (seed * 2654435761) % 100; // Large prime for distribution
    const isProfit = hash < 60; // 60% chance of profit

    // Generate unique decimal return percentage for EACH portfolio
    let baseGrowth;
    if (isProfit) {
      // Profit: 2.0% to 15.9% with decimals
      const variation = ((seed * 17 + seed * seed * 13) % 1400) / 100;
      baseGrowth = 0.02 + variation / 100;
    } else {
      // Loss: -2.0% to -12.9% with decimals
      const variation = ((seed * 23 + seed * seed * 19) % 1100) / 100;
      baseGrowth = -0.02 - variation / 100;
    }

    // Use simple final value calculation for consistency
    const finalVal = invested * (1 + baseGrowth);

    // Create monthly data with realistic trading volatility
    const mData = marketPrices.map((p, i) => {
      const progress = (i + 1) / marketPrices.length;

      // For last month, use exact final value for consistency
      if (i === marketPrices.length - 1) {
        return {
          name: p.month,
          value: Number(finalVal.toFixed(2))
        };
      }

      // Create realistic trading fluctuations with multiple sine waves
      const volatilityFactor = 0.08; // 8% volatility range
      const wave1 = Math.sin((i + 1) * 0.5 + seed) * volatilityFactor * 0.5;
      const wave2 = Math.sin((i + 1) * 1.2 + seed * 2) * volatilityFactor * 0.3;
      const wave3 = Math.sin((i + 1) * 2.5 + seed * 3) * volatilityFactor * 0.2;
      const combinedNoise = wave1 + wave2 + wave3;

      // Add progressive growth with realistic fluctuations
      const progressiveValue = invested * (1 + (baseGrowth * progress));
      const fluctuation = progressiveValue * combinedNoise;

      return {
        name: p.month,
        value: Number((progressiveValue + fluctuation).toFixed(2))
      };
    });

    const ret = invested
      ? (((finalVal - invested) / invested) * 100).toFixed(2)
      : "0.00";

    const returns = mData.slice(1).map((v, i) =>
      ((v.value - mData[i].value) / mData[i].value) * 100
    );

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;

    const vol = Math.sqrt(
      returns.reduce((s, r) => s + Math.pow(r - mean, 2), 0) /
      returns.length
    ).toFixed(2);

    // Calculate unique efficiency score with decimals: 60.0 to 90.9
    const effScoreRaw = 60 + ((seed * 37 + seed * seed * 11) % 310) / 10;
    const efficiencyScore = effScoreRaw.toFixed(1);

    const riskAdj = vol > 0 ? (ret / vol).toFixed(2) : "0.00";

    return {
      monthlyData: mData,
      totalReturn: ret,
      volatility: vol,
      riskAdjusted: riskAdj,
      efficiencyScore: efficiencyScore,
      finalValue: finalVal,
      baseGrowth: baseGrowth,
      invested: invested
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeData, portfolios]);

  // Compute Y-axis domain with padding so chart auto-scales around data
  const { yMin, yMax } = useMemo(() => {
    const vals = (monthlyData || []).map(d => Number(d.value || 0));
    if (!vals.length) return { yMin: 0, yMax: 1 };
    const dataMin = Math.min(...vals);
    const dataMax = Math.max(...vals);
    const range = dataMax - dataMin;
    const pad = range > 0 ? range * 0.05 : dataMax * 0.05 || 1;
    // avoid negative lower bound for monetary values
    const min = Math.max(0, dataMin - pad);
    const max = dataMax + pad;
    return { yMin: min, yMax: max };
  }, [monthlyData]);

  // Define navigation options early (before any returns)
  const myLoginOptions = (
    <div className="home-links">
      <Link to="/investor" className="ad">Home</Link>
      <Link to="/portfolio-performances" className="ad active">Performance Dashboard</Link>
      <Link to="/export-reports" className="ad">Export Report</Link>
    </div>
  );

  if (loading) {
    return <div className="light-loader">Analyzing Market Data...</div>;
  }

  // Check if user has no portfolios
  if (!portfolios || portfolios.length === 0) {
    return (
      <div className="performance-page">
        <Navbar loginOptions={myLoginOptions} />
        <div className="report-container-fluid">
          <div className="empty-state">
            <h2>No Portfolios Found</h2>
            <p>You haven't created any portfolios yet. Please create a portfolio first to view performance data.</p>
            <Link to="/investor" className="empty-state-link">
              Go to Dashboard
            </Link>
          </div>
        </div>
        <footer className="home-footer1">
          <img src={logo} alt="logo" className="hero-logo-footer" />
          <h5>© 2026 PortSure – Portfolio Risk Analysis</h5>
        </footer>
      </div>
    );
  }

  // Check if activeData exists
  if (!activeData) {
    return (
      <div className="performance-page">
        <Navbar loginOptions={myLoginOptions} />
        <div className="report-container-fluid">
          <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>
            <h2>No Portfolio Selected</h2>
            <p>Unable to load portfolio data. Please try again.</p>
            <Link to="/investor" style={{ color: "#0ea5e9", textDecoration: "underline" }}>
              Go to Dashboard
            </Link>
          </div>
        </div>
        <footer className="home-footer1">
          <img src={logo} alt="logo" className="hero-logo-footer" />
          <h5>© 2026 PortSure – Portfolio Risk Analysis</h5>
        </footer>
      </div>
    );
  }

  // Check if portfolio is approved before calculating gain/loss
  const isApproved = allowedStatuses.includes(
    String(activeData?.status || "").toUpperCase()
  );

  const gainLoss = isApproved ? finalValue - (activeData?.investedAmount || 0) : 0;
  const profitStatus = isApproved
    ? (gainLoss > 0 ? "PROFIT" : gainLoss < 0 ? "LOSS" : "NO CHANGE")
    : "PENDING";

  const reportPayload = {
    portfolioId: activeData.portfolioId,
    portfolioName: activeData.portfolioName,
    investedAmount: activeData.investedAmount,
    finalValue: isApproved ? finalValue : activeData.investedAmount,
    gainLoss,
    profitStatus,
    metrics: { totalReturn, volatility, riskAdjusted, efficiencyScore },
    generatedAt: new Date().toLocaleString()
  };

  // Update the Export Report link with reportPayload
  const myLoginOptionsWithReport = (
    <div className="home-links">
      <Link to="/investor" className="ad">Home</Link>
      <Link to="/portfolio-performances" className="ad active">Performance Dashboard</Link>
      <Link to="/export-reports" state={{ reportData: reportPayload }} className="ad">
        Export Report
      </Link>
    </div>
  );

  return (
    <div className="performance-page">
      <Navbar loginOptions={myLoginOptionsWithReport} />

      <div className="report-container-fluid">
        <section className="portfolio-selector-bar">
          <div className="selector-label">Your Active Portfolios:</div>
          <div className="selector-scroll">
            {portfolios.map(p => (
              <div
                key={p.portfolioId}
                className={`portfolio-card-mini ${String(selectedId) === String(p.portfolioId) ? "active" : ""
                  }`}
                onClick={() => setSelectedId(p.portfolioId)}
              >
                <span className="p-id">PF-{p.portfolioId}</span>
                <span className="p-name">{p.portfolioName}</span>
              </div>
            ))}
          </div>
        </section>

        <main className="report-main">
          <section className="metrics-summary">
            <div className="metric-card return">
              <label>Net Returns</label>
              <h3>{totalReturn}%</h3>
            </div>
            <div className="metric-card volatility">
              <label>Volatility</label>
              <h3>{volatility}</h3>
            </div>
            <div className="metric-card efficiency">
              <label>Efficiency Score</label>
              <h3>{efficiencyScore}</h3>
            </div>
          </section>

          <div className="chart-panel">
            <h4>Portfolio Growth Trend (₹)</h4>
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart data={monthlyData} margin={{ top: 20, right: 30, left: 80, bottom: 80 }}>
                <defs>
                  <linearGradient id="gradValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={baseGrowth >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={baseGrowth >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={baseGrowth >= 0 ? "#059669" : "#dc2626"} />
                    <stop offset="100%" stopColor={baseGrowth >= 0 ? "#10b981" : "#ef4444"} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickMargin={12}
                  stroke="#9ca3af"
                  label={{ value: 'Month', position: 'insideBottom', dy: 20, style: { fontSize: 14, fontWeight: 600, fill: "#374151" } }}
                />
                <YAxis
                  tickFormatter={val => `₹${Number(val).toLocaleString()}`}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickMargin={8}
                  stroke="#9ca3af"
                  domain={[yMin, yMax]}
                  label={{ value: 'Value (₹)', angle: -90, position: 'left', dx: -45, style: { fontSize: 14, fontWeight: 600, fill: "#374151" } }}
                />
                <Tooltip
                  formatter={value => [`₹${Number(value).toLocaleString()}`, 'Portfolio Value']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{ fontWeight: 600, color: '#374151' }}
                />
                <ReferenceLine
                  y={invested}
                  stroke="#9ca3af"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{
                    value: `Initial Investment: ₹${Number(invested).toLocaleString()}`,
                    position: 'insideTopRight',
                    fill: '#6b7280',
                    fontSize: 12,
                    fontWeight: 600,
                    offset: 10
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="url(#strokeGrad)"
                  strokeWidth={3}
                  fill="url(#gradValue)"
                  dot={false}
                  activeDot={{ r: 7, strokeWidth: 2, fill: baseGrowth >= 0 ? "#10b981" : "#ef4444" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-spacing" />

          <div className="chart-panel">
            <h4>Portfolio Performance Summary</h4>
            <table className="portfolio-table">
              <thead>
                <tr>
                  <th>Portfolio ID</th>
                  <th>Initial Investment</th>
                  <th>Final Value</th>
                  <th>Gain / Loss</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeData && (
                  <tr className="portfolio-row">
                    <td data-label="Portfolio ID">PF-{activeData.portfolioId}</td>
                    <td data-label="Initial Investment">₹ {Number(activeData.investedAmount || 0).toFixed(2)}</td>
                    <td data-label="Final Value">
                      ₹ {isApproved ? Number(finalValue).toFixed(2) : Number(activeData.investedAmount || 0).toFixed(2)}
                    </td>
                    <td data-label="Gain / Loss" className={gainLoss >= 0 ? "gain-positive" : gainLoss < 0 ? "gain-negative" : "gain-neutral"}>
                      ₹ {Number(gainLoss || 0).toFixed(2)}
                    </td>
                    <td data-label="Status" className="status-bold">
                      {
                        (() => {
                          const rawStatus = activeData.status || profitStatus;
                          const statusKey = String(activeData.status || profitStatus || "").toLowerCase();
                          if (statusKey) {
                            return <span className={`status-badge ${statusKey}`}>{rawStatus}</span>;
                          }
                          return rawStatus;
                        })()
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <footer className="home-footer1">
        <img src={logo} alt="logo" className="hero-logo-footer" />
        <h5>© 2026 PortSure – Portfolio Risk Analysis & Investment Compliance System</h5>
      </footer>
    </div>
  );
}

export default PerformanceDashboard;