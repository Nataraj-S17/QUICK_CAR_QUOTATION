import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const CustomerRouteGuard = () => {
    const token = localStorage.getItem('customerToken');
    const userStr = localStorage.getItem('customerUser');
    let user = null;

    try {
        if (userStr) {
            user = JSON.parse(userStr);
        }
    } catch (e) {
        console.error("Error parsing customer user", e);
    }

    // Check if token exists AND user role is explicitly customer
    if (!token || !user || user.role !== 'customer') {
        // Redirect to Customer Login if not authorized
        return <Navigate to="/login" replace />;
    }

    // If authorized, render child routes
    return <Outlet />;
};

export default CustomerRouteGuard;
