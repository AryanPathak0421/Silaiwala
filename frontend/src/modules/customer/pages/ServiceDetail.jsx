import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import BookingStepper from '../components/BookingStepper';
import { ArrowLeft, ChevronDown, ChevronUp, ChevronRight, Clock, ShoppingBag, Ruler, CheckCircle2, ShieldCheck, Info, Tag, Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../utils/cn';
import ServiceHero from '../components/service-detail/ServiceHero';
import DeliverySelector from '../components/service-detail/DeliverySelector';
import MeasurementSelector from '../components/service-detail/MeasurementSelector';
import FabricSelector from '../components/service-detail/FabricSelector';
import DesignUpload from '../components/service-detail/DesignUpload';
import PriceSummary from '../components/service-detail/PriceSummary';
import useCheckoutStore from '../../../store/checkoutStore';
import api from '../../../utils/api';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                className="w-full flex justify-between items-center py-4 text-left group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-[13px] font-bold text-gray-800 group-hover:text-[#1e3932] transition-colors">{question}</span>
                {isOpen ? <ChevronUp size={16} className="text-[#1e3932]" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden"
            >
                <p className="text-[11px] text-gray-500 pb-4 leading-relaxed font-medium">{answer}</p>
            </motion.div>
        </div>
    );
};

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { initializeCheckout, serviceDetails: storedDetails } = useCheckoutStore(state => state);

    const [isLoading, setIsLoading] = useState(true);
    const [serviceData, setServiceData] = useState(null);
    const [preSelectedTailor, setPreSelectedTailor] = useState(null);

    // Initial check for current step based on selections
    const [currentStep, setCurrentStep] = useState('fabric'); // fabric -> details -> review

    const [deliveryType, setDeliveryType] = useState('standard');
    const [measurementType, setMeasurementType] = useState(null);
    const [fabricSource, setFabricSource] = useState(location.state?.fabricSource || 'customer');
    const [selectedFabric, setSelectedFabric] = useState(location.state?.selectedFabric || null);
    const [selectedSavedProfile, setSelectedSavedProfile] = useState(null);
    const [measurements, setMeasurements] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const results = await Promise.allSettled([
                    api.get(`/services/${id}`),
                    (location.state?.tailorId || storedDetails?.tailorId) ? 
                        api.get(`/tailors/${location.state?.tailorId || storedDetails?.tailorId}`) : 
                        Promise.resolve(null)
                ]);

                if (results[0].status === 'fulfilled') {
                    setServiceData(results[0].value.data.data);
                }
                if (results[1].status === 'fulfilled' && results[1].value) {
                    setPreSelectedTailor(results[1].value.data.data);
                }
                
                if (location.state?.selectedFabric) {
                    setFabricSource('platform');
                    setSelectedFabric(location.state.selectedFabric);
                }
            } catch (error) {
                console.error('Failed to fetch service/tailor detail:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, location.state]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-[#1e3932] border-t-transparent rounded-full animate-spin" />
    </div>;

    if (!serviceData) return <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">Service Not Found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-[#1e3932] font-bold">Go Back</button>
    </div>;

    // Pricing Logic
    const basePrice = serviceData.basePrice || 0;
    const deliveryPrice = deliveryType === 'express' ? 150 : (deliveryType === 'premium' ? 350 : 0);
    const fabricPrice = (fabricSource === 'platform' && selectedFabric) ? selectedFabric.price : 0;
    const subtotal = basePrice + deliveryPrice + fabricPrice;
    const taxes = Math.round(subtotal * 0.05);
    const total = subtotal + taxes;

    const getDeliveryDays = () => {
        if (deliveryType === 'express') return 10;
        if (deliveryType === 'premium') return 7;
        return 15;
    }

    const handleProceed = () => {
        initializeCheckout({
            service: serviceData,
            config: { deliveryType, fabricSource, selectedFabric, measurements },
            pricing: { base: basePrice, delivery: deliveryPrice, fabric: fabricPrice, taxes, total, deliveryDays: getDeliveryDays() },
            tailorId: preSelectedTailor?._id || null,
            tailorName: preSelectedTailor?.shopName || preSelectedTailor?.user?.name || null
        });

        if (!preSelectedTailor) navigate('/checkout/tailor');
        else navigate('/checkout/address');
    };

    return (
        <div className="min-h-screen bg-[#f8faf9] pb-40 font-sans">
            {/* 1. Header & Stepper Integration */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl pt-safe">
                <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-all active:scale-90">
                            <ArrowLeft size={22} className="text-gray-900" />
                        </button>
                        <div>
                            <h1 className="text-lg font-black text-gray-900 leading-none">{serviceData.title}</h1>
                            <p className="text-[10px] text-[#1e3932] font-bold uppercase tracking-widest mt-1">Configuring Order</p>
                        </div>
                    </div>
                    {preSelectedTailor && (
                        <div className="flex items-center gap-2 bg-[#f2fcf9] px-3 py-1.5 rounded-xl border border-[#1e3932]/10">
                            <ShieldCheck size={14} className="text-[#1e3932]" />
                            <span className="text-[10px] font-black text-[#1e3932] truncate max-w-[80px]">{preSelectedTailor.shopName || preSelectedTailor.user?.name}</span>
                        </div>
                    )}
                </div>
                <BookingStepper currentStepId={measurements ? 'review' : (measurementType ? 'details' : 'fabric')} />
            </div>

            <div className="max-w-2xl mx-auto px-4 mt-6 space-y-6">

                {/* 2. Fabric Choice - The "Fork" */}
                <section className="animate-in fade-in slide-in-from-bottom-2">
                    <FabricSelector
                        selected={fabricSource}
                        onSelect={setFabricSource}
                        selectedFabric={selectedFabric}
                        onSelectFabric={setSelectedFabric}
                        tailor={preSelectedTailor}
                    />
                </section>

                {/* 3. Measurements Section */}
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <MeasurementSelector
                        selectedType={measurementType}
                        onSelectType={setMeasurementType}
                        onMeasurementComplete={setMeasurements}
                        selectedSavedProfile={selectedSavedProfile}
                        onSelectSavedProfile={setSelectedSavedProfile}
                    />
                </section>

                {/* 4. Delivery Selection */}
                <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <DeliverySelector selected={deliveryType} onSelect={setDeliveryType} />
                </section>

                {/* 5. Additional Info Card */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#1e3932]/5 rounded-xl flex items-center justify-center text-[#1e3932]">
                            <Info size={18} />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Order Policies</h3>
                            <p className="text-[10px] text-gray-400 font-bold">Standard terms of service</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1"><CheckCircle2 size={12} className="text-green-500" /></div>
                            <p className="text-[11px] text-gray-500 font-medium">Free alteration within 7 days of delivery for perfect fitting.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1"><CheckCircle2 size={12} className="text-green-500" /></div>
                            <p className="text-[11px] text-gray-500 font-medium">Free cancellation before tailor picks up your fabric.</p>
                        </div>
                    </div>
                </div>

                {/* 6. FAQ Section */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4 opacity-40">Frequently Asked</h3>
                    <FAQItem question="How do I give my measurements?" answer="You can enter measurements manually, upload a photo of your fitting garment, or request a master visit for home measurements." />
                    <FAQItem question="What if my fabric is short?" answer="The tailor will inspect the fabric upon pickup. If it's insufficient for the design, we'll notify you before cutting." />
                    <FAQItem question="Is GST included?" answer="Yes, all prices shown on the Live Bill include necessary taxes and platform fees." />
                </div>
            </div>

            {/* 7. LIVE BILL - Sticky Transparent Footer */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-gray-100 p-4 pb-safe animate-in slide-in-from-bottom duration-500">
                <div className="max-w-md mx-auto">
                    {/* Live Bill Header - Compact */}
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[9px] font-black text-[#1e3932] uppercase tracking-tighter">Live Bill</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            </div>
                            <h4 className="text-xl font-black text-gray-900 flex items-baseline gap-1 leading-none">
                                ₹{total.toLocaleString()}
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Incl. GST</span>
                            </h4>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">Est. Arrival</p>
                            <div className="flex items-center justify-end gap-1 text-[#1e3932] bg-[#f2fcf9] px-2 py-0.5 rounded-lg border border-[#1e3932]/10">
                                <Clock size={10} />
                                <span className="text-[10px] font-black">{getDeliveryDays()} Days</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Breakdown - Mini Tags */}
                    <div className="flex gap-1.5 overflow-x-auto pb-3 no-scrollbar">
                        <div className="shrink-0 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 flex items-center gap-1.5">
                            <Scissors size={8} className="text-gray-400" />
                            <span className="text-[9px] font-black text-gray-500 uppercase">Stitching: ₹{basePrice}</span>
                        </div>
                        {fabricPrice > 0 && (
                            <div className="shrink-0 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 flex items-center gap-1.5">
                                <ShoppingBag size={8} className="text-gray-400" />
                                <span className="text-[9px] font-black text-gray-500 uppercase">Fabric: ₹{fabricPrice}</span>
                            </div>
                        )}
                        {deliveryPrice > 0 && (
                            <div className="shrink-0 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 flex items-center gap-1.5">
                                <Clock size={8} className="text-gray-400" />
                                <span className="text-[9px] font-black text-gray-500 uppercase">Express: ₹{deliveryPrice}</span>
                            </div>
                        )}
                    </div>

                    {/* Primary Button - Slimmer */}
                    <button
                        onClick={handleProceed}
                        disabled={!measurementType}
                        className={cn(
                            "w-full py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg",
                            measurementType ? "bg-[#1e3932] text-white shadow-[#1e3932]/20 active:scale-[0.98]" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        )}
                    >
                        {measurementType ? (
                            <>Confirm Configuration <ChevronRight size={16} /></>
                        ) : (
                            <>Enter Measurements to Proceed</>
                        )}
                    </button>
                    {measurementType && !measurements && measurementType !== 'saved' && (
                        <p className="text-center text-[8px] text-amber-600 font-black uppercase mt-2 tracking-widest">Action Required: Input details above</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
