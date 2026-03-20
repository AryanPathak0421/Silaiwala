import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Scissors, ShoppingBag, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../utils/cn';

const embellishmentCategories = [
    {
        id: 'piping',
        name: 'Piping',
        description: 'Elegant contrast borders for neckline and sleeves',
        designs: [
            { id: 'p1', name: 'Satin Piping', price: 50, image: 'https://images.unsplash.com/photo-1605650117070-e696f5b90757?w=400' },
            { id: 'p2', name: 'Cotton Cord Piping', price: 40, image: 'https://images.unsplash.com/photo-1598282361131-4899f8d1033b?w=400' },
            { id: 'p3', name: 'Zari Piping', price: 80, image: 'https://images.unsplash.com/photo-1617228834922-87063d89851f?w=400' }
        ]
    },
    {
        id: 'lacing',
        name: 'Lacing (Lessing)',
        description: 'Delicate lace work for a premium look',
        designs: [
            { id: 'l1', name: 'Cotton Lace', price: 120, image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=400' },
            { id: 'l2', name: 'Gota Patti Lace', price: 250, image: 'https://images.unsplash.com/photo-1614362985161-05ee56852bb0?w=400' },
            { id: 'l3', name: 'Mirror Work Lace', price: 350, image: 'https://images.unsplash.com/photo-1605650117070-e696f5b90757?w=400' }
        ]
    },
    {
        id: 'embroidery',
        name: 'Embroidery (Embadding)',
        description: 'Intricate thread work and patterns',
        designs: [
            { id: 'e1', name: 'Zardosi Work', price: 1500, image: 'https://images.unsplash.com/photo-1617228834922-87063d89851f?w=400' },
            { id: 'e2', name: 'Chickenkari', price: 800, image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=400' },
            { id: 'e3', name: 'Heavy Moti Work', price: 2000, image: 'https://images.unsplash.com/photo-1598282361131-4899f8d1033b?w=400' },
            { id: 'e4', name: 'Aari Work', price: 600, image: 'https://images.unsplash.com/photo-1614362985161-05ee56852bb0?w=400' }
        ]
    },
    {
        id: 'hardware',
        name: 'Buttons & Tassels (Latkans)',
        description: 'Statement buttons and decorative tassels',
        designs: [
            { id: 'h1', name: 'Handmade Tassels', price: 150, image: 'https://images.unsplash.com/photo-1605650117070-e696f5b90757?w=400' },
            { id: 'h2', name: 'Potli Buttons', price: 10, image: 'https://images.unsplash.com/photo-1598282361131-4899f8d1033b?w=400' },
            { id: 'h3', name: 'Metal Shank Buttons', price: 80, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400' }
        ]
    }
];

const Embellishments = () => {
    const navigate = useNavigate();
    const [selectedDesigns, setSelectedDesigns] = useState({});

    const toggleDesign = (categoryId, design) => {
        setSelectedDesigns(prev => {
            const current = prev[categoryId] || [];
            if (current.find(d => d.id === design.id)) {
                return { ...prev, [categoryId]: current.filter(d => d.id !== design.id) };
            }
            return { ...prev, [categoryId]: [...current, design] };
        });
    };

    const calculateTotal = () => {
        return Object.values(selectedDesigns).flat().reduce((sum, d) => sum + d.price, 0);
    };

    return (
        <div className="min-h-screen bg-[#f8faf9] pb-40 font-sans">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl pt-safe border-b border-gray-100">
                <div className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-all active:scale-90">
                            <ArrowLeft size={22} className="text-gray-900" />
                        </button>
                        <div>
                            <h1 className="text-lg font-black text-gray-900 leading-none">Embellishments</h1>
                            <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest mt-1">Embadding & Finishes</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 mt-6 space-y-8">
                {embellishmentCategories.map((category) => (
                    <section key={category.id} className="space-y-4">
                        <div className="flex justify-between items-end px-2">
                            <div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">{category.name}</h3>
                                <p className="text-[10px] text-gray-400 font-bold">{category.description}</p>
                            </div>
                            {selectedDesigns[category.id]?.length > 0 && (
                                <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase">
                                    {selectedDesigns[category.id].length} Selected
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {category.designs.map((design) => {
                                const isSelected = selectedDesigns[category.id]?.find(d => d.id === design.id);
                                return (
                                    <motion.div
                                        key={design.id}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => toggleDesign(category.id, design)}
                                        className={cn(
                                            "relative bg-white rounded-[2rem] overflow-hidden border transition-all cursor-pointer group",
                                            isSelected ? "border-purple-500 shadow-md ring-1 ring-purple-500/20" : "border-gray-100 shadow-sm hover:border-purple-200"
                                        )}
                                    >
                                        <div className="aspect-[4/3] relative">
                                            <img src={design.image} alt={design.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                            {isSelected && (
                                                <div className="absolute top-3 right-3 bg-purple-600 text-white p-1 rounded-full shadow-lg">
                                                    <CheckCircle2 size={14} />
                                                </div>
                                            )}
                                            <div className="absolute bottom-3 left-4">
                                                <p className="text-[11px] font-black text-white uppercase tracking-wider">{design.name}</p>
                                                <p className="text-[10px] font-bold text-white/80">₹{design.price}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                ))}

                {/* Info Card */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                            <Info size={18} />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Pricing Policy</h3>
                            <p className="text-[10px] text-gray-400 font-bold">Standard rates per outfit</p>
                        </div>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                        Embellishment prices are indicative and may vary based on the length and density of the work. Our master will provide a final quote upon fabric inspection.
                    </p>
                </div>
            </div>

            {/* Bottom Panel */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-gray-100 p-4 pb-safe">
                <div className="max-w-md mx-auto">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Add-on Total</p>
                            <h4 className="text-2xl font-black text-gray-900 leading-none">₹{calculateTotal()}</h4>
                        </div>
                        <div className="flex -space-x-2">
                            {Object.values(selectedDesigns).flat().slice(0, 3).map((d, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                                    <img src={d.image} className="w-full h-full object-cover" alt="" />
                                </div>
                            ))}
                            {Object.values(selectedDesigns).flat().length > 3 && (
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-50 flex items-center justify-center text-[10px] font-black text-purple-600">
                                    +{Object.values(selectedDesigns).flat().length - 3}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/services')}
                        className={cn(
                            "w-full py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg",
                            calculateTotal() > 0 ? "bg-purple-600 text-white shadow-purple-600/20 active:scale-[0.98]" : "bg-gray-100 text-gray-400"
                        )}
                    >
                        {calculateTotal() > 0 ? (
                            <>Confirm Selection <ChevronRight size={16} /></>
                        ) : (
                            <>Choose Designs to Continue</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Embellishments;
