import { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
            setError('All fields are required');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            await authService.registerCustomer(formData);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center relative overflow-hidden py-20">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-lg p-8 glass border border-white/10 rounded-[2rem] shadow-2xl animate-fade-in-up">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-outfit font-black tracking-tight mb-2">Create Account</h2>
                    <p className="text-slate-400 text-sm">Join the elite automotive network</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-shake">
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="text-center py-10 space-y-6 animate-fade-in">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Registration Successful!</h3>
                        <p className="text-slate-400">Your account has been created.</p>
                        <Link
                            to="/login"
                            className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-900/20"
                        >
                            Login Now
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 focus:border-blue-500/50 outline-none transition-all focus:ring-4 focus:ring-blue-500/5 text-white placeholder-slate-600"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                placeholder="name@example.com"
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 focus:border-blue-500/50 outline-none transition-all focus:ring-4 focus:ring-blue-500/5 text-white placeholder-slate-600"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                onChange={handleChange}
                                placeholder="+1 234 567 8900"
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 focus:border-blue-500/50 outline-none transition-all focus:ring-4 focus:ring-blue-500/5 text-white placeholder-slate-600"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 focus:border-blue-500/50 outline-none transition-all focus:ring-4 focus:ring-blue-500/5 text-white placeholder-slate-600"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold text-white shadow-xl shadow-blue-900/20 hover:shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-4"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>
                )}

                {!success && (
                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            Already have an account? <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">Login</Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;
