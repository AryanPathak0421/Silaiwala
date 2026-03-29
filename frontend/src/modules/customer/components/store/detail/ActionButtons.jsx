import React, { useState } from 'react';
import { ShoppingCart, ShoppingBag } from 'lucide-react';

const ActionButtons = ({ size, color, quantity }) => {
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        // Validation mock
        if (!size || !color) {
            alert('Please select a size and color first!');
            return;
        }
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleBuyNow = () => {
        if (!size || !color) {
            alert('Please select a size and color first!');
            return;
        }
        // Redirect to checkout
        window.location.href = '/checkout';
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 md:static p-4 bg-white border-t md:border-t-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none flex gap-4 md:gap-6 z-40">
            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-sm font-bold border-2 transition-all ${isAdded
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-white border-primary text-primary hover:bg-gray-50'
                    }`}
            >
                <ShoppingCart className="h-4 w-4" />
                {isAdded ? 'Added!' : 'Add to Cart'}
            </button>

            {/* Buy Now Button */}
            <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
                <ShoppingBag className="h-4 w-4" />
                Buy Now
            </button>
        </div>
    );
};

export default ActionButtons;
