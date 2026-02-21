import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'; 
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 
import Navbar from '../../Navbar/Navbar';
import "../../CSSDesgin2/Diversification.css";
import logo from "../../logo/logo.png";
import Footer from '../Footer';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function PortfolioDiversification() {
  const location = useLocation();
  const navigate = useNavigate();
  const portfolio = location.state?.portfolio;

  if (!portfolio) {
    return (
      <div className="ps-enterprise-wrapper">
        <Navbar />
        <div className="error-state">
          <div className="error-card">
            <h2>No Portfolio Selected</h2>
            <p>Please return to the Asset Manager dashboard to view diversification details.</p>
            <button className="ps-primary-btn" onClick={() => navigate('/asset-manager')}>
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: ['Equity', 'Bonds', 'Derivatives'],
    datasets: [{
      data: [portfolio.equity, portfolio.bond, portfolio.derivative],
      backgroundColor: ['#2563eb', '#10b981', '#f59e0b'],
      borderWidth: 0,
      hoverOffset: 20,
    }],
  };

  const chartOptions = {
    plugins: {
      legend: { 
        display: true,
        position: 'bottom',
        labels: {
          font: { size: 14, weight: '600' },
          usePointStyle: true,
          padding: 15
        }
      },

      datalabels: {
        display: true,
        color: '#fff', 
        font: {
          weight: 'bold',
          size: 16,
        },
        formatter: (value) => {
          return value > 0 ? `${value}%` : ''; 
        },
        anchor: 'center',
        align: 'center',
      }
    },
    cutout: '65%',
    maintainAspectRatio: false,
  };

  const myLoginOptions = (
    <div className="home-links">
      <Link to="/asset-manager" className="ad">Home</Link>
      <Link to="/portfolio-diversification" className="ad active">Diversification</Link>
    </div>
  );

  return (
   
    <div className="ps-enterprise-wrapper">
      <Navbar loginOptions={myLoginOptions}/>
      <div className="main-section">
        <main className="ps-main-layout diversification-layout">
          <aside className="ps-sidebar">
            <div className="ps-glass-card summary-card highlight-border">
              <div className="card-header">
                <span className="ps-tag">Portfolio ID: PF-{portfolio.portfolio_id}</span>
                <h3>Analysis Overview</h3>
              </div>
              <div className="card-stats">
                <div className="stat-row">
                  <label>Investor Name</label>
                  <p className="stat-value">{portfolio.investor_name}</p>
                </div>
                <div className="stat-row">
                  <label>Total Holdings</label>
                  <p className="stat-value">{portfolio.quantity?.toLocaleString()} Units</p>
                </div>
              </div>
            </div>
          </aside>

          <section className="ps-form-content">
            <div className="ps-form-header">
              <h2>Asset Distribution</h2>
              <p>Visual breakdown of risk exposure across capital markets.</p>
            </div>

            <div className="diversification-grid">
              <div className="ps-input-card chart-container" style={{ position: 'relative', height: '400px' }}>
                <Doughnut data={chartData} options={chartOptions} />
              </div>

              <div className="table-container">
                <table className="ps-audit-table">
                  <thead>
                    <tr>
                      <th>Asset Class</th>
                      <th>Weighting</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="bold"><span className="dot equity"></span> Equity</td>
                      <td>{portfolio.equity}%</td>
                    </tr>
                    <tr>
                      <td className="bold"><span className="dot bond"></span> Bonds</td>
                      <td>{portfolio.bond}%</td>
                    </tr>
                    <tr>
                      <td className="bold"><span className="dot derivative"></span> Derivatives</td>
                      <td className='d'>{portfolio.derivative}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
      </div>
    
  );
}