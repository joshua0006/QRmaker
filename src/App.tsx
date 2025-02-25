import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QRCodeGenerator from './components/QRCodeGenerator';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import RedirectPage from './components/RedirectPage';
import ShortRedirectPage from './pages/ShortRedirectPage';
import AnalyticsView from './components/AnalyticsView';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<QRCodeGenerator />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/qr/:uniqueId" element={<RedirectPage />} />
          <Route path="/redirect/:uniqueId" element={<RedirectPage />} />
          <Route path="/r/:shortId" element={<ShortRedirectPage />} />
          <Route path="/analytics/:uniqueId" element={<AnalyticsView />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;