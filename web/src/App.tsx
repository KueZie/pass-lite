import React, { Suspense } from 'react';
import './App.css';
import { Dashboard } from './screens/DeploymentsScreen';
import { DashboardLayout } from './layout/DashboardLayout';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { DeploymentCreateScreen } from './screens/DeploymentCreateScreen';
import NotFoundScreen from './screens/NotFoundScreen';
import RootLayout from './layout/RootLayout';
import { DeploymentPreviewScreen } from './screens/DeploymentPreviewScreen';

const AllRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />} >
            <Route path="dashboard">
              <Route index element={<h1>Dashboard</h1>} />
              <Route path="deployments">
                <Route index element={<Dashboard />} />
                <Route path="create" element={<DeploymentCreateScreen />} />
                <Route path="preview" element={<DeploymentPreviewScreen />} />
              </Route>
            </Route>
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
