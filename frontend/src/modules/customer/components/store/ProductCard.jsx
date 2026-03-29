import React, { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../../../utils/cn';
import useWishlistStore from '../../../../store/wishlistStore';

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { toggleWishlist, isInWishlist } = useWishlistStore(state => state);
    const isWishlisted = isInWishlist(product._id || product.id);

    return (
        <div
            className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#FF5C8A]/20 shadow-sm"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Discount Badge */}
            {product.discount && (
                <div className="absolute top-2 left-2 z-20 bg-[#FFBC00] text-[#FF5C8A] text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                    -{product.discount}%
                </div>
            )}

            {/* Wishlist Icon */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product._id || product.id);
                }}
                className={cn(
                    "absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white/90 shadow-sm transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300",
                    isWishlisted ? "text-red-500 opacity-100 translate-y-0" : "text-gray-400 hover:text-red-500"
                )}
            >
                <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
            </button>

            {/* Image Link */}
            <Link to={`/store/product/${product._id || product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50/50">
                <img
                    src={product.image}
                    alt={product.name}
                    className={cn(
                        "object-cover w-full h-full transition-transform duration-700 ease-out",
                        isHovered ? "scale-110" : "scale-100"
                    )}
                />
            </Link>

            {/* Quick Add Button (Desktop Hover) - Positioned absolutely over the link but with higher z-index if needed, or outside link */}
            <button className="hidden md:flex absolute bottom-[calc(40%+1rem)] left-1/2 -translate-x-1/2 w-[90%] z-20 bg-white text-[#FF5C8A] py-2 px-4 rounded-full font-bold text-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#FF5C8A] hover:text-white items-center justify-center gap-2 pointer-events-auto">
                <ShoppingCart className="h-4 w-4" />
                Quick Add
            </button>


            {/* Details */}
            <div className="p-3">
                <Link to={`/store/product/${product._id || product.id}`} className="block">
                    {/* Category & Rating */}
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">
                            {typeof product.category === 'object' ? product.category?.name : product.category}
                        </span>
                        <div className="flex items-center gap-1 bg-pink-50 px-1 py-0.5 rounded text-[10px] font-bold text-[#FF5C8A]">
                            {product.rating || product.ratings || 0} <Star className="h-2 w-2 fill-current" />
                        </div>
                    </div>

                    {/* Name & Tailor */}
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-1 mb-0.5 group-hover:text-[#FF5C8A] transition-colors">{product.name}</h3>
                    {product.tailor && (
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-2">Available at: <span className="text-[#FF5C8A]">{product.tailor.shopName || product.tailor.name}</span></p>
                    )}

                    {/* Price Breakdown */}
                    <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                            <span className="text-base font-black text-[#FF5C8A]">₹{product.price}</span>
                            <span className="text-[10px] text-gray-400 font-medium">/ meter</span>
                            {product.originalPrice && (
                                <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                            )}
                        </div>
                        
                        {/* Estimated Total (Fabric + Stitching) */}
                        <div className="bg-gray-50 p-2 rounded-lg border border-dashed border-gray-200 mt-1">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Est. Stitching</span>
                                <span className="text-[10px] font-black text-[#FF5C8A]">₹{product.category?.basePrice || 499}</span>
                            </div>
                            <div className="flex justify-between items-center pt-0.5 border-t border-gray-200 mt-0.5">
                                <span className="text-[9px] font-black text-gray-500 uppercase">Total Est.</span>
                                <span className="text-xs font-black text-[#FF5C8A]">₹{Number(product.price) + (product.category?.basePrice || 499)}*</span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* COD Badge */}
                {product.codAvailable && (
                    <div className="inline-block text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 mb-2">
                        COD Available
                    </div>
                )}

                {/* Mobile Add to Cart */}
                <button className="md:hidden w-full bg-[#FF5C8A] text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    <ShoppingCart className="h-3 w-3" />
                    Add
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
