import React from 'react';
import { Phone, MessageSquare, History, User, MapPin, Truck } from 'lucide-react';

const DeliveryDetails = () => {
    const currentPartner = {
        name: 'Rahul K.',
        phone: '+91 98XXX XXX01',
        rating: '4.8',
        status: 'ON_THE_WAY',
        tasks: '2 Pickups Today'
    };

    const recentHistory = [
        { date: '18 Feb', status: 'COMPLETED', task: 'Delivery to Customer' },
        { date: '17 Feb', status: 'COMPLETED', task: 'Fabric Pickup' },
        { date: '15 Feb', status: 'RETURNED', task: 'Alteration Request' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 h-20 w-20 bg-[#1e3932]/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>

                <div className="flex flex-col items-center">
                    <div className="h-20 w-20 bg-gray-100 rounded-[2rem] border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                        <User size={48} className="text-gray-300" />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 mt-4 tracking-tight">{currentPartner.name}</h4>
                    <div className="flex items-center gap-1 mt-1 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                        <span className="text-[9px] font-black uppercase text-green-700 tracking-widest">Currently Active</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                    <button className="flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-[#1e3932] font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                        <Phone size={14} fill="currentColor" /> Call
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-[#1e3932] font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                        <MessageSquare size={14} fill="currentColor" /> Chat
                    </button>
                </div>

                <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-2xl border border-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="text-[#1e3932]"><Truck size={18} /></div>
                            <span className="text-xs font-bold text-gray-600">Active Task</span>
                        </div>
                        <span className="text-[11px] font-black text-gray-900 uppercase">Pickup Flow</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-2xl border border-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="text-amber-500"><MapPin size={16} /></div>
                            <span className="text-[11px] font-bold text-gray-600">Location</span>
                        </div>
                        <span className="text-[11px] font-black text-gray-900 uppercase tracking-tighter">Bandra West</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 pl-2">
                    <History size={16} className="text-gray-400" />
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Delivery History</h4>
                </div>
                <div className="space-y-3">
                    {recentHistory.map((item, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-[1.5rem] border border-gray-50 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 uppercase font-black text-[10px]">
                                    {item.date.split(' ')[0]}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-900 leading-none">{item.task}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">{item.date}</p>
                                </div>
                            </div>
                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${item.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'
                                }`}>
                                {item.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DeliveryDetails;
