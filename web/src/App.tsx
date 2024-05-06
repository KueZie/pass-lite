import React, { Suspense } from 'react';
import './App.css';
import { Dashboard } from './screens/DeploymentsScreen';
import { DashboardLayout } from './layout/DashboardLayout';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { DeploymentCreateScreen } from './screens/DeploymentCreateScreen';
import NotFoundScreen from './screens/NotFoundScreen';

const AllRoutes = () => {
 return (
  <Suspense fallback={<div>Loading...</div>}>
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout/>}>
          <Route index element={<Dashboard />} />
          <Route path="create" element={<DeploymentCreateScreen />} />
        </Route>
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </BrowserRouter>
  </Suspense>
 )
};

function App() {
  return (
    <div className="App">
      <AllRoutes />
    </div>
  );
}

export default App;
