import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingBag,
    Clock,
    CheckCircle,
    TrendingUp,
    MoreVertical,
    ChevronRight
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const stats = [
        { label: 'Total Orders', value: '48', icon: <ShoppingBag className="text-blue-600" />, change: '+12% from last month' },
        { label: 'Pending', value: '12', icon: <Clock className="text-orange-600" />, change: '4 overdue' },
        { label: 'Completed', value: '32', icon: <CheckCircle className="text-green-600" />, change: '+5 today' },
        { label: 'Earnings', value: '₹14,500', icon: <TrendingUp className="text-purple-600" />, change: 'Avg ₹450/order' },
    ];

    const recentOrders = [
        { id: 'ORD-7214', customer: 'Priya Sharma', service: 'Anarkali Suit', date: '21 Feb 2024', status: 'Measuring', priority: 'High' },
        { id: 'ORD-7215', customer: 'Rahul Verma', service: 'Sherwani Stitching', date: '22 Feb 2024', status: 'Cutting', priority: 'Normal' },
        { id: 'ORD-7216', customer: 'Sneha Patel', service: 'Blouse Alteration', date: '22 Feb 2024', status: 'Stitching', priority: 'Urgent' },
        { id: 'ORD-7217', customer: 'Amit Gupta', service: 'Suit Fitting', date: '23 Feb 2024', status: 'Ironing', priority: 'Normal' },
    ];

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'measuring': return 'bg-blue-100 text-blue-700';
            case 'cutting': return 'bg-orange-100 text-orange-700';
            case 'stitching': return 'bg-purple-100 text-purple-700';
            case 'ironing': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'urgent': return 'text-red-600 font-bold animate-pulse';
            case 'high': return 'text-orange-600 font-medium';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-[#1e3932]">Welcome back, Royal Stitches! 👋</h2>
                    <p className="text-gray-500 mt-2 font-medium">You have 3 new orders waiting for acceptance today.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/tailor/settings')}
                        className="px-6 py-2.5 rounded-xl bg-[#1e3932] text-white font-semibold hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[0] transition-all"
                    >
                        Manage Availability
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                {stat.icon}
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-gray-500 font-medium text-sm">{stat.label}</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                                {stat.change}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Active Work Orders</h3>
                    <button
                        onClick={() => navigate('/tailor/orders')}
                        className="text-[#1e3932] font-semibold text-sm flex items-center gap-1 hover:underline"
                    >
                        See all orders <ChevronRight size={16} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-[#1e3932] text-sm uppercase">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{order.customer}</div>
                                        <div className="text-xs text-gray-400">{order.date}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{order.service}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs ${getPriorityColor(order.priority)}`}>
                                            {order.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => navigate('/tailor/orders', { state: { highlightOrderTitle: order.id } })}
                                            className="bg-white border rounded-lg px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-[#1e3932] hover:text-white hover:border-[#1e3932] transition-all"
                                        >
                                            Update Status
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
