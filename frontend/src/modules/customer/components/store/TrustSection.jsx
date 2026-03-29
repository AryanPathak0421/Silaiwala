import React from 'react';
import { Truck, Banknote, RotateCcw, ShieldCheck } from 'lucide-react';

const TrustSection = () => {
    const items = [
        { icon: Truck, title: 'Pan India Delivery', desc: 'Across 25000+ Pincodes' },
        { icon: Banknote, title: 'COD Available', desc: 'Pay upon delivery' },
        { icon: RotateCcw, title: 'Easy Returns', desc: '7 Days Replacement' },
        { icon: ShieldCheck, title: 'Secure Payments', desc: 'Razorpay Protected' },
    ];

    return (
        <div className="bg-white py-8 border-y border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {items.map((item, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 group cursor-default">
                            <div className="p-3 bg-gray-50 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrustSection;
