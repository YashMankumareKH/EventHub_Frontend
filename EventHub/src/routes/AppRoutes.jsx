import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Events from '../pages/Events';
import EventDetail from '../pages/EventDetail';
import UserDashboard from '../pages/UserDashboard';
import ManagerDashboard from '../pages/ManagerDashboard';
import AdminDashboard from '../pages/AdminDashboard';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetail />} />
      
      {/* Auth Routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
      />

      {/* Dashboard Router */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            {user?.role === 'ROLE_ADMIN' ? <AdminDashboard /> :
             user?.role === 'ROLE_MANAGER' ? <ManagerDashboard /> :
             <UserDashboard />}
          </ProtectedRoute>
        } 
      />

      {/* Role-specific Routes */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/manager/*" 
        element={
          <ProtectedRoute requiredRole="ROLE_MANAGER">
            <ManagerDashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/user/*" 
        element={
          <ProtectedRoute requiredRole="ROLE_PARTICIPANT">
            <UserDashboard />
          </ProtectedRoute>
        } 
      />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;