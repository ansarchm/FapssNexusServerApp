// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authAPI.isAuthenticated();
  
  console.log('🔒 ProtectedRoute - Is Authenticated:', isAuthenticated);
  
  if (!isAuthenticated) {
    console.log('❌ Not authenticated - Redirecting to login');
    return <Navigate to="/" replace />;
  }
  
  console.log('✅ Authenticated - Rendering protected content');
  return children;
};

export default ProtectedRoute;