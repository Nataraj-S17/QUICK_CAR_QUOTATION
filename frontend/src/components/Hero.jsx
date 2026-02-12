import React from 'react';

const Hero = () => {
    return (
        <section className="relative min-h-[95vh] flex items-center overflow-hidden pt-28 pb-12">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-2/3 h-full opacity-30 blur-[150px] bg-gradient-to-b from-blue-600/20 via-purple-600/10 to-transparent -z-10 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-1/2 h-1/2 opacity-10 blur-[120px] bg-blue-400/30 -z-10 pointer-events-none"></div>

            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-10 animate-fade-in-up">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass border border-white/10 text-[10px] font-bold tracking-[0.3em] text-blue-400 uppercase">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Next-Gen Automotive Hub
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-9xl font-outfit font-black leading-[0.85] tracking-tighter">
                                ELEVATE <br />
                                YOUR <span className="gradient-text">DRIVE.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-light max-w-xl">
                                The world's first AI-integrated car marketplace. Discover high-performance vehicles matched with real-time valuation intelligence.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-5 pt-4">
                            <button
                                onClick={() => document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })}
                                className="group px-10 py-5 bg-white text-slate-950 rounded-3xl font-bold text-lg hover:scale-[1.05] transition-all shadow-2xl shadow-white/5 active:scale-95 flex items-center gap-3 cursor-pointer"
                            >
                                Browse Fleet
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                            <button className="px-10 py-5 glass rounded-3xl font-bold text-lg border border-white/10 hover:bg-white/5 transition-all hover:border-white/20 active:scale-95 cursor-pointer">
                                Our Tech
                            </button>
                        </div>

                        <div className="flex items-center gap-12 pt-16 border-t border-white/5">
                            <div className="space-y-1">
                                <div className="text-4xl font-black font-outfit text-white">4.9<span className="text-blue-500">/5</span></div>
                                <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Client Rating</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-4xl font-black font-outfit text-white">2.4<span className="text-purple-500">k</span></div>
                                <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Vehicles Sold</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-4xl font-black font-outfit text-white">100<span className="text-emerald-500">%</span></div>
                                <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">AI Accuracy</div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative group perspective-1000">
                        <div className="relative z-10 transform transition-all duration-700 hover:rotate-y-12 hover:scale-[1.02]">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <img
                                src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200"
                                alt="High Performance Vehicle"
                                className="relative rounded-[3rem] shadow-2xl border border-white/10 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                            />
                        </div>

                        {/* Interactive Data Floating Card */}
                        <div className="absolute -bottom-8 -right-8 glass p-8 rounded-[2rem] border border-white/10 shadow-2xl animate-bounce-slow hidden md:block backdrop-blur-2xl">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Market Demand</div>
                                        <div className="text-2xl font-black text-white">+12.4% <span className="text-blue-400 text-xs font-medium">this week</span></div>
                                    </div>
                                </div>
                                <div className="h-px w-full bg-white/5"></div>
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                                        +12
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
