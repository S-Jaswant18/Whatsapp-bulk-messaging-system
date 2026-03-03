import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Chat from './pages/Chat';
import Campaigns from './pages/Campaigns';
import Automation from './pages/Automation';
import Analytics from './pages/Dashboard'; // Using dashboard for now as they share charts
import Settings from './pages/Settings';
import ActivityLog from './pages/ActivityLog';

const App = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/automation" element={<Automation />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/activity" element={<ActivityLog />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
