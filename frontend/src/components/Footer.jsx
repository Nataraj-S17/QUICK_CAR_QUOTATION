import React from 'react';

const Footer = () => {
    return (
        <footer className="py-20 border-t border-white/5 text-center bg-[#020617] text-white">
            <div className="container mx-auto px-6 space-y-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center transform rotate-12">
                            <span className="text-white font-black text-2xl -rotate-12">A</span>
                        </div>
                        <span className="text-3xl font-outfit font-black tracking-tighter text-white">
                            AUTO<span className="gradient-text">QUOTE</span>
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                        Revolutionizing the automotive experience with Google Gemini AI. Premium vehicles, real-time insights, ultimate transparency.
                    </p>
                </div>

                <div className="flex justify-center gap-10 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
                    <a href="#" className="hover:text-blue-400 transition-colors">Global Network</a>
                </div>

                <p className="text-slate-600 text-xs pt-10 border-t border-white/5">© 2025 AutoQuote AI Technologies Ltd. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
