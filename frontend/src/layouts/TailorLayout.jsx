import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardList,
    ShoppingBag,
    Truck,
    FileCheck,
    CreditCard,
    UserCircle
} from 'lucide-react';
import AppContainer from '../components/Common/AppContainer';
import { useTailorAuth } from '../modules/tailor/context/AuthContext';

const TailorLayout = () => {
    const location = useLocation();
    const { user, status } = useTailorAuth();
    const isOverview = location.pathname === '/tailor';

    const menuItems = [
        { icon: <LayoutDashboard size={18} />, label: 'Overview', path: '/tailor' },
        { icon: <ClipboardList size={18} />, label: 'Requests', path: '/tailor/orders' },
        { icon: <ShoppingBag size={18} />, label: 'Products', path: '/tailor/products' },
        { icon: <Truck size={18} />, label: 'Delivery', path: '/tailor/delivery' },
        { icon: <FileCheck size={18} />, label: 'Verification', path: '/tailor/verification' },
        { icon: <CreditCard size={18} />, label: 'Subscription', path: '/tailor/subscription' },
        { icon: <UserCircle size={18} />, label: 'Settings', path: '/tailor/settings' },
    ];

    return (
        <AppContainer>
            {/* Top Navbar - Hide on Overview and Settings so they can have custom headers */}
            {(!isOverview && location.pathname !== '/tailor/settings') && (
                <div className="relative sticky top-0 z-10 w-full mb-4">
                    <header className="bg-[#1e3932] pt-6 pb-4 px-6 flex items-center justify-between text-white transition-all shadow-[0_4px_20px_rgb(0,0,0,0.1)]">
                        <div>
                            <h2 className="text-xl font-black tracking-tight drop-shadow-sm">
                                {menuItems.find(i => i.path === location.pathname)?.label || 'TailorHub'}
                            </h2>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`h-1.5 w-1.5 rounded-full ${status === 'APPROVED' ? 'bg-green-400' : 'bg-orange-400'}`}></span>
                                <span className="text-[10px] font-bold uppercase text-green-100/70 tracking-widest">{status}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-[1rem] bg-white/10 flex items-center justify-center text-white font-black backdrop-blur-md border border-white/10 shadow-inner">
                                {user?.name?.charAt(0) || 'R'}
                            </div>
                        </div>
                    </header>
                    {/* SVG Wave Curve matching the aesthetic */}
                    <svg className="w-full h-8 text-[#1e3932] fill-current absolute top-full left-0 z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0,0 C30,20 70,20 100,0 L100,0 L0,0 Z" />
                    </svg>
                </div>
            )}

            {/* Main Content Area */}
            <main className={`flex-1 overflow-y-auto bg-gray-50 custom-scrollbar pb-24 ${(isOverview || location.pathname === '/tailor/settings') ? '' : 'p-6'}`}>
                <Outlet />
            </main>

            {/* Bottom Navigation for App-View */}
            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[450px] bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] rounded-t-[1.75rem]">
                {menuItems.slice(0, 4).map((item) => {
                    // Injecting a slightly larger size if needed, but styling padding makes it larger
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center gap-1 group transition-all ${isActive ? 'text-[#1e3932]' : 'text-gray-300'}`}
                        >
                            <div className={`p-3 rounded-[1.25rem] transition-all flex items-center justify-center ${isActive ? 'bg-green-50 shadow-inner' : 'group-hover:bg-gray-50'}`}>
                                {React.cloneElement(item.icon, { size: 22 })}
                            </div>
                        </Link>
                    )
                })}
                {/* Profile Link as the last item */}
                <Link
                    to="/tailor/settings"
                    className={`flex flex-col items-center gap-1 group transition-all ${location.pathname === '/tailor/settings' ? 'text-[#1e3932]' : 'text-gray-300'}`}
                >
                    <div className={`p-3 rounded-[1.25rem] transition-all flex items-center justify-center ${location.pathname === '/tailor/settings' ? 'bg-green-50 shadow-inner' : 'group-hover:bg-gray-50'}`}>
                        <UserCircle size={22} />
                    </div>
                </Link>
            </nav>
        </AppContainer>
    );
};

export default TailorLayout;
