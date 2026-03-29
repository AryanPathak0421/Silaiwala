import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, ChevronRight, CheckCircle2, ShieldCheck, Tag, Info, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { TAILORS } from '../data/tailors';
import useCheckoutStore from '../../../store/checkoutStore';

const FabricDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const setTailorInStore = useCheckoutStore(state => state.setTailor);

    const [fabric, setFabric] = useState(null);
    const [tailor, setTailor] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        let foundFabric = null;
        let foundTailor = null;

        TAILORS.forEach(t => {
            const f = t.fabrics?.find(f => f.id === parseInt(id));
            if (f) {
                foundFabric = f;
                foundTailor = t;
            }
        });

        setFabric(foundFabric);
        setTailor(foundTailor);
    }, [id]);

    if (!fabric || !tailor) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">Fabric not found</h2>
                <button onClick={() => navigate(-1)} className="mt-4 text-primary font-black uppercase tracking-widest text-xs">Go Back</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8faf9] pb-32 font-sans overflow-x-hidden">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-4 pt-safe flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-800 transition-all active:scale-90"
                >
                    <ArrowLeft size={22} />
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-black text-gray-900 truncate leading-none">Fabric Details</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Stitching Exclusive</p>
                </div>
            </div>

            {/* Product Image */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-200">
                <img
                    src={fabric.image}
                    alt={fabric.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-100 shadow-xl flex items-center gap-1.5">
                        <Tag size={12} className="text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-wider">{fabric.category}</span>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="relative z-10 -mt-10 px-4">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-gray-100"
                >
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2 leading-tight">{fabric.name}</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-black text-primary">₹{fabric.price}</span>
                            <div className="h-4 w-px bg-gray-200" />
                            <div className="flex items-center gap-1.5 text-green-600">
                                <CheckCircle2 size={16} />
                                <span className="text-xs font-black uppercase tracking-widest">In Stock</span>
                            </div>
                        </div>
                    </div>

                    {/* Fabric Specifications */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Fabric Type</span>
                            <span className="text-sm font-black text-gray-900">{fabric.type}</span>
                        </div>
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Quality Status</span>
                            <span className="text-sm font-black text-gray-900">{fabric.quality}</span>
                        </div>
                    </div>

                    {/* Suitability Chips */}
                    <div className="mb-8">
                        <h3 className="text-xs font-black text-gray-900 tracking-widest uppercase mb-3 opacity-40">Best Suited For</h3>
                        <div className="flex flex-wrap gap-2">
                            {fabric.suitability?.map((item, idx) => (
                                <div key={idx} className="bg-white border-2 border-gray-100 px-4 py-2 rounded-xl text-[11px] font-black text-gray-700 uppercase tracking-tight shadow-sm hover:border-primary/20 transition-colors">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Impact */}
                    <div className="mb-8 p-4 bg-amber-50/50 rounded-2xl border border-amber-100 flex items-start gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm shrink-0 border border-amber-100">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">Stock Availability</h4>
                            <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                                {fabric.delivery_delta > 0
                                    ? `This artisan fabric requires ${fabric.delivery_delta} extra days for processing from warehouse.`
                                    : "This fabric is available in-store. Choosing this will save up to 2 days on your total delivery time."}
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xs font-black text-gray-900 tracking-widest uppercase mb-3 opacity-40 flex items-center gap-2">
                            <Info size={14} /> Artisan's Description
                        </h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                            {fabric.description}
                        </p>
                    </div>

                    <div className="h-px bg-gray-100 w-full mb-8" />

                    {/* Tailor Information Section */}
                    <div>
                        <h3 className="text-xs font-black text-gray-900 tracking-widest uppercase mb-4 opacity-40">Artisan Mastermind</h3>
                        <Link to={`/tailor/${tailor.id}`} className="flex items-center gap-4 bg-white p-4 rounded-[2.5rem] border-2 border-gray-50 active:scale-95 transition-transform group shadow-sm hover:border-primary/10">
                            <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 border-white shadow-xl rotate-3 group-hover:rotate-0 transition-all duration-500">
                                <img src={tailor.image} alt={tailor.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <h4 className="font-black text-gray-900 truncate group-hover:text-primary transition-colors">{tailor.name}</h4>
                                    <ShieldCheck size={14} className="text-primary" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-[10px] font-black text-primary bg-[#f2fcf9] px-2 py-0.5 rounded-lg border border-primary/5">
                                        {tailor.rating} <Star size={10} className="fill-current" />
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {tailor.distance} away
                                    </div>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-[#f2fcf9] transition-all">
                                <ChevronRight size={18} />
                            </div>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-white/80 backdrop-blur-xl border-t border-gray-100 z-[40]">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={() => {
                            setTailorInStore(tailor.id, tailor.name);
                            navigate('/services', { state: { selectedFabric: fabric, tailorId: tailor.id, tailorName: tailor.name } });
                        }}
                        className="w-full bg-primary text-white py-4 rounded-2xl shadow-xl shadow-primary/30 font-black text-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                        Book Stitching With This Fabric
                    </button>
                    <p className="text-[10px] text-gray-400 text-center mt-3 font-bold uppercase tracking-widest">Pricing includes fabric + base stitching charges</p>
                </div>
            </div>
        </div>
    );
};

export default FabricDetail;
