import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const ActiveOrderBanner = ({ order }) => {
    const navigate = useNavigate();
    if (!order) return null;

    const serviceTitle = order.items?.[0]?.service?.title || "Custom stitching";
    const status = order.status?.replace(/-/g, ' ').toUpperCase();
    const displayId = order.orderId || order._id?.substring(0, 8);

    return (
        <div className="px-4 mb-4" onClick={() => navigate(`/orders/${order._id}/track`)}>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all">
                <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Active Order #{displayId}</p>
                        <h3 className="font-bold text-gray-900 mt-0.5">{serviceTitle}</h3>
                    </div>
                    <div className="bg-orange-50 text-orange-600 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <Truck size={12} /> {status}
                    </div>
                </div>

                {/* Progress Bar (Dynamic based on tracking history length) */}
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2 relative z-10">
                    <div 
                        className="bg-[#1e3932] h-1.5 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min((order.trackingHistory?.length || 1) * 20, 100)}%` }}
                    ></div>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 relative z-10">
                    <span className="text-[10px] font-medium">Updated {new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <button className="text-[#1e3932] text-[10px] font-black uppercase tracking-widest">Track Now</button>
                </div>

                {/* Background Decoration */}
                <div className="absolute right-[-10px] bottom-[-10px] opacity-5 rotate-[-15deg]">
                    <CheckCircle2 size={80} />
                </div>
            </div>
        </div>
    );
};

export default ActiveOrderBanner;
