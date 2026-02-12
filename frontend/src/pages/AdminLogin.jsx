import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './AdminDashboard.css';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({
        email: 'admin@gmail.com', // Pre-fill for dev/demo ease
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.loginAdmin(credentials.email, credentials.password);
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 800);
        } catch (err) {
            setError(err.message || 'Login failed. Only authorized admins allowed.');
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container admin-bg-animate">
            {/* Background blobs simplified for pure CSS (could use images, but sticking to gradients in CSS) */}

            <div className="admin-glass-card fade-in-up">
                <div className="text-center mb-8">
                    <h1 className="admin-title">
                        Admin Portal
                    </h1>
                    <p className="admin-subtitle">Secure Access Only</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fecaca', display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                        <span>⚠️ {error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Identity</label>
                        <input
                            type="email"
                            name="email"
                            value={credentials.email}
                            readOnly
                            className="admin-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            className="admin-input"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="admin-btn"
                    >
                        {loading ? 'Authenticating...' : 'Access Dashboard'}
                    </button>
                </form>

                <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ fontSize: '0.75rem', color: '#71717a' }}>
                        Restricted Area. Unauthorized access attempts are monitored.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
