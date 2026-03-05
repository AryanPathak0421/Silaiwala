import React from 'react';
import { CreditCard, Zap, Calendar, ArrowUpCircle } from 'lucide-react';
import { Button } from '../components/UIElements';

const Subscription = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Current Plan Card */}
            <div className="bg-gradient-to-br from-[#1e3932] to-[#0a211e] p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={100} />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <span className="bg-white/10 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">Active Plan</span>
                            <h3 className="text-3xl font-black mt-4 tracking-tighter">Premium Plus</h3>
                        </div>
                        <ArrowUpCircle size={40} className="text-green-400" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                        <div>
                            <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                                <Calendar size={12} /> Expiry Date
                            </p>
                            <p className="text-sm font-black">20 March 2024</p>
                        </div>
                        <div>
                            <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                                <CreditCard size={12} /> Next Payout
                            </p>
                            <p className="text-sm font-black">₹14,500</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Upgrades */}
            <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Upgrade Options</h4>

                <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <Zap size={24} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Pro Elite Plan</p>
                            <p className="text-[10px] text-gray-400 font-bold italic tracking-tighter">0% Platform Fee + Priority Support</p>
                        </div>
                    </div>
                    <button className="text-[#1e3932] font-black text-xs uppercase tracking-widest hover:underline">
                        View
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <Button className="py-5 text-sm uppercase">Renew Subscription</Button>
                <Button variant="secondary" className="py-5 text-sm uppercase">Transaction History</Button>
            </div>

            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 mt-2">
                <div className="flex gap-4">
                    <div className="h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-orange-500">
                        <ShieldAlert size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-black text-gray-900 uppercase">Warning</p>
                        <p className="text-[10px] text-gray-500 font-bold mt-1 leading-relaxed">If subscription expires, your shop will be hidden from customers and active orders may be reassigned.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ShieldAlert = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

export default Subscription;
