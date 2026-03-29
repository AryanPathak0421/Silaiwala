import React, { useState } from 'react';
import { Search, Bell, ShoppingBag, X, Heart, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../../../../store/cartStore';
import useWishlistStore from '../../../../store/wishlistStore';
import { motion, AnimatePresence } from 'framer-motion';

import silaiwalaLogo from '../../../../assets/silaiwala-logo.png';

const StoreHeader = ({ searchQuery, setSearchQuery }) => {
    const cartCount = useCartStore(state => state.getTotalItems());
    const wishlistCount = useWishlistStore(state => state.items.length);

    return (
        <div className="sticky top-0 z-[100] bg-white/80 backdrop-blur-2xl border-b border-gray-100/50 pt-2 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 pt-safe">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md overflow-hidden border border-gray-50 rotate-3 active:scale-95 transition-transform">
                            <img src={silaiwalaLogo} alt="Silaiwala" className="w-8 h-8 object-contain" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-black text-gray-900 leading-none tracking-tight">Silai<span className="text-[#FF5C8A]">wala</span></h1>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Premium Collection</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to="/wishlist"
                            className="p-2.5 bg-gray-50 rounded-2xl text-gray-400 border border-gray-100 hover:bg-white hover:text-[#FF5C8A] transition-all active:scale-90 relative"
                        >
                            <Heart size={20} className={wishlistCount > 0 ? "fill-[#FF5C8A] text-[#FF5C8A]" : ""} />
                            {wishlistCount > 0 && (
                                <span className="absolute top-2 right-2 h-2 w-2 bg-[#FF5C8A] rounded-full border border-white"></span>
                            )}
                        </Link>

                        <Link
                            to="/cart"
                            className="p-2.5 bg-gray-50 rounded-2xl text-gray-400 border border-gray-100 hover:bg-white hover:text-[#FF5C8A] transition-all active:scale-90 relative"
                        >
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#FF5C8A] text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-md">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <Link to="/profile" className="p-0.5 border-2 border-gray-100 rounded-[1.25rem] overflow-hidden active:scale-90 transition-transform">
                            <div className="w-10 h-10 bg-gray-100 rounded-[1rem] flex items-center justify-center text-gray-400">
                                <Menu size={20} />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#FF5C8A] transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search fabrics, designs, collections..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-100 border border-transparent rounded-[1.25rem] py-3.5 pl-11 pr-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF5C8A]/5 focus:border-[#FF5C8A]/20 transition-all placeholder:text-gray-400 shadow-inner"
                    />
                </div>
            </div>
        </div>
    );
};

export default StoreHeader;
