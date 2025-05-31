import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Reports from './pages/Reports';
import Expenses from './pages/Expenses';
import Dashboard from './pages/Dashboard'; // Make sure this exists
import Layout from './components/layout/Layout'; // Make sure this exists
import PublicLayout from './components/layout/PublicLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import Settings from './pages/Settings';



function App() {
  const { isAuthenticated, checkAuth} = useAuthStore();
  const location = useLocation();
  useEffect(() => {
  checkAuth();
}, [checkAuth]);


  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
          />
        </Route>

        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
