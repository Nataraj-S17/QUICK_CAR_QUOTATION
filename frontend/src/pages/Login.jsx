import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (authService.getToken()) {
            navigate('/admin');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // For now, assuming Admin Login since user requested it.
            // In a real app, we might have separate login pages or a role selection.
            // But the Requirement says "ADMIN LOGIN PAGE". 
            // So this component will act as Admin Login for this task.

            const data = await authService.loginAdmin(email, password);

            if (data.token) {
                navigate('/admin');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Cinematic Background Video */}
            <video autoPlay loop muted className="background-video">
                <source src="https://cdn.pixabay.com/video/2020/04/18/36049-411257404_large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="auth-card">
                <h2>Admin Login</h2>
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@system.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    <small>Note: This is strictly for Admins.</small>
                </p>
            </div>
        </div>
    );
};

export default Login;
