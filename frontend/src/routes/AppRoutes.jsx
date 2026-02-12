import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../pages/Register';
import AdminDashboard from '../pages/AdminDashboard';
import AdminLogin from '../pages/AdminLogin';
import CustomerLogin from '../pages/CustomerLogin';
import RequirementForm from '../pages/RequirementForm';
import RecommendationResult from '../pages/RecommendationResult';
import Home from '../pages/Home';
import AdminRouteGuard from '../components/AdminRouteGuard';
import CustomerRouteGuard from '../components/CustomerRouteGuard';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Customer Routes */}
            <Route element={<CustomerRouteGuard />}>
                <Route path="/requirements" element={<RequirementForm />} />
                <Route path="/recommendation/:id" element={<RecommendationResult />} />
                {/* Add other customer protected routes here */}
            </Route>

            {/* Public Admin Route - Redirect to Universal Login */}
            <Route path="/admin/login" element={<Navigate to="/login" replace />} />

            {/* Protected Admin Routes */}
            <Route element={<AdminRouteGuard />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/cars" element={<div>Cars Management (Coming Soon)</div>} />
                <Route path="/admin/quotations" element={<div>Quotations (Coming Soon)</div>} />
            </Route>

            {/* Catch all /admin redirects to admin login if not matched */}
            <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />

            {/* General Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
