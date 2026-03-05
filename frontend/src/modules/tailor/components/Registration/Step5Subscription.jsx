import React from 'react';
import { Check } from 'lucide-react';

export const Step5Subscription = ({ register, watch, setValue }) => {
    const selectedPlan = watch('plan') || 'basic';

    const plans = [
        { id: 'basic', name: 'Starter', price: '₹499', features: ['Unlimited Orders', 'Basic Layout', 'Standard Support'], color: 'from-gray-100 to-gray-200 text-gray-800' },
        { id: 'premium', name: 'Premium', price: '₹999', features: ['Priority Search', 'Portfolio Badge', 'Advanced Analytics'], popular: true, color: 'from-[#1e3932] to-[#0a211e] text-white' },
        { id: 'pro', name: 'Pro Elite', price: '₹1,999', features: ['0% Commission', 'dedicated Manager', 'Featured Listing'], color: 'from-amber-100 to-amber-200 text-amber-900' },
    ];

    return (
        <div className="space-y-8 animate-in slide-in-from-right duration-300 pb-10">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Choose Your Plan</h3>
                <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">Select a plan to start receiving orders</p>
            </div>

            <div className="space-y-4">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        onClick={() => setValue('plan', plan.id)}
                        className={`relative p-6 rounded-[2rem] border-2 transition-all cursor-pointer group ${selectedPlan === plan.id ? 'border-[#1e3932] bg-gray-50/50 shadow-xl scale-[1.02]' : 'border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        {plan.popular && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1e3932] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border-2 border-white shadow-md">
                                Most Popular
                            </span>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-lg font-black tracking-tight">{plan.name}</h4>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <span className="text-2xl font-black">{plan.price}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">/ Month</span>
                                </div>
                            </div>
                            <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedPlan === plan.id ? 'border-[#1e3932] bg-[#1e3932] text-white' : 'border-gray-200'
                                }`}>
                                {selectedPlan === plan.id && <Check size={14} strokeWidth={4} />}
                            </div>
                        </div>

                        <ul className="space-y-3">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                    <div className={`h-1.5 w-1.5 rounded-full ${selectedPlan === plan.id ? 'bg-[#1e3932]' : 'bg-gray-300'}`}></div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-[#f0f9f6] rounded-3xl border border-[#d4e9e2] mt-6">
                <div className="flex gap-3">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#1e3932]">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm0-10h2v8h-2V6z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-black text-[#1e3932] uppercase tracking-[0.1em]">Refund Policy</p>
                        <p className="text-[10px] text-green-700 font-bold mt-1 leading-relaxed">Cancel anytime. 7-day money back guarantee if not approved by admin.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
