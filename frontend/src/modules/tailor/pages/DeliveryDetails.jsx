import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, History, User, MapPin, Truck, Loader2, PackageSearch } from 'lucide-react';
import api from '../../../utils/api';

const DeliveryDetails = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDeliveryDetails = async () => {
            try {
                const response = await api.get('/tailors/delivery-details');
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching delivery details:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDeliveryDetails();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={40} className="text-[#1e3932] animate-spin mb-4" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Fetching active riders...</p>
            </div>
        );
    }

    const currentPartner = data?.activePartner;
    const activeTasks = data?.activeTasks || [];
    const recentHistory = data?.history || [];

    if (!currentPartner && activeTasks.length === 0 && recentHistory.length === 0) {
        return (
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 text-center flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                    <Truck size={40} />
                </div>
                <h3 className="text-lg font-black text-gray-900">No active deliveries</h3>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest max-w-[200px]">Once a courier is assigned to your orders, they will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Active Partner Card */}
            {currentPartner ? (
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 h-20 w-20 bg-[#1e3932]/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>

                    <div className="flex flex-col items-center">
                        <div className="h-20 w-20 bg-gray-100 rounded-[2rem] border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                            {currentPartner.profileImage ? (
                                <img src={currentPartner.profileImage} alt={currentPartner.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={48} className="text-gray-300" />
                            )}
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mt-4 tracking-tight">{currentPartner.name}</h4>
                        <div className="flex items-center gap-1 mt-1 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                            <span className="text-[9px] font-black uppercase text-green-700 tracking-widest">Currently Active</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <a 
                            href={`tel:${currentPartner.phone || '+91'}`} 
                            className="flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-[#1e3932] font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all no-underline"
                        >
                            <Phone size={14} fill="currentColor" /> Call
                        </a>
                        <button className="flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-[#1e3932] font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all outline-none">
                            <MessageSquare size={14} fill="currentColor" /> Chat
                        </button>
                    </div>

                    <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-2xl border border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="text-[#1e3932]"><Truck size={18} /></div>
                                <span className="text-xs font-bold text-gray-600">Active Task</span>
                            </div>
                            <span className="text-[11px] font-black text-gray-900 uppercase">#{currentPartner.orderId} • {currentPartner.task}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-[#1e3932] p-6 rounded-[2.5rem] text-white flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Status</p>
                        <h3 className="text-lg font-black tracking-tight leading-none uppercase italic">Waiting for Courier</h3>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                        <PackageSearch size={22} className="text-white animate-pulse" />
                    </div>
                </div>
            )}

            {/* Delivery History */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pl-2">
                    <History size={16} className="text-gray-400" />
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Delivery History</h4>
                </div>
                <div className="space-y-3">
                    {recentHistory.length > 0 ? recentHistory.map((item, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-[1.5rem] border border-gray-50 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 uppercase font-black text-[10px]">
                                    {new Date(item.deliveredAt).getDate()}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-900 leading-none">Order #{item.orderId}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">Handed to {item.partnerName}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg border bg-green-50 text-green-700 border-green-100">
                                {item.status}
                            </span>
                        </div>
                    )) : (
                        <div className="bg-white p-6 rounded-3xl border border-gray-50 text-center text-[10px] font-black uppercase text-gray-300 tracking-widest italic">
                            No recent fulfillment history
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeliveryDetails;
