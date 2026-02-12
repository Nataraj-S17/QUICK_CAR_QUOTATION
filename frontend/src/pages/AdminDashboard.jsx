import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const stats = [
        { title: 'Total Customers', value: '1,248', change: '+12%', icon: '👥', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Active Quotations', value: '43', change: '+5%', icon: '📄', color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { title: 'Cars Available', value: '18', change: '-2', icon: '🚗', color: 'text-pink-500', bg: 'bg-pink-500/10' },
        { title: 'Revenue (MTD)', value: '$52,450', change: '+18%', icon: '💰', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 flex overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 glass border-r border-white/5 flex flex-col z-20">
                <div className="p-6 border-b border-white/5">
                    <h2 className="text-2xl font-outfit font-black tracking-tighter text-white">
                        ADMIN<span className="text-blue-500">PANEL</span>
                    </h2>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {['Dashboard', 'Cars', 'Quotations', 'Settings'].map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveTab(item.toLowerCase())}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.toLowerCase()
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span>
                                {item === 'Dashboard' ? '📊' : item === 'Cars' ? '🚗' : item === 'Quotations' ? '📝' : '⚙️'}
                            </span>
                            {item}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5 bg-slate-900/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                            AD
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{adminUser.email || 'Admin'}</p>
                            <p className="text-xs text-slate-500">Super Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full py-2 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px]"></div>
                </div>

                {/* Header */}
                <header className="sticky top-0 z-10 glass border-b border-white/5 py-4 px-8 flex items-center justify-between backdrop-blur-md">
                    <h1 className="text-xl font-bold capitalize text-white">{activeTab} Overview</h1>
                    <div className="flex items-center gap-4">
                        <button className="relative w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer">
                            🔔
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020617]"></span>
                        </button>
                    </div>
                </header>

                <div className="p-8 space-y-8">
                    {/* Welcome Section */}
                    <div className="animate-fade-in-up">
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome back, Admin 👋</h2>
                        <p className="text-slate-400">Here's what's happening with your platform today.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        {stats.map((stat, index) => (
                            <div key={index} className="glass p-6 rounded-[1.5rem] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center text-lg`}>
                                        {stat.icon}
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {stat.change}
                                    </span>
                                </div>
                                <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                            </div>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="grid lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        {/* Recent Activities */}
                        <div className="lg:col-span-2 glass rounded-[1.5rem] border border-white/5 p-6 min-h-[400px]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-white">Recent Activities</h3>
                                <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">View All</button>
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                                                👤
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">New User Registration</p>
                                                <p className="text-xs text-slate-500">2 minutes ago</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            Completed
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="glass rounded-[1.5rem] border border-white/5 p-6 h-fit">
                            <h3 className="font-bold text-white mb-6">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-white font-bold text-sm shadow-lg shadow-blue-900/20 active:scale-95 cursor-pointer group">
                                    Add New Car
                                    <span className="text-lg group-hover:rotate-90 transition-transform">➕</span>
                                </button>
                                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-300 font-bold text-sm border border-white/5 active:scale-95 cursor-pointer">
                                    Review Quotations
                                    <span>📄</span>
                                </button>
                                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-300 font-bold text-sm border border-white/5 active:scale-95 cursor-pointer">
                                    Manage Users
                                    <span>👥</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
