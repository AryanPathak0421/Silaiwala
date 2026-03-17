import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CreditCard, Lock, ShieldCheck, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import useCheckoutStore from '../../../store/checkoutStore';
import useAddressStore from '../../../store/userStore';
import useCartStore from '../../../store/cartStore';
import BillDetails from '../components/checkout/summary/BillDetails';
import ServiceReviewCard from '../components/checkout/summary/ServiceReviewCard';
import { cn } from '../../../utils/cn';

import useOrderStore from '../../../store/orderStore';

const CheckoutSummary = () => {
    const navigate = useNavigate();
    const { serviceDetails, configuration, pricing } = useCheckoutStore(state => state);
    const { items: cartItems, getTotalPrice, clearCart } = useCartStore(state => state);
    const selectedAddress = useAddressStore(state => state.getSelectedAddress());

    const addOrder = useOrderStore(state => state.addOrder);
    const clearCheckout = useCheckoutStore(state => state.clearCheckout);

    const isServiceCheckout = !!serviceDetails;
    const isCartCheckout = cartItems.length > 0;

    const [isProcessing, setIsProcessing] = useState(false);

    // Redirect if session data missing
    useEffect(() => {
        if (isProcessing) return; // Don't redirect while processing/navigating

        if (!selectedAddress) {
            navigate('/checkout/address');
            return;
        }
        if (!isServiceCheckout && !isCartCheckout) {
            navigate('/store'); // Navigate to store instead of services if empty
        }
    }, [isServiceCheckout, isCartCheckout, selectedAddress, navigate, isProcessing]);

    if ((!isServiceCheckout && !isCartCheckout && !isProcessing) || !selectedAddress) return null;

    const currentPricing = isServiceCheckout ? pricing : {
        total: getTotalPrice(),
        base: getTotalPrice(),
        taxes: 0,
        delivery: getTotalPrice() > 999 ? 0 : 49
    };

    // Recalculate total for cart (including delivery/platform fee if needed)
    // For simplicity, reusing logic
    const finalTotal = isServiceCheckout ? pricing.total + 10 : currentPricing.total + currentPricing.delivery;

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            let payload;
            if (isServiceCheckout) {
                payload = {
                    tailorId: serviceDetails.tailorId,
                    items: [{
                        service: serviceDetails.id,
                        fabricSource: configuration.fabricSource,
                        deliveryType: configuration.deliveryType,
                        selectedFabric: configuration.selectedFabric?._id,
                        quantity: 1,
                        price: pricing.base,
                        measurements: configuration.measurements
                    }],
                    totalAmount: finalTotal,
                    deliveryAddress: {
                        street: selectedAddress.street,
                        city: selectedAddress.city,
                        state: selectedAddress.state || '',
                        zipCode: selectedAddress.zipCode
                    }
                };
            } else {
                // Cart Order (Products)
                // For cart orders, we assume items might be from different tailors, 
                // but the current Order model requires a single tailor field.
                // As a simplification, we use the tailor from the first item or a platform default.
                const firstItemTailor = cartItems[0]?.tailor; 
                
                payload = {
                    tailorId: firstItemTailor,
                    items: cartItems.map(item => ({
                        product: item._id,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    totalAmount: finalTotal,
                    deliveryAddress: {
                        street: selectedAddress.street,
                        city: selectedAddress.city,
                        state: selectedAddress.state || '',
                        zipCode: selectedAddress.zipCode
                    }
                };
            }

            const response = await api.post('/orders', payload);
            
            if (response.data.success) {
                const order = response.data.data;
                if (isServiceCheckout) {
                    clearCheckout();
                } else {
                    clearCart();
                }
                navigate('/checkout/success', { 
                    state: { 
                        orderId: order._id, 
                        orderNumber: order.orderId 
                    } 
                });
            }
        } catch (error) {
            console.error('Payment failed:', error);
            alert(error.response?.data?.message || 'Order placement failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32 font-sans text-gray-900">
            {/* 1. Header */}
            <div className="sticky top-0 z-50 bg-[#1e3932] shadow-md border-b border-[#1e3932] px-4 py-3 flex items-center gap-3 pt-safe">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h1 className="text-sm font-bold text-white">Order Summary</h1>
                    <p className="text-[10px] text-gray-300">Step 3 of 3</p>
                </div>
            </div>

            <div className="max-w-xl mx-auto p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">

                {/* 2. Review Section */}
                {isServiceCheckout ? (
                    <ServiceReviewCard
                        service={serviceDetails}
                        config={configuration}
                    />
                ) : (
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-3">Cart Items ({cartItems.length})</h3>
                        <div className="space-y-3">
                            {cartItems.map((item) => (
                                <div key={item.cartId} className="flex gap-3">
                                    <div className="w-12 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                                        <img src={item.images?.[0] || item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                                        <p className="text-[10px] text-gray-500">Size: {item.selectedSize} • {item.selectedColor}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs font-bold text-[#1e3932]">₹{item.price}</span>
                                            <span className="text-[10px] text-gray-400">Qty: {item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. Address Preview */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <MapPin size={14} className="text-[#1e3932]" />
                            Delivery Address
                        </h3>
                        <button
                            onClick={() => navigate('/checkout/address')}
                            className="text-[10px] font-bold text-[#1e3932] uppercase tracking-wider hover:underline"
                        >
                            Change
                        </button>
                    </div>
                    {/* Render minimal address view */}
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-600 leading-relaxed">
                        <p className="font-bold text-gray-900 mb-1">{selectedAddress?.receiverName} ({selectedAddress?.type})</p>
                        <p>{selectedAddress?.street}, {selectedAddress?.city} - {selectedAddress?.zipCode}</p>
                        <p className="mt-1 font-medium">Phone: {selectedAddress?.phone}</p>
                    </div>
                </div>

                {/* 4. Bill Details */}
                <BillDetails pricing={currentPricing} />

                {/* 5. Payment Method (Mock) */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <CreditCard size={14} className="text-[#1e3932]" />
                        Running Payment
                    </h3>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3 cursor-not-allowed opacity-70">
                        <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center">
                            <span className="font-bold text-[10px]">UPI</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-gray-900">Razorpay Secure</p>
                            <p className="text-[10px] text-gray-500">All UPI, Cards & Netbanking</p>
                        </div>
                        <Lock size={12} className="text-gray-400" />
                    </div>
                    <div className="mt-2 text-[10px] text-center text-gray-400 flex items-center justify-center gap-1">
                        <ShieldCheck size={10} />
                        100% Safe & Secure Payments by Razorpay
                    </div>
                </div>

            </div>

            {/* 6. Sticky Footer Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-safe z-40 md:static md:bg-transparent md:border-t-0 md:p-0">
                <div className="max-w-xl mx-auto md:p-4">
                    <button
                        onClick={handlePayment}
                        className="w-full py-3.5 rounded-full bg-[#1e3932] text-white text-sm font-bold shadow-lg shadow-[#1e3932]/20 hover:bg-[#152e28] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        Pay ₹{finalTotal} <ArrowRight size={16} />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default CheckoutSummary;
