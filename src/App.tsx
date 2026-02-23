import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Navigation } from './components/Navigation';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.Register })));
const ScanStudio = lazy(() => import('./pages/ScanStudio').then(module => ({ default: module.ScanStudio })));
const Marketplace = lazy(() => import('./pages/Marketplace').then(module => ({ default: module.Marketplace })));
const StyleGuide = lazy(() => import('./pages/StyleGuide').then(module => ({ default: module.StyleGuide })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const StoreAssistant = lazy(() => import('./pages/StoreAssistant').then(module => ({ default: module.StoreAssistant })));
const Checkout = lazy(() => import('./pages/Checkout').then(module => ({ default: module.Checkout })));
const AdminPanel = lazy(() => import('./pages/AdminPanel').then(module => ({ default: module.AdminPanel })));

function App() {
  const { getCurrentUser } = useAuthStore();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <Router>
      <Navigation />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-sand-50 dark:bg-dark-950">
          <LoadingSpinner size="lg" variant="neon" />
        </div>
      }>
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
      </Suspense>
    </Router>
  );
}

export default App;
