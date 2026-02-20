import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Navigation } from './components/Navigation';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ScanStudio } from './pages/ScanStudio';
import { Marketplace } from './pages/Marketplace';
import { StyleGuide } from './pages/StyleGuide';
import { Dashboard } from './pages/Dashboard';
import { StoreAssistant } from './pages/StoreAssistant';
import { Checkout } from './pages/Checkout';
import { AdminPanel } from './pages/AdminPanel';

function App() {
  const { getCurrentUser } = useAuthStore();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/scan"
          element={
            <ProtectedRoute>
              <ScanStudio />
            </ProtectedRoute>
          }
        />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/assistant" element={<StoreAssistant />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/style-guide" element={<StyleGuide />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
