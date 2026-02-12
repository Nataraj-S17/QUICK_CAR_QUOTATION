import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import requirementService from '../services/requirementService';
import authService from '../services/authService';

const RequirementForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        budget: '',
        usageType: '',
        mileageImportance: '',
        maintenancePreference: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Auth Check
        const token = authService.getCustomerToken();
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.budget || !formData.usageType || !formData.mileageImportance || !formData.maintenancePreference) {
            setError('All fields are required.');
            return false;
        }
        if (isNaN(formData.budget) || Number(formData.budget) <= 0) {
            setError('Please enter a valid budget.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            // Map frontend state (camelCase) to backend expectations (snake_case)
            const payload = {
                budget: formData.budget,
                usage_type: formData.usageType,
                mileage_priority: formData.mileageImportance,
                maintenance_priority: formData.maintenancePreference
            };

            const response = await requirementService.submitRequirements(payload); // Assuming response contains { success: true, requirementId: 123 }
            // Backend returns: { success: true, data: { id: 1, ... } }

            setSuccess('Requirements submitted successfully! AI is finding your match...');

            // Redirect to recommendation page
            setTimeout(() => {
                const reqId = response.data && response.data.id ? response.data.id : response.requirementId;
                // Fallback just in case, but data.id is expected key from controller
                navigate(`/recommendation/${reqId}`);
            }, 1500); // Short delay to show success message
        } catch (err) {
            setError(err.message || 'Failed to submit requirements.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center relative overflow-hidden py-20">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-2xl p-8 md:p-12 glass border border-white/10 rounded-[2.5rem] shadow-2xl animate-fade-in-up">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                        AI Matchmaker
                    </div>
                    <h2 className="text-4xl font-outfit font-black tracking-tight mb-3">Find Your Dream Car</h2>
                    <p className="text-slate-400">Tell us what you are looking for, and let our algorithms do the rest.</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-shake">
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3 animate-fade-in">
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1">Budget (USD)</label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                placeholder="20,000"
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-5 py-4 focus:border-blue-500/50 outline-none transition-all focus:ring-4 focus:ring-blue-500/5 text-white placeholder-slate-600"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1">Usage Type</label>
                            <div className="relative">
                                <select
                                    name="usageType"
                                    value={formData.usageType}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 focus:border-blue-500/50 outline-none transition-all appearance-none text-white cursor-pointer"
                                >
                                    <option value="" disabled className="bg-slate-900 text-slate-500">Select Usage</option>
                                    <option value="City" className="bg-slate-900">City Commute</option>
                                    <option value="Family" className="bg-slate-900">Family Use</option>
                                    <option value="Long Drive" className="bg-slate-900">Long Drives / Highway</option>
                                    <option value="Business" className="bg-slate-900">Business / Executive</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1">Mileage Importance</label>
                            <div className="relative">
                                <select
                                    name="mileageImportance"
                                    value={formData.mileageImportance}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 focus:border-blue-500/50 outline-none transition-all appearance-none text-white cursor-pointer"
                                >
                                    <option value="" disabled className="bg-slate-900 text-slate-500">Select Preference</option>
                                    <option value="Low" className="bg-slate-900">Low - Not a priority</option>
                                    <option value="Medium" className="bg-slate-900">Medium - Important</option>
                                    <option value="High" className="bg-slate-900">High - Critical Priority</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1">Maintenance Preference</label>
                        <div className="relative">
                            <select
                                name="maintenancePreference"
                                value={formData.maintenancePreference}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 focus:border-blue-500/50 outline-none transition-all appearance-none text-white cursor-pointer"
                            >
                                <option value="" disabled className="bg-slate-900 text-slate-500">Select Preference</option>
                                <option value="Low" className="bg-slate-900">Low Maintenance Only</option>
                                <option value="Medium" className="bg-slate-900">Medium allows flexibility</option>
                                <option value="Any" className="bg-slate-900">Any - I verify condition</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-5 bg-white text-slate-950 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl shadow-white/5 active:scale-95 flex items-center justify-center gap-3 cursor-pointer mt-4" disabled={loading}>
                        {loading ? (
                            <span>Processing...</span>
                        ) : (
                            <>
                                Get AI Recommendation
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RequirementForm;
