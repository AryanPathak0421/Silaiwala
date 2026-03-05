import React from 'react';
import {
    TrendingUp,
    ShoppingBag,
    Users,
    Scissors,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Search,
    Filter
} from 'lucide-react';

const AdminDashboard = () => {
    const stats = [
        { label: 'Total Revenue', value: '₹2,45,800', icon: <TrendingUp size={20} />, change: '+18.5%', positive: true },
        { label: 'Active Orders', value: '156', icon: <ShoppingBag size={20} />, change: '+5.2%', positive: true },
        { label: 'Total Tailors', value: '42', icon: <Scissors size={20} />, change: '-2.1%', positive: false },
        { label: 'New Customers', value: '1,280', icon: <Users size={20} />, change: '+12.4%', positive: true },
    ];

    const globalOrders = [
        { id: 'ORD-9901', customer: 'Ananya Iyer', tailor: 'Classic Stitch', service: 'Bridal Lehenga', amount: '₹12,000', status: 'In Production' },
        { id: 'ORD-9902', customer: 'Vikram Seth', tailor: 'Mens Hub', service: 'Tuxedo', amount: '₹8,500', status: 'Quality Check' },
        { id: 'ORD-9903', customer: 'Meera Das', tailor: 'Elite Tailors', service: 'Designer Saree', amount: '₹4,200', status: 'Pickup Assigned' },
        { id: 'ORD-9904', customer: 'Karan Mehra', tailor: 'Royal Stitches', service: 'Sherwani', amount: '₹15,000', status: 'Delivered' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'In Production': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Quality Check': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Pickup Assigned': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group overflow-hidden relative">
                        <div className="absolute -right-2 -top-2 h-16 w-16 bg-[#1e3932]/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="flex justify-between items-center relative z-10">
                            <div className="p-3 bg-gray-50 text-[#1e3932] rounded-xl group-hover:bg-[#1e3932] group-hover:text-white transition-colors">
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.positive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="mt-5 relative z-10">
                            <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{stat.label}</h3>
                            <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Orders Table */}
                <div className="xl:col-span-2 bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Recent Global Orders</h3>
                            <p className="text-xs text-gray-400 mt-1 font-medium">Real-time marketplace activity overview</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2.5 text-gray-400 hover:text-[#1e3932] hover:bg-gray-50 rounded-xl transition-all border border-gray-100">
                                <Search size={18} />
                            </button>
                            <button className="p-2.5 text-gray-400 hover:text-[#1e3932] hover:bg-gray-50 rounded-xl transition-all border border-gray-100">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                                    <th className="px-8 py-4">Order Details</th>
                                    <th className="px-8 py-4">Assigned Tailor</th>
                                    <th className="px-8 py-4">Amount</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {globalOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-[#1e3932] uppercase">{order.id}</span>
                                                <span className="text-sm font-bold text-gray-900 mt-0.5">{order.service}</span>
                                                <span className="text-[10px] text-gray-400 font-medium">Customer: {order.customer}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                    {order.tailor.charAt(0)}
                                                </div>
                                                <span className="text-xs font-bold text-gray-700">{order.tailor}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-black text-gray-900">{order.amount}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black border uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="text-gray-300 hover:text-[#1e3932] transition-colors p-2 hover:bg-gray-50 rounded-lg">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 border-t border-gray-50 bg-gray-50/50 text-center">
                        <button className="text-xs font-black text-[#1e3932] uppercase tracking-[0.1em] hover:underline">
                            View All Marketplace Transactions
                        </button>
                    </div>
                </div>

                {/* Sidebar/Quick Actions for Admin */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-[#1e3932] to-[#0a211e] p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Scissors size={80} />
                        </div>
                        <h4 className="text-lg font-black tracking-tight relative z-10">Tailor Applications</h4>
                        <p className="text-white/60 text-xs mt-2 font-medium relative z-10">You have 5 new tailors waiting for document verification.</p>
                        <button className="mt-6 w-full py-3 bg-white text-[#1e3932] font-black rounded-xl text-xs uppercase tracking-widest hover:shadow-lg transition-all active:scale-95 relative z-10">
                            Review Now
                        </button>
                    </div>

                    <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm">
                        <h4 className="text-lg font-black text-gray-900 tracking-tight">System Health</h4>
                        <div className="mt-6 space-y-4">
                            {[
                                { label: 'Payment Gateway', status: 'Healthy', color: 'bg-green-500' },
                                { label: 'Tailor API', status: 'Healthy', color: 'bg-green-500' },
                                { label: 'Admin DB', status: 'Maintenance', color: 'bg-orange-500' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                                    <span className="text-xs font-bold text-gray-600">{item.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`h-1.5 w-1.5 rounded-full ${item.color}`}></span>
                                        <span className="text-[10px] font-black uppercase text-gray-400">{item.status}</span>
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
