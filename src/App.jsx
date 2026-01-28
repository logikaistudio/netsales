import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Prospects from './pages/Prospects';
import Targets from './pages/Targets';
import ProductMaster from './pages/ProductMaster';
import Placeholder from './pages/Placeholder';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/prospects" element={<Prospects />} />
          <Route path="/targets" element={<Targets />} />
          <Route path="/master" element={<ProductMaster />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
