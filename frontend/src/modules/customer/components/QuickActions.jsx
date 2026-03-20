import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Scissors, ShoppingBag, ClipboardList, Users, Sparkles } from 'lucide-react';

const actions = [
    {
        label: 'Tailors',
        icon: <Users className="w-6 h-6 text-indigo-600" />,
        color: 'bg-indigo-50',
        path: '/tailors'
    },
    {
        label: 'Store',
        icon: <ShoppingBag className="w-6 h-6 text-rose-600" />,
        color: 'bg-rose-50',
        path: '/store'
    },
    {
        label: 'My Orders',
        icon: <ClipboardList className="w-6 h-6 text-blue-600" />,
        color: 'bg-blue-50',
        path: '/orders'
    },
    {
        label: 'Stitching',
        icon: <Scissors className="w-6 h-6 text-amber-600" />,
        color: 'bg-amber-50',
        path: '/services'
    },
    {
        label: 'Embellishments',
        icon: <Sparkles className="w-6 h-6 text-purple-600" />,
        color: 'bg-purple-50',
        path: '/embellishments'
    }
];

const QuickActions = () => {
    const navigate = useNavigate();

    return (
        <div className="px-4 py-3">
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                {actions.map((action, index) => (
                    <motion.div
                        key={index}
                        className="flex flex-col items-center gap-2.5 cursor-pointer group"
                        whileTap={{ scale: 0.92 }}
                        onClick={() => navigate(action.path)}
                    >
                        <div className={`w-full aspect-square rounded-[1.5rem] shadow-sm ${action.color} flex items-center justify-center border border-white/80 backdrop-blur-md transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1`}>
                            <div className="p-3 bg-white/40 rounded-xl shadow-inner border border-white/20 group-hover:bg-white/60 transition-colors">
                                {action.icon}
                            </div>
                        </div>
                        <span className="text-[10px] font-black text-center text-gray-500 uppercase tracking-widest leading-none">
                            {action.label}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
