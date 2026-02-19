import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/module2/PortSureHome'
import Home from './component/HomePage'
import Di from './component/module2/Diversification'
import LoginPage from './component/module1/LoginPage1';
import Asset from './component/module2/AssetManager';
import Invest from './component/module5/InvestorDashboard';
import Regis from './component/module1/Register';
import InternalRegis from './component/module1/InternalRegister';
import Riskscore from './component/module3/RiskScoreScreen';
import Riskscore1 from './component/module3/ExposureAlertScreen';
import CompDash from './component/module4/ComplianceDashboard';
import CompLogs from './component/module4/ComplianceLogs';
import Per from './component/module5/PerformanceDashBoard';
import Re from './component/module5/ReportExport';
import Request from './component/module2/Request';
import ForgotPassword from './component/module1/ForgotPassword';

function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/asset-manager" element={<Asset />} />
            <Route path="/investor" element={<Invest />} />
            <Route path="/register" element={<Regis />}></Route>
            <Route path="/internal-registers" element={<InternalRegis />}></Route>
            <Route exact path="/asset-allocation" element={<Navbar />}></Route>

            <Route exact path="/portfolio-diversification" element={<Di />}></Route>
            <Route exact path="/risk-score" element={<Riskscore />}></Route>
            <Route exact path="/exposure-alerts" element={<Riskscore1 />}></Route>

            <Route exact path="/compliance-officer" element={<CompDash />}></Route>
            <Route exact path="/compliance-logs" element={<CompLogs />}></Route>

            <Route exact path="/portfolio-performances" element={<Per />}></Route>
            <Route exact path="/export-reports" element={<Re />}></Route>
            <Route exact path="/requests" element={<Request />}></Route>
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App;