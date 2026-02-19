import React from 'react';
import '../../CSSDesgin2/TradeCature.css';

const TradeCature = ({ alerts, readAlerts, setReadAlerts, onClose }) => {
  const handleMarkAllRead = () => {
    const allAlertIds = alerts.map((alert, index) => alert.id || alert.alertId || index);
    setReadAlerts(new Set(allAlertIds));
  };

  const handleMarkAsRead = (alertId) => {
    setReadAlerts(prev => new Set([...prev, alertId]));
  };

  const unreadCount = alerts.filter((alert, index) => {
    const alertId = alert.id || alert.alertId || index;
    return !readAlerts.has(alertId);
  }).length;

  return (
    <section className="inner-view-section">
      <div className="module-card1">
        <div className="module-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>🔔</span>
            <h3>Compliance Notifications</h3>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} unread</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {alerts.length > 0 && unreadCount > 0 && (
              <button className="mark-read-btn" onClick={handleMarkAllRead}>
                ✓ Mark All as Read
              </button>
            )}
            <button className="close-view-btn" onClick={onClose}>Close</button>
          </div>
        </div>

        <div className="alerts-list">
          {alerts.length > 0 ? (
            alerts.map((alert, index) => {
              const alertId = alert.id || alert.alertId || index;
              const isRead = readAlerts.has(alertId);
              const isBreach = alert.alertType === "Compliance Breach";
              const status = alert.status || "UNKNOWN";
              const isCritical = status === 'CRITICAL_BREACH' || status === 'BREACH';

              return (
                <div 
                  key={alertId}
                  className={`alert-card ${isCritical ? 'critical' : 'warning'} ${isRead ? 'read' : 'unread'}`}
                  onClick={() => handleMarkAsRead(alertId)}
                  style={{ cursor: 'pointer' }}
                >

                  <div className="alert-header">
                    <strong className="alert-title">
                      {isBreach ? alert.alertType : `${alert.assetType} Exposure Alert`}
                    </strong>
                    <small className="alert-date">
                      {new Date(alert.date || alert.timestamp).toLocaleString()}
                    </small>
                  </div>

                  <div className="alert-body">
                    Portfolio: <strong>{alert.portfolioName || alert.portfolio?.portfolioName}</strong>
                    (PF-{alert.portfolioId || alert.portfolio?.portfolioId})
                  </div>

                  {isBreach ? (
                    <div className="alert-findings">
                      <strong>Findings:</strong> {alert.message || alert.findings}
                    </div>
                  ) : (
                    <div className="alert-details">
                      <span>Actual: <b className="val-danger">{alert.exposureValue}%</b></span>
                      <span>Limit: <b>{alert.limitValue}%</b></span>
                    </div>
                  )}

                  <div className="alert-status">
                    <span className={`status-text ${isCritical ? 'critical' : 'warning'}`}>
                      {status}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-alerts">
              No compliance alerts found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TradeCature;