import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 🔍 Debugging sementara:
  console.log('AdminRoute: loading=', loading, 'user=', user);

  if (loading) {
    return <div className="text-center mt-5">Memuat data...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.role) {
    return <div className="text-center mt-5 text-danger">❗ Peran tidak terbaca...</div>;
  }

  if (user.role !== 'owner') {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default AdminRoute;
