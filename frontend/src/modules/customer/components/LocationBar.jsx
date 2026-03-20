import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown, Check, Loader2, Navigation, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import useLocationStore from '../../../store/locationStore';

const LocationBar = () => {
    const { address: location, setLocation, coordinates } = useLocationStore();
    const [isEditing, setIsEditing] = useState(false);
    const [tempLocation, setTempLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = () => {
        if (tempLocation.trim()) {
            // Mock random coords for manual entry for now
            const mockLat = 34.0837 + (Math.random() - 0.5) * 0.01;
            const mockLng = 74.7973 + (Math.random() - 0.5) * 0.01;
            setLocation(tempLocation, mockLat, mockLng);
            setIsEditing(false);
        }
    };

    const handleDetectLocation = () => {
        setIsLoading(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                // Reverse geocoding would happen here, showing mock for now
                setTimeout(() => {
                    const mockAddress = "HSR Layout, Bangalore - 560102";
                    setLocation(mockAddress, latitude, longitude);
                    setIsLoading(false);
                    setIsEditing(false);
                }, 1500);
            }, (error) => {
                alert("Location access denied.");
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    };

    return (
        <div className="px-4 py-3 bg-white/40 backdrop-blur-md border-b border-gray-100 flex justify-between items-center relative z-40 selection:bg-[#1e3932] selection:text-white">
            <AnimatePresence mode="wait">
                {isEditing ? (
                    <motion.div
                        key="editing"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center gap-2 w-full"
                    >
                        <div className="flex-1 relative flex items-center">
                            <Search className="absolute left-3 h-3 w-3 text-gray-400" />
                            <input
                                type="text"
                                value={tempLocation}
                                onChange={(e) => setTempLocation(e.target.value)}
                                placeholder="Enter area or pincode..."
                                className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#1e3932]/10 transition-all shadow-sm"
                                autoFocus
                            />
                        </div>
                        <button
                            onClick={handleDetectLocation}
                            className="p-2.5 bg-[#1e3932]/5 text-[#1e3932] rounded-xl hover:bg-[#1e3932]/10 transition-colors"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                        </button>
                        <button
                            onClick={handleSave}
                            className="p-2.5 bg-[#1e3932] text-white rounded-xl shadow-lg shadow-[#1e3932]/20 active:scale-90 transition-transform"
                        >
                            <Check size={16} />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="viewing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between w-full"
                    >
                        <div
                            className="flex items-center gap-2.5 truncate cursor-pointer group"
                            onClick={() => {
                                setTempLocation(location);
                                setIsEditing(true);
                            }}
                        >
                            <div className="w-8 h-8 rounded-full bg-[#1e3932]/5 flex items-center justify-center text-[#1e3932] shrink-0 border border-[#1e3932]/5">
                                <MapPin size={14} className="group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-none mb-1 text-left">Delivering To</p>
                                <div className="flex items-center gap-1.5 overflow-hidden">
                                    <span className="text-xs font-black text-gray-900 truncate tracking-tight">{location}</span>
                                    <ChevronDown size={14} className="text-[#1e3932] opacity-50 group-hover:translate-y-0.5 transition-transform" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse"></div>
                            <span className="text-[10px] font-black text-[#1e3932] uppercase tracking-widest opacity-80">Riders Online</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LocationBar;
