import React, { useState } from 'react';
import { getCarQuotation } from '../services/geminiService';

const QuotationModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: '2022',
        mileage: '',
        condition: 'Excellent'
    });

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = await getCarQuotation(formData);
            setResult(data);
            setStep(3);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 text-white">
            <div
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-fade-in"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-lg glass border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in bg-[#1e293b]">
                {/* Animated Accent Bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 overflow-hidden">
                    {loading && <div className="h-full w-1/3 bg-white/50 animate-[shimmer_1.5s_infinite]"></div>}
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all border border-white/5 active:scale-90 cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-8 md:p-10">
                    {step === 1 && (
                        <div className="space-y-8 animate-slide-up">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-[0.2em] uppercase">
                                    Step 01 / Basic Info
                                </div>
                                <h2 className="text-3xl font-outfit font-black tracking-tight">Vehicle Identity</h2>
                                <p className="text-slate-400 text-sm leading-relaxed">Tell us what you're driving to start the AI analysis.</p>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-5">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            required
                                            name="make"
                                            value={formData.make}
                                            onChange={handleInputChange}
                                            placeholder="Vehicle Make (e.g. BMW)"
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-blue-500/50 outline-none transition-all focus:ring-4 focus:ring-blue-500/5"
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            required
                                            name="model"
                                            value={formData.model}
                                            onChange={handleInputChange}
                                            placeholder="Vehicle Model (e.g. M4)"
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-blue-500/50 outline-none transition-all focus:ring-4 focus:ring-blue-500/5"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="group w-full py-4 bg-white text-slate-950 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-xl shadow-white/5 cursor-pointer"
                                >
                                    Continue
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-slide-up">
                            <div className="flex items-center gap-4 mb-4">
                                <button onClick={() => setStep(1)} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Step 02 / Diagnostics</div>
                                    <h2 className="text-xl font-outfit font-bold">Market Condition</h2>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1">Year</label>
                                        <select
                                            name="year"
                                            value={formData.year}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 py-3.5 focus:border-blue-500/50 outline-none transition-all appearance-none cursor-pointer text-white"
                                        >
                                            {[...Array(30)].map((_, i) => (
                                                <option key={2025 - i} value={2025 - i} className="bg-slate-900">{2025 - i}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1">Mileage</label>
                                        <input
                                            required
                                            type="number"
                                            name="mileage"
                                            value={formData.mileage}
                                            onChange={handleInputChange}
                                            placeholder="Total Miles"
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 py-3.5 focus:border-blue-500/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1">Physical Condition</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Excellent', 'Good', 'Fair'].map((cond) => (
                                            <button
                                                key={cond}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, condition: cond }))}
                                                className={`py-3.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${formData.condition === cond
                                                        ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-900/40 text-white'
                                                        : 'bg-white/5 border-white/10 hover:border-white/20 text-slate-400'
                                                    }`}
                                            >
                                                {cond}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="relative overflow-hidden w-full py-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span className="animate-pulse">Scanning Global Market...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.355r.01-.011c3.43-3.3 6.046-6.494 6.046-9.155a6.05 6.05 0 10-12.09 0c0 2.66 2.616 5.854 6.046 9.155z" />
                                            </svg>
                                            Generate AI Valuation
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 3 && result && (
                        <div className="space-y-6 animate-fade-in text-center">
                            <div className="space-y-2">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
                                    <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-outfit font-black tracking-tight">Valuation Finalized</h2>
                                <p className="text-slate-400 text-xs">For your {formData.year} {formData.make} {formData.model}</p>
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-0 bg-blue-500/20 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative bg-slate-900/80 rounded-[2rem] p-8 border border-white/10">
                                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-2">Estimated Real-World Value</div>
                                    <div className="text-4xl md:text-5xl font-black font-outfit tracking-tighter text-white">
                                        {result.estimatedPrice.split(' ')[0]} <span className="text-blue-500">{result.estimatedPrice.split(' ').slice(1).join(' ')}</span>
                                    </div>

                                    <div className="mt-6 flex flex-col items-center gap-2">
                                        <div className="flex justify-between w-full max-w-[200px] mb-1">
                                            <span className="text-[10px] font-bold text-slate-500">CONFIDENCE INDEX</span>
                                            <span className="text-[10px] font-bold text-emerald-400">{result.marketConfidence}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden max-w-[200px]">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-1000 ease-out"
                                                style={{ width: `${result.marketConfidence}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 text-left">
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">AI Market Insights</div>
                                <div className="grid gap-3">
                                    {result.factors.map((f, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                                                <span className="text-[10px] font-bold text-blue-400">{i + 1}</span>
                                            </div>
                                            <p className="text-sm text-slate-300 font-medium">{f}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex gap-4 items-center text-left">
                                <svg className="w-5 h-5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-indigo-200/80 leading-relaxed italic">"{result.suggestedAction}"</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <button
                                    onClick={() => setStep(1)}
                                    className="py-4 glass rounded-2xl font-bold hover:bg-white/5 transition-all text-sm active:scale-95 cursor-pointer"
                                >
                                    Recalculate
                                </button>
                                <button
                                    className="py-4 bg-white text-slate-950 rounded-2xl font-bold hover:scale-[1.05] transition-all text-sm active:scale-95 shadow-xl shadow-white/5 cursor-pointer"
                                >
                                    Apply to Sell
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-shake">
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuotationModal;
