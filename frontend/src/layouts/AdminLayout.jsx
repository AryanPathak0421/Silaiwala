import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Scissors,
    Truck,
    Settings,
    LogOut,
    Bell,
    BarChart3,
    Layers,
    Store,
    Wallet,
    Megaphone,
    Menu,
    X
} from 'lucide-react';

import silaiwalaLogo from '../assets/silaiwala-logo.png';
import useAuthStore from '../store/authStore';

const AdminLayout = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
        { icon: <ShoppingBag size={20} />, label: 'Orders', path: '/admin/orders' },
        { icon: <Scissors size={20} />, label: 'Tailors', path: '/admin/tailors' },
        { icon: <Truck size={20} />, label: 'Delivery', path: '/admin/delivery' },
        { icon: <Users size={20} />, label: 'Customers', path: '/admin/customers' },
        { icon: <Layers size={20} />, label: 'Services', path: '/admin/services' },
        { icon: <Store size={20} />, label: 'Store', path: '/admin/store' },
        { icon: <Wallet size={20} />, label: 'Finance', path: '/admin/finance' },
        { icon: <Megaphone size={20} />, label: 'CMS', path: '/admin/cms' },
        { icon: <BarChart3 size={20} />, label: 'Reports', path: '/admin/reports' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
    ];

    const currentPath = location.pathname;
    // Helper to check if a menu item is active (handling exact for dashboard, and prefix for others)
    const isActive = (path) => {
        if (path === '/admin') return currentPath === '/admin';
        return currentPath.startsWith(path);
    };

    return (
        <div className="flex h-screen bg-gray-50 uppercase-none relative overflow-hidden">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-[#0a211e] text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h1 className="text-xl font-black tracking-tighter flex items-center gap-3">
                        <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-lg border border-white/10 overflow-hidden shrink-0">
                            <img src={silaiwalaLogo} alt="Silaiwala" className="w-full h-full object-contain" />
                        </div>
                        <span className="tracking-widest opacity-80 uppercase text-xs font-bold">Admin Panel</span>
                    </h1>
                    <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive(item.path)
                                ? 'bg-[#1e3932] text-white shadow-md translate-x-1'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className={`${isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-white'} transition-colors`}>
                                {item.icon}
                            </span>
                            <span className="font-semibold text-sm">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5 bg-[#081816]">
                    <button 
                        onClick={() => {
                            useAuthStore.getState().logout();
                            window.location.href = '/admin/login';
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-400 transition-all rounded-lg hover:bg-red-400/5">
                        <LogOut size={20} />
                        <span className="font-bold text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen w-full">
                {/* Header */}
                <header className="h-20 bg-white border-b flex items-center justify-between px-4 lg:px-10 shadow-sm relative z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight hidden sm:block">
                                {menuItems.find(i => isActive(i.path))?.label || 'Admin Control'}
                            </h2>
                            <p className="text-[10px] lg:text-xs text-gray-400 font-medium hidden sm:block">Manage your marketplace operations</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">
                        <div className="hidden sm:flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">System Live</span>
                        </div>
                        <button className="relative p-2.5 text-gray-400 hover:text-[#1e3932] hover:bg-gray-50 rounded-full transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 lg:gap-4 pl-3 lg:pl-6 border-l border-gray-100">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-bold text-gray-900 leading-none">Super Admin</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">Full Access</p>
                            </div>
                            <div className="h-10 w-10 lg:h-11 lg:w-11 rounded-xl bg-gradient-to-br from-[#1e3932] to-[#0a211e] flex items-center justify-center text-white font-bold shadow-lg shadow-green-900/10 shrink-0">
                                SA
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar">
                    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
