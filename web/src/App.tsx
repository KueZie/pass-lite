import React from 'react';
import './App.css';
import { Dashboard } from './screens/Dashboard';
import { DashboardLayout } from './layout/DashboardLayout';



function App() {
  return (
    <div className="App">
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </div>
  );
}

export default App;
