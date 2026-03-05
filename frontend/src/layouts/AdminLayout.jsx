import React from 'react';
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
    Layers
} from 'lucide-react';

const AdminLayout = () => {
    const location = useLocation();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
        { icon: <ShoppingBag size={20} />, label: 'Orders', path: '/admin/orders' },
        { icon: <Scissors size={20} />, label: 'Tailors', path: '/admin/tailors' },
        { icon: <Truck size={20} />, label: 'Delivery', path: '/admin/delivery' },
        { icon: <Users size={20} />, label: 'Customers', path: '/admin/customers' },
        { icon: <Layers size={20} />, label: 'Services', path: '/admin/services' },
        { icon: <BarChart3 size={20} />, label: 'Reports', path: '/admin/reports' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 uppercase-none">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0a211e] text-white flex flex-col shadow-2xl">
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                        <span className="bg-[#1e3932] text-white px-2 py-0.5 rounded shadow-lg border border-white/10">TH</span>
                        ADMIN
                    </h1>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${location.pathname === item.path
                                    ? 'bg-[#1e3932] text-white shadow-md translate-x-1'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className={`${location.pathname === item.path ? 'text-white' : 'text-gray-500 group-hover:text-white'} transition-colors`}>
                                {item.icon}
                            </span>
                            <span className="font-semibold text-sm">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5 bg-[#081816]">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-400 transition-all rounded-lg hover:bg-red-400/5">
                        <LogOut size={20} />
                        <span className="font-bold text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b flex items-center justify-between px-10 shadow-sm relative z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {menuItems.find(i => i.path === location.pathname)?.label || 'Admin Control'}
                        </h2>
                        <p className="text-xs text-gray-400 font-medium">Manage your marketplace operations</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">System Live</span>
                        </div>
                        <button className="relative p-2.5 text-gray-400 hover:text-[#1e3932] hover:bg-gray-50 rounded-full transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900 leading-none">Super Admin</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">Full Access</p>
                            </div>
                            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#1e3932] to-[#0a211e] flex items-center justify-center text-white font-bold shadow-lg shadow-green-900/10">
                                SA
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-10 bg-[#fbfcfb]">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
