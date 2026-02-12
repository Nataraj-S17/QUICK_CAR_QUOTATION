import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import authService from '../services/authService';

const Navbar = ({ onOpenQuotation }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const checkAuth = () => {
        const customerToken = authService.getCustomerToken();
        const adminToken = authService.getToken();
        setIsAuthenticated(!!customerToken || !!adminToken);
        setIsAdmin(!!adminToken);
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        // Initial Auth Check
        checkAuth();

        // Listen for custom auth events
        window.addEventListener('auth-change', checkAuth);
        // Also listen for storage changes (in case of multi-tab)
        window.addEventListener('storage', checkAuth);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('auth-change', checkAuth);
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    const handleLogout = () => {
        if (isAdmin) {
            authService.logout();
        } else {
            authService.logoutCustomer();
        }
        window.dispatchEvent(new Event('auth-change'));
        navigate('/');
    };

    const handleNavClick = (href) => {
        if (href.startsWith('/')) {
            navigate(href);
        } else {
            // If it's a hash link, check if we are on home page
            if (location.pathname !== '/') {
                navigate(`/${href}`);
                setTimeout(() => {
                    const element = document.querySelector(href);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                const element = document.querySelector(href);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4 glass border-b border-white/10' : 'py-6 bg-transparent'
            }`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 decoration-none group">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform">
                        <span className="text-white font-black text-xl -rotate-12 group-hover:rotate-0 transition-transform">S</span>
                    </div>
                    <span className="text-xl md:text-2xl font-outfit font-black tracking-tighter text-white">
                        SIVA AUTO <span className="text-blue-500">CONSULTANCY</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => handleNavClick(link.href)}
                            className="text-sm font-bold text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer uppercase tracking-wider relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
                        </button>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    {!isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="text-sm font-bold text-white hover:text-blue-400 transition-colors uppercase tracking-wider"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-bold transition-all text-white backdrop-blur-md"
                            >
                                Register
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            {isAdmin && (
                                <Link to="/admin/dashboard" className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider">
                                    Dashboard
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-full text-sm font-bold text-red-200 transition-all backdrop-blur-md cursor-pointer uppercase tracking-wider"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
