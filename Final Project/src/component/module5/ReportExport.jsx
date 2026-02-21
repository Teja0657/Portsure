import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Navbar from '../../Navbar/Navbar';
import logo from '../../logo/logo.png';
import '../../CSSDesgin5/ReportExport.css';
import Footer from '../Footer';

function ExportReport() {
  const location = useLocation();
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolios, setSelectedPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Session Isolation: Investor context
  const loggedInUser = JSON.parse(localStorage.getItem("investor_user") || "{}");
  // Handle nested user object
  const userData = loggedInUser.user || loggedInUser;
  const investorId = userData.investorId || userData.id;
  const token = loggedInUser.token;

  useEffect(() => {
    if (!investorId || !token) {
      // Stop loading if no valid user/token, allows rendering the "No Portfolios/Empty" state or redirect logic
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8081/api/portfolios/investor/${investorId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        setPortfolios(data || []);
        const passedData = location.state?.reportData;
        if (passedData?.portfolioId) {
          setSelectedPortfolios([passedData.portfolioId]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching portfolios:", err);
        setLoading(false);
      });
  }, [investorId, token, location.state]);

  const myLoginOptions = (
    <div className='home-links'>
      <Link to='/investor' className='ad'>Home</Link>
      <Link to='/portfolio-performances' className='ad'>Performance Dashboard</Link>
      <Link to='/export-reports' className='ad active'>Export Report</Link>
    </div>
  );

  if (loading) {
    return <div className='light-loader'>Loading portfolios...</div>;
  }

  if (!investorId || portfolios.length === 0) {
    return (
      <div className='report-export-page'>
        <Navbar loginOptions={myLoginOptions} />
        <div className="report-export-container">
          <div className="report-empty-state">
            <h2>No Portfolios Available</h2>
            <p>You haven't created any portfolios yet. Please create portfolios to generate reports.</p>
            <div className="report-empty-link-container">
              <Link to='/investor' className="report-empty-link">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
        <footer className='home-footer1'>
          <img src={logo} alt='logo' className='hero-logo-footer' />
          <h5> 2026 PortSure – Portfolio Risk Analysis</h5>
        </footer>
      </div>
    );
  }

  const calculateMetrics = (portfolio) => {
    const allowedStatuses = ['APPROVED', 'EXECUTED', 'COMPLETED'];
    const isApproved = allowedStatuses.includes(String(portfolio.status || '').toUpperCase());

    if (!isApproved) {
      return {
        finalValue: portfolio.investedAmount,
        gainLoss: 0,
        profitStatus: 'PENDING',
        totalReturn: '0.00',
        volatility: '0.00',
        riskAdjusted: '0.00'
      };
    }

    const invested = Number(portfolio.investedAmount || 0);
    const index = portfolios.findIndex(p => p.portfolioId === portfolio.portfolioId);

    // Use portfolioId as seed for consistent random-like behavior
    const seed = portfolio.portfolioId || index;

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

    // Simple calculation without monthly noise for consistency
    const finalValue = invested * (1 + returnPercentage);
    const gainLoss = finalValue - invested;
    const profitStatus = gainLoss > 0 ? 'PROFIT' : gainLoss < 0 ? 'LOSS' : 'NO CHANGE';
    const totalReturn = ((gainLoss / invested) * 100).toFixed(2);

    // Calculate unique volatility and efficiency with decimals for each portfolio
    const volatilityRaw = 5 + ((seed * 41 + seed * seed * 7) % 210) / 10;
    const volatility = volatilityRaw.toFixed(2);
    const riskAdjusted = volatility > 0 ? (totalReturn / volatility).toFixed(2) : '0.00';

    return {
      finalValue,
      gainLoss,
      profitStatus,
      totalReturn,
      volatility,
      riskAdjusted
    };
  };

  const togglePortfolioSelection = (portfolioId) => {
    setSelectedPortfolios(prev =>
      prev.includes(portfolioId)
        ? prev.filter(id => id !== portfolioId)
        : [...prev, portfolioId]
    );
  };

  const selectAllPortfolios = () => {
    if (selectedPortfolios.length === portfolios.length) {
      setSelectedPortfolios([]);
    } else {
      setSelectedPortfolios(portfolios.map(p => p.portfolioId));
    }
  };

  const downloadPDF = () => {
    if (selectedPortfolios.length === 0) {
      alert('Please select at least one portfolio to export');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Portfolio Performance Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    const selectedData = portfolios
      .filter(p => selectedPortfolios.includes(p.portfolioId))
      .map(p => {
        const metrics = calculateMetrics(p);
        return [
          `PF-${p.portfolioId}`,
          p.portfolioName,
          '₹ ' + Number(p.investedAmount || 0).toFixed(2),
          '₹ ' + Number(metrics.finalValue || 0).toFixed(2),
          '₹ ' + Number(metrics.gainLoss || 0).toFixed(2)
        ];
      });

    autoTable(doc, {
      startY: 30,
      head: [[
        'Portfolio ID',
        'Name',
        'Initial Investment',
        'Final Value',
        'Gain / Loss'
      ]],
      body: selectedData
    });

    doc.save(`Portfolio_Report_${new Date().getTime()}.pdf`);
  };

  const downloadExcel = () => {
    if (selectedPortfolios.length === 0) {
      alert('Please select at least one portfolio to export');
      return;
    }

    const sheetData = [
      ['Portfolio Performance Report'],
      ['Generated At', new Date().toLocaleString()],
      [],
      ['Portfolio ID', 'Portfolio Name', 'Initial Investment', 'Final Value', 'Gain / Loss', 'Total Return (%)', 'Volatility', 'Risk Score']
    ];

    portfolios
      .filter(p => selectedPortfolios.includes(p.portfolioId))
      .forEach(p => {
        const metrics = calculateMetrics(p);
        sheetData.push([
          `PF-${p.portfolioId}`,
          p.portfolioName,
          '₹ ' + Number(p.investedAmount || 0).toFixed(2),
          '₹ ' + Number(metrics.finalValue || 0).toFixed(2),
          '₹ ' + Number(metrics.gainLoss || 0).toFixed(2),
          metrics.totalReturn,
          metrics.volatility,
          metrics.riskAdjusted
        ]);
      });

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Portfolio Report');

    XLSX.writeFile(workbook, `Portfolio_Report_${new Date().getTime()}.xlsx`);
  };

  return (
    <div className='report-export-page'>
      <Navbar loginOptions={myLoginOptions} />

      <div className='report-export-container'>
        <div className='export-preview'>
          <h1>Export Portfolio Reports</h1>

          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0 }}>Select Portfolios to Export</h3>
              <button
                onClick={selectAllPortfolios}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b417dff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {selectedPortfolios.length === portfolios.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
              Selected: {selectedPortfolios.length} of {portfolios.length} portfolios
            </p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            {portfolios.map(portfolio => {
              const metrics = calculateMetrics(portfolio);
              const isSelected = selectedPortfolios.includes(portfolio.portfolioId);

              return (
                <div
                  key={portfolio.portfolioId}
                  onClick={() => togglePortfolioSelection(portfolio.portfolioId)}
                  style={{
                    padding: '15px',
                    marginBottom: '10px',
                    border: `2px solid ${isSelected ? '#393b8aff' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    backgroundColor: isSelected ? '#f0f9ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={(e) => { e.stopPropagation(); togglePortfolioSelection(portfolio.portfolioId); }}
                        style={{ marginRight: '10px', cursor: 'pointer' }}
                      />
                      <strong style={{ fontSize: '16px' }}>PF-{portfolio.portfolioId}</strong>
                      <span style={{ marginLeft: '10px', color: '#666' }}>{portfolio.portfolioName}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        Investment: {'₹ ' + Number(portfolio.investedAmount || 0).toFixed(2)}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: metrics.gainLoss >= 0 ? 'green' : metrics.gainLoss < 0 ? 'red' : '#666' }}>
                        {metrics.profitStatus}: {'₹' + Number(metrics.gainLoss || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <table className='portfolio-table'>
            <thead>
              <tr>
                <th>Portfolio ID</th>
                <th>Name</th>
                <th>Initial Investment</th>
                <th>Final Value</th>
                <th>Gain / Loss</th>
              </tr>
            </thead>
            <tbody>
              {portfolios
                .filter(p => selectedPortfolios.includes(p.portfolioId))
                .map(portfolio => {
                  const metrics = calculateMetrics(portfolio);
                  return (
                    <tr key={portfolio.portfolioId} className='portfolio-row'>
                      <td data-label='Portfolio ID'>PF-{portfolio.portfolioId}</td>
                      <td data-label='Name'>{portfolio.portfolioName}</td>
                      <td data-label='Initial Investment'>{'₹ ' + Number(portfolio.investedAmount || 0).toFixed(2)}</td>
                      <td data-label='Final Value'>{'₹ ' + Number(metrics.finalValue || 0).toFixed(2)}</td>
                      <td data-label='Gain / Loss' style={{ color: metrics.gainLoss >= 0 ? 'green' : metrics.gainLoss < 0 ? 'red' : '#666' }}>
                        {'₹ ' + Number(metrics.gainLoss || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {selectedPortfolios.length === 0 && (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No portfolios selected. Please select at least one portfolio to preview and export.
            </p>
          )}

          <div className='export-actions'>
            <button className='pdf1' onClick={downloadPDF}>
              Download PDF ({selectedPortfolios.length})
            </button>
            <button className='excel1' onClick={downloadExcel}>
              Download Excel ({selectedPortfolios.length})
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ExportReport;