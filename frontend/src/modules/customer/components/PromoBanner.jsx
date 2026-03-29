import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Clock, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import api from '../../../utils/api';

const PromoBanner = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const defaultBanners = [
        {
            id: 'default-1',
            title: "FLAT 20% OFF",
            subtitle: "On your first custom stitching order",
            badge: "LIMITED OFFER",
            color: "bg-gradient-to-br from-[#FF5C8A] to-[#ff85a2]",
            image: "https://cdn-icons-png.flaticon.com/128/9284/9284227.png"
        },
        {
            id: 'default-2',
            title: "EXPRESS DELIVERY",
            subtitle: "Get your outfit stitched in 24 hours",
            badge: "PREMIUM SERVICE",
            color: "bg-gradient-to-br from-[#1e3e5a] to-[#2d5a8c]",
            image: "https://cdn-icons-png.flaticon.com/128/9420/9420653.png"
        }
    ];

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await api.get('/cms/banners/active');
                if (res.data.success && res.data.data.length > 0) {
                    // Filter for Home Page placement or use all active as needed
                    const activeBanners = res.data.data.map(b => ({
                        id: b._id,
                        title: b.title || "Special Offer",
                        subtitle: b.subtitle || "Premium custom tailoring services",
                        badge: b.badge || "FEATURED",
                        color: b.color || "bg-gradient-to-br from-[#FF5C8A] to-[#ff85a2]",
                        image: b.image || "https://cdn-icons-png.flaticon.com/128/9284/9284227.png"
                    }));
                    setBanners(activeBanners);
                } else {
                    setBanners(defaultBanners);
                }
            } catch (error) {
                console.error('Failed to fetch banners:', error);
                setBanners(defaultBanners);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const next = () => setCurrentIndex(prev => (prev + 1) % banners.length);
    const prev = () => setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="w-full h-42 bg-gray-100 animate-pulse rounded-3xl flex items-center justify-center">
                    <Sparkles size={24} className="text-gray-200" />
                </div>
            </div>
        );
    }

    if (banners.length === 0) return null;

    const currentBanner = banners[currentIndex];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 relative group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`relative overflow-hidden rounded-3xl ${currentBanner.color || 'bg-gradient-to-br from-[#FF5C8A] to-[#ff85a2]'} text-white p-6 shadow-xl h-42 flex items-center`}
                >
                    {/* Background Decoration */}
                    <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex-1 flex flex-col gap-2">
                        <div className="bg-white/20 w-fit px-2 py-1 rounded-md text-[10px] font-bold tracking-wider backdrop-blur-sm flex items-center gap-1">
                            <Tag size={10} /> {currentBanner.badge || 'PROMO'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black leading-tight tracking-tight uppercase">
                                {currentBanner.title}
                            </h2>
                            <p className="text-xs text-white/80 mt-1 font-medium">{currentBanner.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                            <button className="bg-white text-[#FF5C8A] px-5 py-2 rounded-full text-[11px] font-black shadow-lg hover:shadow-white/10 active:scale-95 transition-all flex items-center gap-2 uppercase">
                                Book Now <ArrowRight size={12} />
                            </button>
                        </div>
                    </div>

                    <div className="relative z-10 w-24 h-24 flex items-center justify-center">
                        <motion.img
                            initial={{ scale: 0.5, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            src={currentBanner.image}
                            alt="Banner Icon"
                            className="w-full h-full object-contain drop-shadow-2xl"
                            onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/128/9284/9284227.png'; }}
                        />
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Dots */}
            {banners.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                    {banners.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/30'}`}
                        />
                    ))}
                </div>
            )}

            {/* Navigation Arrows (Visible on Hover in Desktop) */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft size={16} className="text-white" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight size={16} className="text-white" />
                    </button>
                </>
            )}
        </div>
    );
};

export default PromoBanner;
