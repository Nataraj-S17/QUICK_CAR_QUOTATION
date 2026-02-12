import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import requirementService from '../services/requirementService';

const RecommendationResult = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                if (!id) {
                    setError('Invalid Recommendation Request.');
                    setLoading(false);
                    return;
                }

                // Call API (Now calls /api/ai/generate-quotation)
                const data = await requirementService.getRecommendation(id);
                // API returns { success: true, data: { quotation: { ... } } }
                // requirementService returns response.data
                // So result should be data.data (the quotation object)
                setResult(data.data);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to generate recommendation.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendation();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#2563eb10_0%,_transparent_50%)] animate-pulse"></div>
                <div className="text-center space-y-4 relative z-10">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <h2 className="text-2xl font-bold animate-fade-in">AI is calculating market value...</h2>
                    <p className="text-slate-400">Applying depreciation, mileage, and demand factors</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <div className="text-center space-y-4 max-w-md p-8 glass rounded-2xl border border-red-500/20">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold">Calculation Failed</h2>
                    <p className="text-slate-400">{error}</p>
                    <button
                        onClick={() => navigate('/requirements')}
                        className="px-6 py-3 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-200 transition-all mt-4"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!result) return null;

    // Destructure from the quotation object
    // Structure: { car, score, explanation, pricing: { final_price, breakdown: { base_price, depreciation_percent, ... } } }
    const { car, score, explanation, pricing } = result;

    if (!car || !pricing || !pricing.breakdown) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-500">Data Error</h2>
                    <p className="text-slate-400">Received incomplete data from server.</p>
                    <pre className="text-left bg-black/50 p-4 mt-4 rounded text-xs text-green-400 overflow-auto max-w-lg">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white py-20 px-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-start">

                {/* Left: Car Presentation and AI Explanation (7 Cols) */}
                <div className="lg:col-span-7 space-y-8 animate-fade-in-left">
                    <div className="relative group">
                        <div className="aspect-[16/9] bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
                            {car.image ? (
                                <img src={car.image} alt={car.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
                                    <span className="text-slate-600 font-black text-6xl opacity-20 uppercase tracking-widest">{car.brand}</span>
                                </div>
                            )}

                            {/* Score Badge */}
                            <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center shadow-lg">
                                <div className="text-[10px] uppercase font-bold tracking-widest text-blue-300 mb-1">AI Match</div>
                                <div className="text-4xl font-black bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    {score}%
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-2">Top Recommendation</h3>
                        <h1 className="text-5xl md:text-6xl font-black font-outfit leading-tight mb-2">
                            {car.brand} <span className="text-slate-500 font-thin">|</span> {car.model}
                        </h1>
                        <div className="flex gap-4 text-slate-400 mt-4">
                            <span className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">{car.year} Model</span>
                            <span className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">{car.fuel_type || 'Petrol'}</span>
                        </div>
                    </div>

                    {/* AI Explanation Card */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold font-outfit text-blue-200">AI Analysis</h2>
                        </div>
                        <p className="text-lg leading-relaxed text-slate-300 font-light italic">
                            "{explanation}"
                        </p>
                    </div>
                </div>

                {/* Right: Price Breakdown (5 Cols) */}
                <div className="lg:col-span-5 space-y-6 animate-fade-in-right delay-200">

                    {/* Final Price Card */}
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-900/20 to-slate-900/50 border border-emerald-500/20 backdrop-blur-md shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] -mr-16 -mt-16"></div>

                        <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">AI Calculated Price</div>
                        <div className="text-5xl font-black text-emerald-400 mb-6">
                            ₹{(pricing.final_price / 100000).toFixed(2)} Lakh
                        </div>

                        <div className="space-y-4 pt-6 border-t border-white/10">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Base Market Price</span>
                                <span className="font-mono text-slate-200">₹{(pricing.breakdown.base_price / 100000).toFixed(2)} L</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-red-400">Age Depreciation ({(pricing.breakdown.depreciation_percent * 100).toFixed(0)}%)</span>
                                <span className="font-mono text-red-400">- ₹{((pricing.breakdown.base_price * pricing.breakdown.depreciation_percent) / 100000).toFixed(2)} L</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-orange-400">Mileage Adjustment ({pricing.breakdown.mileage_factor}x)</span>
                                <span className="font-mono text-orange-400">
                                    {pricing.breakdown.mileage_factor < 1 ? '-' : ''}
                                    {((1 - pricing.breakdown.mileage_factor) * 100).toFixed(0)}%
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-blue-400">AI Demand Premium ({pricing.breakdown.demand_factor}x)</span>
                                <span className="font-mono text-blue-400">
                                    +{((pricing.breakdown.demand_factor - 1) * 100).toFixed(0)}%
                                </span>
                            </div>
                        </div>

                        <button className="w-full mt-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/20">
                            Book Test Drive
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg">
                            Download Quote
                        </button>
                        <button
                            onClick={() => navigate('/requirements')}
                            className="py-4 bg-white/5 text-white rounded-xl font-bold border border-white/10 hover:bg-white/10 transition-all"
                        >
                            New Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendationResult;
