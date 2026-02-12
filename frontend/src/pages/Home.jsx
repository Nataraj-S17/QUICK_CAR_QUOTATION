import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import CarCard from '../components/CarCard';
import { FEATURED_CARS } from '../constants';
import QuotationModal from '../components/QuotationModal';

const Home = () => {
    const navigate = useNavigate();
    const [isQuotationOpen, setIsQuotationOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden">
            {/* Immersive Dynamic Particles Background */}
            <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[160px] animate-[pulse_8s_infinite]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[160px] animate-[pulse_10s_infinite_reverse]"></div>
                <div className="absolute top-[30%] left-[20%] w-[1px] h-[1px] bg-white shadow-[0_0_80px_40px_rgba(255,255,255,0.03)] rounded-full"></div>
            </div>

            <Hero />

            {/* Featured Inventory Section */}
            <section id="inventory" className="py-32 container mx-auto px-6 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"></div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-white/5 text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase">
                            Collection
                        </div>
                        <h2 className="text-5xl md:text-7xl font-outfit font-black tracking-tighter">
                            ELITE <span className="gradient-text">INV-NTORY</span>
                        </h2>
                        <p className="text-slate-500 max-w-xl text-lg leading-relaxed">
                            Hand-picked masterpieces of engineering. Every vehicle undergoes a 200-point AI-driven diagnostic inspection before being listed.
                        </p>
                    </div>

                    <button className="group relative px-8 py-4 glass border border-white/10 rounded-2xl text-sm font-bold flex items-center gap-3 hover:border-blue-500/30 transition-all active:scale-95 cursor-pointer">
                        Explore Full Catalog
                        <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {FEATURED_CARS.map((car, idx) => (
                        <div key={car.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                            <CarCard car={car} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Dynamic AI Value Statement - Selling Part */}
            <section id="sell" className="py-32 px-6">
                <div className="container mx-auto">
                    <div className="relative glass border border-white/10 rounded-[3.5rem] p-12 md:p-24 overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px]"></div>

                        <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <h2 className="text-5xl md:text-8xl font-outfit font-black leading-[0.9] tracking-tighter">
                                        SELL WITH <br />
                                        <span className="gradient-text">INTELLIGENCE.</span>
                                    </h2>
                                    <p className="text-xl text-slate-400 font-light leading-relaxed">
                                        Don't guess your car's value. Our Gemini-powered engine tracks 45+ real-time market signals to give you a definitive price in seconds.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-5">
                                    <button
                                        onClick={() => setIsQuotationOpen(true)}
                                        className="px-10 py-5 bg-blue-600 text-white rounded-3xl font-bold text-lg hover:bg-blue-700 hover:scale-[1.05] transition-all shadow-2xl shadow-blue-900/40 active:scale-95 cursor-pointer"
                                    >
                                        Sell Your Car
                                    </button>
                                    <button className="px-10 py-5 glass border border-white/10 rounded-3xl font-bold text-lg hover:bg-white/5 transition-all active:scale-95 cursor-pointer">
                                        How it works
                                    </button>
                                </div>
                            </div>

                            <div className="relative flex justify-center lg:justify-end">
                                <div className="w-full max-w-md p-10 glass border border-white/10 rounded-[3rem] rotate-2 group-hover:rotate-0 transition-transform duration-700">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <div className="h-2 w-24 bg-blue-500/40 rounded-full"></div>
                                                <div className="h-8 w-48 bg-white/5 rounded-2xl animate-pulse"></div>
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-2 w-full bg-white/5 rounded-full"></div>
                                            <div className="h-2 w-full bg-white/5 rounded-full"></div>
                                            <div className="h-2 w-2/3 bg-white/5 rounded-full"></div>
                                        </div>
                                        <div className="pt-8 flex justify-between items-center">
                                            <div className="h-14 w-32 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white text-sm">PROCESSED</div>
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-slate-900"></div>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA for Requirements (Buying) */}
            <section className="py-20 px-6 bg-gradient-to-b from-transparent to-blue-900/10">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-outfit font-bold mb-6">Looking for something specific?</h2>
                    <p className="text-slate-400 mb-10 max-w-2xl mx-auto">Tell us your budget and preferences, and our AI will find the perfect match for you.</p>
                    <button
                        onClick={() => navigate('/requirements')}
                        className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-colors cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
                    >
                        Find Your Dream Car
                    </button>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-32 px-6 relative">
                <div className="container mx-auto">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-[0.2em] uppercase">
                                About Us
                            </div>
                            <h2 className="text-5xl md:text-7xl font-outfit font-black tracking-tighter">
                                SIVA <span className="gradient-text">AUTO CONSULTANCY</span>
                            </h2>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="relative">
                                <div className="absolute -top-8 -left-8 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px]"></div>
                                <div className="relative glass border border-white/10 rounded-[2.5rem] p-10 space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0">
                                            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold text-white">Our Location</h3>
                                            <p className="text-slate-300 leading-relaxed">
                                                #30A, MSV Nagar<br />
                                                Karayanchavadi, Poonamallee<br />
                                                Chennai - 600 056
                                            </p>
                                        </div>
                                    </div>

                                    <div className="h-px bg-white/10"></div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center shrink-0">
                                            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold text-white">Contact</h3>
                                            <p className="text-slate-300">+91 98842 86464</p>
                                            <p className="text-slate-400 text-sm">shivakumarsanjay1977@gmail.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <p className="text-xl text-slate-300 leading-relaxed">
                                    At <span className="text-white font-bold">Siva Auto Consultancy</span>, we revolutionize car buying and selling through cutting-edge AI technology and deep market expertise.
                                </p>
                                <p className="text-slate-400 leading-relaxed">
                                    Founded and led by <span className="text-white font-bold">R. Siva Kumar</span>, our consultancy combines traditional automotive knowledge with next-generation valuation algorithms to deliver transparent, accurate pricing in seconds.
                                </p>
                                <div className="grid grid-cols-2 gap-6 pt-6">
                                    <div className="space-y-2">
                                        <div className="text-3xl font-black text-blue-400">500+</div>
                                        <div className="text-sm text-slate-500 uppercase tracking-wider font-bold">Cars Valued</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-3xl font-black text-emerald-400">98%</div>
                                        <div className="text-sm text-slate-500 uppercase tracking-wider font-bold">Satisfaction</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <QuotationModal
                isOpen={isQuotationOpen}
                onClose={() => setIsQuotationOpen(false)}
            />
        </div>
    );
};

export default Home;
