import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    ShoppingBag,
    Users,
    Scissors,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    Truck,
    CreditCard
} from 'lucide-react';
import { overviewStats, recentOrders, topTailors, revenueData } from '../data/mockData';
import api from '../../../utils/api';

const AdminDashboard = () => {
    const [statsData, setStatsData] = useState({
        totalRevenue: `₹${overviewStats.totalRevenue}`,
        activeOrders: overviewStats.activeOrders,
        totalTailors: overviewStats.totalTailors,
        pendingPayouts: `₹${overviewStats.pendingPayouts}`,
    });
    const [liveOrders, setLiveOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/admin/dashboard');
                const { stats, recentOrders: apiRecentOrders } = response.data;
                const { totalRevenue, activeOrdersCount, totalTailors } = stats;
                
                setStatsData({
                    totalRevenue: `₹${totalRevenue.toLocaleString()}`,
                    activeOrders: activeOrdersCount,
                    totalTailors: totalTailors,
                    pendingPayouts: '₹0', 
                });

                if (apiRecentOrders && apiRecentOrders.length > 0) {
                    const formatted = apiRecentOrders.map(o => ({
                        id: o.orderId || o._id.substring(0, 8),
                        service: o.items?.[0]?.service?.title || o.items?.[0]?.product?.name || 'Custom Job',
                        customer: o.customer?.name || 'Customer',
                        tailor: o.tailor?.name || 'Unassigned',
                        amount: `₹${(o.totalAmount || 0).toLocaleString()}`,
                        status: o.status
                    }));
                    setLiveOrders(formatted);
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        { label: 'Total Revenue', value: statsData.totalRevenue, icon: <TrendingUp size={20} />, change: '+12.5%', positive: true },
        { label: 'Platform Orders', value: statsData.activeOrders, icon: <ShoppingBag size={20} />, change: '+8.2%', positive: true },
        { label: 'Total Tailors', value: statsData.totalTailors, icon: <Scissors size={20} />, change: '+2.4%', positive: true },
        { label: 'Pending Payouts', value: statsData.pendingPayouts, icon: <CreditCard size={20} />, change: '+4.1%', positive: true },
    ];

    const getStatusStyle = (status) => {
        if (!status) return 'bg-gray-100 text-gray-700 border-gray-200';
        const s = status.toLowerCase();
        if (s === 'delivered') return 'bg-green-100 text-green-700 border-green-200';
        if (s === 'pending') return 'bg-orange-100 text-orange-700 border-orange-200';
        if (s === 'cancelled' || s === 'failed-delivery') return 'bg-red-100 text-red-700 border-red-200';
        if (s.includes('progress') || s.includes('production') || s.includes('stitching')) return 'bg-blue-100 text-blue-700 border-blue-200';
        if (s.includes('ready')) return 'bg-purple-100 text-purple-700 border-purple-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

    return (
        <div className="space-y-6 lg:space-y-10">
            {/* Header section is in layout, just need page content here */}
            {isLoading && (
                 <div className="w-full h-1 bg-gray-100 overflow-hidden rounded-full absolute top-0 left-0 z-50">
                     <div className="h-full bg-[#1e3932] animate-pulse w-1/3 rounded-full"></div>
                 </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className="bg-white p-5 lg:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group overflow-hidden relative"
                    >
                        <div className="absolute -right-2 -top-2 h-16 w-16 bg-[#1e3932]/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="flex justify-between items-center relative z-10">
                            <div className="p-3 bg-gray-50 text-[#1e3932] rounded-xl group-hover:bg-[#1e3932] group-hover:text-white transition-colors">
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] lg:text-xs font-bold px-2 py-1 rounded-lg ${stat.positive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="mt-4 lg:mt-5 relative z-10">
                            <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{stat.label}</h3>
                            <p className="text-xl lg:text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">

                {/* Left Column (Wider) */}
                <div className="xl:col-span-2 space-y-6 lg:space-y-8">

                    {/* Revenue Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-5 lg:p-8 rounded-3xl border border-gray-100 shadow-sm"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg lg:text-xl font-black text-gray-900 tracking-tight">Revenue Overview</h3>
                                <p className="text-[10px] lg:text-xs text-gray-400 mt-1 font-medium">Weekly transaction volume across marketplace</p>
                            </div>
                            <select className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-600 outline-none">
                                <option>This Week</option>
                                <option>Last Week</option>
                                <option>This Month</option>
                            </select>
                        </div>

                        {/* Custom Bar Chart built with Tailwind */}
                        <div className="h-48 lg:h-64 flex items-end justify-between gap-2 lg:gap-4 mt-8 pb-4 border-b border-gray-50 relative">
                            {/* Grid lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-full border-b border-gray-50 flex items-end pb-1">
                                        <span className="text-[8px] lg:text-[10px] text-gray-300 font-bold -translate-y-2">{(maxRevenue - (maxRevenue / 3) * i).toFixed(0)}</span>
                                    </div>
                                ))}
                            </div>

                            {revenueData.map((data, idx) => (
                                <div key={idx} className="flex flex-col items-center flex-1 z-10 group">
                                    <div className="relative w-full max-w-[40px] flex justify-center flex-1 items-end">
                                        <div
                                            className="w-full bg-[#d4e9e2] rounded-t-lg group-hover:bg-[#1e3932] transition-colors relative"
                                            style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                                        >
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap transition-opacity">
                                                ₹{data.revenue}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 mt-3 uppercase">{data.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Orders Table */}
                    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                        <div className="p-5 lg:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-lg lg:text-xl font-black text-gray-900 tracking-tight">Recent Orders</h3>
                                <p className="text-[10px] lg:text-xs text-gray-400 mt-1 font-medium">Live marketplace activity</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 lg:p-2.5 text-gray-400 hover:text-[#1e3932] hover:bg-gray-50 rounded-xl transition-all border border-gray-100">
                                    <Search size={16} className="lg:w-[18px] lg:h-[18px]" />
                                </button>
                                <button className="p-2 lg:p-2.5 text-gray-400 hover:text-[#1e3932] hover:bg-gray-50 rounded-xl transition-all border border-gray-100">
                                    <Filter size={16} className="lg:w-[18px] lg:h-[18px]" />
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead>
                                    <tr className="bg-gray-50/50 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                                        <th className="px-5 lg:px-8 py-4">Order Details</th>
                                        <th className="px-5 lg:px-8 py-4">Assigned Tailor</th>
                                        <th className="px-5 lg:px-8 py-4">Amount</th>
                                        <th className="px-5 lg:px-8 py-4">Status</th>
                                        <th className="px-5 lg:px-8 py-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {(liveOrders.length > 0 ? liveOrders : recentOrders).map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                             <td className="px-5 lg:px-8 py-4 lg:py-5">
                                                 <div className="flex flex-col">
                                                     <span className="text-[10px] lg:text-xs font-black text-[#1e3932] uppercase">{order.id}</span>
                                                     <span className="text-xs lg:text-sm font-bold text-gray-900 mt-0.5">{order.service}</span>
                                                     <span className="text-[9px] lg:text-[10px] text-gray-400 font-medium">Customer: {order.customer}</span>
                                                 </div>
                                             </td>
                                             <td className="px-5 lg:px-8 py-4 lg:py-5">
                                                 <div className="flex items-center gap-2">
                                                     <div className="h-6 w-6 lg:h-7 lg:w-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                         {order.tailor.charAt(0)}
                                                     </div>
                                                     <span className="text-[10px] lg:text-xs font-bold text-gray-700">{order.tailor}</span>
                                                 </div>
                                             </td>
                                             <td className="px-5 lg:px-8 py-4 lg:py-5 text-xs lg:text-sm font-black text-gray-900">{order.amount}</td>
                                             <td className="px-5 lg:px-8 py-4 lg:py-5">
                                                 <span className={`px-2 py-1 lg:px-3 lg:py-1.5 rounded-lg text-[9px] lg:text-[10px] font-black border uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                                                     {order.status.replace(/-/g, ' ')}
                                                 </span>
                                             </td>
                                             <td className="px-5 lg:px-8 py-4 lg:py-5 text-right">
                                                 <button className="text-gray-300 hover:text-[#1e3932] transition-colors p-1.5 lg:p-2 hover:bg-gray-50 rounded-lg">
                                                     <MoreHorizontal size={18} className="lg:w-[20px] lg:h-[20px]" />
                                                 </button>
                                             </td>
                                         </tr>
                                     ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 lg:p-6 border-t border-gray-50 bg-gray-50/50 text-center">
                            <button className="text-[10px] lg:text-xs font-black text-[#1e3932] uppercase tracking-[0.1em] hover:underline">
                                View Full Marketplace Ledger
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column (Sidebar Widgets) */}
                <div className="space-y-6 lg:space-y-8">

                    {/* Action Widget */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gradient-to-br from-[#1e3932] to-[#0a211e] p-6 lg:p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Scissors size={80} />
                        </div>
                        <h4 className="text-base lg:text-lg font-black tracking-tight relative z-10">Tailor Applications</h4>
                        <p className="text-white/60 text-[10px] lg:text-xs mt-2 font-medium relative z-10 max-w-[200px]">You have 5 new tailors waiting for document KYC verification.</p>
                        <button className="mt-6 w-full py-3 bg-white text-[#1e3932] font-black rounded-xl text-[10px] lg:text-xs uppercase tracking-widest hover:shadow-[0_8px_30px_rgb(255,255,255,0.12)] transition-all active:scale-95 relative z-10">
                            Review Applications
                        </button>
                    </motion.div>

                    {/* Top Tailors */}
                    <div className="bg-white border border-gray-100 p-6 lg:p-8 rounded-[2rem] shadow-sm">
                        <h4 className="text-base lg:text-lg font-black text-gray-900 tracking-tight flex items-center justify-between">
                            Top Tailors
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest cursor-pointer hover:text-[#1e3932]">View All</span>
                        </h4>
                        <div className="mt-6 space-y-4">
                            {topTailors.map((tailor, idx) => (
                                <div key={idx} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[#1e3932] font-bold text-xs lg:text-sm group-hover:bg-[#1e3932] group-hover:text-white transition-colors">
                                            {tailor.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs lg:text-sm font-bold text-gray-900">{tailor.name}</p>
                                            <p className="text-[9px] lg:text-[10px] text-gray-400 font-medium">{tailor.completedOrders} Orders</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded text-orange-600 font-bold text-[10px]">
                                        ★ {tailor.rating}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Health */}
                    <div className="bg-white border border-gray-100 p-6 lg:p-8 rounded-[2rem] shadow-sm">
                        <h4 className="text-base lg:text-lg font-black text-gray-900 tracking-tight">System Health</h4>
                        <div className="mt-6 space-y-3 lg:space-y-4">
                            {[
                                { label: 'Payment Gateway', status: 'Healthy', color: 'bg-green-500' },
                                { label: 'Partner APIs', status: 'Healthy', color: 'bg-green-500' },
                                { label: 'Cloud DB', status: 'Maintenance', color: 'bg-orange-500' },
                                { label: 'Push Notifications', status: 'Degraded', color: 'bg-yellow-500' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-xl lg:rounded-2xl border border-gray-100/50">
                                    <span className="text-[10px] lg:text-xs font-bold text-gray-600 flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-gray-400" />
                                        {item.label}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className={`h-1.5 w-1.5 rounded-full ${item.color} shadow-sm`}></span>
                                        <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-gray-400">{item.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
