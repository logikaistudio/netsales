```javascript
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
// Pages
import Dashboard from './pages/Dashboard';
import Prospects from './pages/Prospects';
// Master Data Pages
import MasterDataIndex from './pages/master/MasterDataIndex';
import Regional from './pages/master/Regional';
import Districts from './pages/master/Districts';
import SalesTeam from './pages/master/SalesTeam';
import Products from './pages/master/Products';
import Promos from './pages/master/Promos';
import Targets from './pages/master/Targets';
import { MasterDataProvider } from './context/MasterDataContext';

function App() {
  return (
    <BrowserRouter>
      <MasterDataProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/prospects" element={<Prospects />} />
            
            {/* Master Data Routes */}
            <Route path="/master" element={<MasterDataIndex />} />
            <Route path="/master/regional" element={<Regional />} />
            <Route path="/master/districts" element={<Districts />} />
            <Route path="/master/sales" element={<SalesTeam />} />
            <Route path="/master/products" element={<Products />} />
            <Route path="/master/promos" element={<Promos />} />
            <Route path="/master/targets" element={<Targets />} />
            
            {/* Legacy Redirects (if needed) */}
            <Route path="/targets" element={<Navigate to="/master/targets" replace />} />
          </Routes>
        </Layout>
      </MasterDataProvider>
    </BrowserRouter>
  );
}

export default App;
```
