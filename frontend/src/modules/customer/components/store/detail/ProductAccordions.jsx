import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../../../../utils/cn';

const AccordionItem = ({ title, content, isOpen, onClick }) => {
    const [open, setOpen] = useState(isOpen);

    const toggle = () => {
        setOpen(!open);
        onClick && onClick();
    };

    return (
        <div className="border-b border-gray-100 last:border-none">
            <button
                onClick={toggle}
                className="w-full flex justify-between items-center py-4 bg-transparent hover:bg-gray-50/50 transition-colors"
            >
                <span className="font-semibold text-gray-800 text-sm">{title}</span>
                {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-[max-height] duration-300 ease-in-out",
                    open ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
                )}
            >
                <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                    {content}
                </div>
            </div>
        </div>
    );
};

const ProductAccordions = () => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 space-y-2">
            <h3 className="text-lg font-bold text-primary mb-4">Product Details</h3>

            <AccordionItem
                title="Description"
                content="This beautiful embroidered kurti is perfect for any occasion. Made with premium fabric and intricate detailing, it offers both comfort and style. Ideal for casual outings, office wear, or festive gatherings."
                isOpen={true}
            />
            <AccordionItem
                title="Fabric & Care"
                content={
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Main Fabric: 100% Cotton</li>
                        <li>Trims: Rayon blend</li>
                        <li>Machine wash cold with similar colors</li>
                        <li>Do not bleach</li>
                        <li>Low iron if needed</li>
                    </ul>
                }
            />
            <AccordionItem
                title="Delivery & Returns"
                content={
                    <div className="space-y-3">
                        <p><strong>Pan India Delivery:</strong> Available across 25,000+ pincodes.</p>
                        <p><strong>Standard Delivery:</strong> 3-5 business days.</p>
                        <p><strong>Easy Returns:</strong> You can return this item within 7 days of delivery. No questions asked.</p>
                    </div>
                }
            />
            <AccordionItem
                title="Size & Fit"
                content="Regular Fit. The model (height 5'8\u0022) is wearing a size S."
            />
        </div>
    );
};

export default ProductAccordions;
