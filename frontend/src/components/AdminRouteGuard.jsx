import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRouteGuard = () => {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    let user = null;

    try {
        if (userStr) {
            user = JSON.parse(userStr);
        }
    } catch (e) {
        console.error("Error parsing admin user", e);
    }

    // Check if token exists AND user role is explicitly admin
    if (!token || !user || user.role !== 'admin') {
        // Redirect to Admin Login if not authorized
        return <Navigate to="/login" replace />;
    }

    // If authorized, render child routes
    return <Outlet />;
};

export default AdminRouteGuard;
