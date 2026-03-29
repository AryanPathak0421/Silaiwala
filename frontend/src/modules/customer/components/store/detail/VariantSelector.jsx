import React from 'react';
import { Ruler } from 'lucide-react';
import { cn } from '../../../../../utils/cn';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['#000', '#fff', '#ff0000', '#00ff00', '#0000ff', '#ffff00'];

const VariantSelector = ({ images, selectedSize, setSelectedSize, selectedColor, setSelectedColor }) => {
    return (
        <div className="space-y-6">
            {/* Color Swatches */}
            <div>
                <span className="text-sm font-semibold mb-2 block">Available Colors</span>
                <div className="flex flex-wrap gap-3">
                    {COLORS.map((color, index) => (
                        <button
                            key={index}
                            className={cn(
                                "w-10 h-10 rounded-full border-2 transition-all hover:scale-110 relative",
                                selectedColor === color ? "border-primary shadow-lg" : "border-gray-200"
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => setSelectedColor(color)}
                        >
                            {selectedColor === color && (
                                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow-md">
                                    ✓
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sizes */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">Select Size</span>
                    {/* Size Chart Modal Toggle (Mock) */}
                    <button className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
                        <Ruler className="h-4 w-4" /> Size Chart
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => (
                        <button
                            key={size}
                            className={cn(
                                "w-12 h-10 border rounded-md text-sm font-medium transition-all hover:border-primary",
                                selectedSize === size
                                    ? "bg-primary text-white border-primary shadow-md"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                            )}
                            onClick={() => setSelectedSize(size)}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VariantSelector;
