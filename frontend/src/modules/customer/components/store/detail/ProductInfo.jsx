import React, { useState } from 'react';
import { Star, Truck, ShieldCheck, Ruler } from 'lucide-react';

const ProductInfo = ({ product }) => {
    return (
        <div className="space-y-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">{product.category}</span>
                <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded text-xs font-bold text-green-700">
                    4.5 <Star className="h-3 w-3 fill-current" />
                    <span className="text-gray-400 font-normal ml-1">({product.reviews} reviews)</span>
                </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
            </h1>

            {/* Price Block */}
            <div className="flex items-end gap-3 pb-4 border-b border-gray-100">
                <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                {product.originalPrice && (
                    <>
                        <span className="text-lg text-gray-400 line-through mb-1">₹{product.originalPrice}</span>
                        <span className="text-sm font-bold text-orange-500 mb-1">
                            ({product.discount}% OFF)
                        </span>
                    </>
                )}
            </div>

            {/* Stock & COD Badges */}
            <div className="flex flex-wrap gap-2 text-xs font-medium">
                {product.inStock ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md flex items-center gap-1">
                        In Stock
                    </span>
                ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md">
                        Out of Stock
                    </span>
                )}

                {product.codAvailable && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md flex items-center gap-1">
                        COD Available
                    </span>
                )}
            </div>
        </div>
    );
};

export default ProductInfo;
