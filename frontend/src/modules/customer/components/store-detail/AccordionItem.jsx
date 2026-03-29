import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AccordionItem = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                className="w-full flex justify-between items-center py-4 text-left group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">{title}</span>
                {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            {isOpen && <div className="text-xs text-gray-600 pb-4 leading-relaxed animate-in slide-in-from-top-1">{content}</div>}
        </div>
    );
};

export default AccordionItem;
