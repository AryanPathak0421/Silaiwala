import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MenuOption = ({ icon: Icon, label, subLabel, to, onClick, isDanger }) => {
    const Component = to ? Link : 'button';

    return (
        <Component
            to={to}
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#FF5C8A]/20 hover:bg-[#FF5C8A]/[0.02] transition-all group mb-3 ${isDanger ? 'hover:bg-red-50 hover:border-red-100' : ''}`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDanger
                        ? 'bg-red-50 text-red-500 group-hover:bg-red-100'
                        : 'bg-pink-50 text-[#FF5C8A] group-hover:bg-[#FF5C8A] group-hover:text-white'
                    }`}>
                    <Icon size={18} />
                </div>
                <div className="text-left">
                    <h4 className={`text-sm font-bold ${isDanger ? 'text-red-600' : 'text-gray-900'}`}>{label}</h4>
                    {subLabel && <p className="text-[10px] text-gray-400 group-hover:text-gray-500">{subLabel}</p>}
                </div>
            </div>

            <ChevronRight
                size={16}
                className={`transition-colors ${isDanger ? 'text-red-300 group-hover:text-red-500' : 'text-gray-300 group-hover:text-[#FF5C8A]'}`}
            />
        </Component>
    );
};

export default MenuOption;
