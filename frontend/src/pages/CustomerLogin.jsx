import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const CustomerLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // If already logged in, redirect accordingly
        if (authService.getToken()) {
            navigate('/admin/dashboard');
        } else if (authService.getCustomerToken()) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // UNIFIED LOGIN LOGIC
            if (email === 'admin@gmail.com') {
                // Try Admin Login
                await authService.loginAdmin(email, password);
                navigate('/admin/dashboard');
            } else {
                // Try Customer Login
                const data = await authService.loginCustomer(email, password);
                if (data.token) {
                    window.dispatchEvent(new Event('auth-change'));
                    navigate('/');
                }
            }
        } catch (err) {
            console.error("Login failed:", err);
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden py-20">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-md p-8 glass border border-white/10 rounded-[2rem] shadow-2xl animate-fade-in-up">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-outfit font-black tracking-tight mb-2">Welcome Back</h2>
                    <p className="text-slate-400 text-sm">Sign in to access your dashboard</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-shake">
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 focus:border-blue-500/50 outline-none transition-all focus:ring-4 focus:ring-blue-500/5 text-white placeholder-slate-600"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 focus:border-blue-500/50 outline-none transition-all focus:ring-4 focus:ring-blue-500/5 text-white placeholder-slate-600"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold text-white shadow-xl shadow-blue-900/20 hover:shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm">
                        Don't have an account? <Link to="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CustomerLogin;
