import React from 'react';
import { ShoppingBag, Clock, Wallet, ChevronRight, Zap, Bell, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTailorAuth } from '../context/AuthContext';

const Overview = () => {
    const { user } = useTailorAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-full bg-gray-50 flex flex-col relative animate-in fade-in duration-500">
            {/* Gradient Header */}
            <div className="bg-gradient-to-b from-[#1e3932] to-[#2a4f45] px-5 pt-8 pb-16 rounded-b-[2rem] relative shrink-0">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate('/tailor/settings')} className="text-white flex flex-col justify-center">
                        <p className="text-xs font-bold text-green-100 uppercase tracking-widest flex items-center gap-2">
                            <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgb(74,222,128)]"></span>
                            Online Mode
                        </p>
                    </button>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/tailor/notifications')} className="text-white hover:text-green-100 relative p-2">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-[#1e3932]"></span>
                        </button>
                        <button onClick={() => navigate('/tailor/settings')} className="h-10 w-10 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl flex items-center justify-center text-white font-black backdrop-blur-sm border border-white/10 shadow-inner">
                            {user?.name?.charAt(0) || 'R'}
                        </button>
                    </div>
                </div>
                <h1 className="text-2xl font-black text-white leading-tight tracking-tight px-1">
                    Hi {user?.name?.split(' ')[0] || 'Royal'},<br />
                    <span className="text-green-100/90 font-medium text-lg">here is your summary</span>
                </h1>
            </div>

            {/* Main Overlapping Card */}
            <div className="px-5 -mt-10 relative z-10 shrink-0">
                <div className="bg-white rounded-[1.25rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-[#1e3932]/10 rounded-2xl flex items-center justify-center">
                                <Wallet size={18} className="text-[#1e3932]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Earnings</p>
                                <p className="text-xl font-black text-gray-900 tracking-tight">₹14,500</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/tailor/withdraw')}
                            className="bg-[#1e3932] text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-900/20 active:scale-95 transition-transform"
                        >
                            Withdraw
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
                        <button onClick={() => navigate('/tailor/orders')} className="flex gap-3 items-center text-left hover:bg-gray-50 p-2 -m-2 rounded-xl transition-colors">
                            <div className="relative h-12 w-12 rounded-full border-[4px] border-gray-50 flex items-center justify-center shrink-0">
                                <div className="absolute inset-0 rounded-full border-[4px] border-blue-500 border-t-transparent border-r-transparent -rotate-45"></div>
                                <span className="text-base font-black text-gray-900">48</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-lg inline-block mb-1">Total</p>
                                <p className="text-xs font-bold text-gray-500">Orders</p>
                            </div>
                        </button>
                        <button onClick={() => navigate('/tailor/orders')} className="flex gap-3 items-center text-left hover:bg-gray-50 p-2 -m-2 rounded-xl transition-colors">
                            <div className="relative h-12 w-12 rounded-full border-[4px] border-gray-50 flex items-center justify-center shrink-0">
                                <div className="absolute inset-0 rounded-full border-[4px] border-[#1e3932] border-t-transparent border-l-transparent rotate-12"></div>
                                <span className="text-base font-black text-gray-900">12</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[#1e3932] uppercase tracking-widest bg-[#1e3932]/10 px-2 py-1 rounded-lg inline-block mb-1">To Do</p>
                                <p className="text-xs font-bold text-gray-500">Pending</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrollable Content Below */}
            <div className="px-5 mt-3 pb-4 flex-1 flex flex-col gap-3">

                {/* Secondary Cards */}
                <div className="grid grid-cols-2 gap-3 shrink-0">
                    <button onClick={() => navigate('/tailor/orders')} className="bg-white rounded-[1.25rem] p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-50 relative overflow-hidden group text-left block w-full hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform duration-500">
                            <CheckCircle size={48} />
                        </div>
                        <div className="h-8 w-8 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-green-100">
                            <CheckCircle size={16} />
                        </div>
                        <p className="text-xl font-black text-gray-900">32</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Completed<br />This Week</p>
                    </button>

                    <button onClick={() => navigate('/tailor/delivery')} className="bg-white rounded-[1.25rem] p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-50 relative overflow-hidden group text-left block w-full hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform duration-500">
                            <Zap size={48} />
                        </div>
                        <div className="h-8 w-8 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-orange-100">
                            <Zap size={16} />
                        </div>
                        <p className="text-xl font-black text-gray-900">2.4h</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Avg. Delivery<br />Time</p>
                    </button>
                </div>

                {/* Recent Activity List */}
                <div className="shrink-0">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">Recent Activity</h3>
                        <button onClick={() => navigate('/tailor/orders')} className="text-[10px] font-black text-[#1e3932] uppercase tracking-widest hover:underline">See All</button>
                    </div>

                    <div className="space-y-3">
                        {[
                            { title: 'Suit Alteration', icon: <ShoppingBag size={14} />, color: 'bg-green-50 text-green-600', val: '₹450', time: '20 Feb', status: 'Delivered' },
                            { title: 'Kurta Stitching', icon: <ShoppingBag size={14} />, color: 'bg-blue-50 text-blue-600', val: '₹1200', time: 'Today', status: 'New' },
                            { title: 'Designer Blouse', icon: <ShoppingBag size={14} />, color: 'bg-[#1e3932]/10 text-[#1e3932]', val: '₹2500', time: '24 Feb', status: 'Active' },
                        ].map((item, i) => (
                            <button
                                key={i}
                                onClick={() => navigate('/tailor/orders', { state: { highlightOrderTitle: item.title, orderStatus: item.status } })}
                                className="w-full bg-white p-3 rounded-[1.25rem] flex items-center justify-between shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-50 hover:shadow-md transition-shadow group/item"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${item.color}`}>
                                        {item.icon}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-black text-gray-900">{item.title}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{item.time}</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                    <div>
                                        <p className="text-sm font-black text-gray-900">{item.val}</p>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{item.status}</p>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-300 group-hover/item:text-[#1e3932] group-hover/item:translate-x-1 transition-all" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Overview;
