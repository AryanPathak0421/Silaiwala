import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Check, X, Scissors, Layers, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Orders = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('new');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);

    useEffect(() => {
        if (location.state) {
            if (location.state.highlightOrderTitle) {
                setSearchQuery(location.state.highlightOrderTitle);
            }
            if (location.state.orderStatus) {
                const status = location.state.orderStatus;
                if (status === 'Pending' || status === 'Active') setActiveTab('active');
                if (status === 'Done') setActiveTab('history');
            }
        }
    }, [location]);

    const orders = [
        { id: 'ORD-101', customer: 'Anjali R.', service: 'Kurti Stitching', deadline: 'Today', status: 'NEW', price: '₹1,200' },
        { id: 'ORD-102', customer: 'Suresh M.', service: 'Mens Shirt', deadline: 'Tomorrow', status: 'CUTTING', price: '₹850' },
        { id: 'ORD-103', customer: 'Priya D.', service: 'Designer Blouse', deadline: '24 Feb', status: 'STITCHING', price: '₹2,500' },
        { id: 'ORD-104', customer: 'Neha K.', service: 'Salwar Suit', deadline: '25 Feb', status: 'READY', price: '₹1,800' },
        { id: 'ORD-105', customer: 'Vikram S.', service: 'Suit Alteration', deadline: '20 Feb', status: 'DELIVERED', price: '₹450' },
        { id: 'ORD-106', customer: 'Rahul T.', service: 'Trouser Fitting', deadline: '18 Feb', status: 'CANCELLED', price: '₹250' },
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'CUTTING': return <Scissors size={14} />;
            case 'STITCHING': return <Layers size={14} />;
            case 'READY': return <CheckCircle2 size={14} />;
            case 'DELIVERED': return <Check size={14} />;
            case 'CANCELLED': return <X size={14} />;
            default: return null;
        }
    };

    const handleAction = (action, id) => {
        alert(`${action} action triggered for order ${id}`);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.service.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (activeTab === 'new') return order.status === 'NEW';
        if (activeTab === 'active') return ['CUTTING', 'STITCHING', 'READY'].includes(order.status);
        if (activeTab === 'history') return ['DELIVERED', 'CANCELLED'].includes(order.status);

        return true;
    });

    return (
        <div className="space-y-4">
            {/* Search & Filter */}
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search Order ID or Customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-[#1e3932] shadow-sm text-sm"
                    />
                </div>
                <button
                    onClick={() => alert("Filter options opened")}
                    className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                    <Filter size={18} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-[1.25rem] gap-1">
                {['new', 'active', 'history'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-[1rem] transition-all ${activeTab === tab ? 'bg-[#1e3932] text-white shadow-md' : 'text-gray-400'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Order List */}
            <div className="space-y-3">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-[1.5rem] border border-gray-50 shadow-sm">
                        <p className="text-gray-400 font-bold text-sm">No orders found in this category.</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white p-4 rounded-[1.5rem] border border-gray-50 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-md transition-shadow group relative">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#1e3932] font-black text-xs">
                                        {order.id.split('-')[1]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm tracking-tight">{order.service}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Customer: {order.customer}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveMenuId(activeMenuId === order.id ? null : order.id)}
                                    className={`p-1.5 rounded-lg transition-colors ${activeMenuId === order.id ? 'bg-gray-100 text-gray-900' : 'text-gray-300 hover:bg-gray-50'}`}
                                >
                                    <MoreVertical size={18} />
                                </button>

                                {/* Dropdown Menu */}
                                {activeMenuId === order.id && (
                                    <div className="absolute right-4 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 animate-in fade-in zoom-in duration-200">
                                        <button onClick={() => { handleAction('Contact Customer', order.id); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">Contact Customer</button>
                                        <button onClick={() => { handleAction('View Invoice', order.id); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">View Invoice</button>
                                        <button onClick={() => { handleAction('Cancel Order', order.id); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 relative mt-1 before:absolute before:top-0 before:left-2 before:right-2 before:border-t before:border-gray-50">Cancel Order</button>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between items-end border-t border-gray-50 pt-3 mt-1">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Deadline</p>
                                    <p className={`text-xs font-black ${order.deadline === 'Today' ? 'text-red-500 animate-pulse' : 'text-[#1e3932]'}`}>
                                        {order.deadline}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {order.status === 'NEW' ? (
                                        <>
                                            <button
                                                onClick={() => handleAction('Accept Order', order.id)}
                                                className="px-4 py-2 bg-[#1e3932] text-white text-[10px] font-black uppercase rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1"
                                            >
                                                <Check size={14} strokeWidth={4} /> Accept
                                            </button>
                                            <button
                                                onClick={() => handleAction('Reject Order', order.id)}
                                                className="px-4 py-2 border border-red-100 text-red-500 text-[10px] font-black uppercase rounded-xl hover:bg-red-50 active:scale-95 transition-all flex items-center gap-1"
                                            >
                                                <X size={14} strokeWidth={4} /> Reject
                                            </button>
                                        </>
                                    ) : (
                                        <button className="px-4 py-2 bg-gray-100 text-[#1e3932] text-[10px] font-black uppercase rounded-xl flex items-center gap-1.5">
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )))}
            </div>
        </div>
    );
};

export default Orders;
