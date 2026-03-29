import React, { useState } from 'react';
import { Truck, Search } from 'lucide-react';
import { cn } from '../../../../../utils/cn';

const DeliveryCheck = () => {
    const [pincode, setPincode] = useState('');
    const [deliveryStatus, setDeliveryStatus] = useState(null); // 'checking', 'available', 'unavailable'
    const [message, setMessage] = useState('');

    const handleCheck = () => {
        if (!pincode || pincode.length !== 6) {
            setMessage('Please enter a valid 6-digit pincode');
            setDeliveryStatus('unavailable');
            return;
        }

        setDeliveryStatus('checking');
        setTimeout(() => {
            // Mock logic
            if (pincode.startsWith('1')) {
                setDeliveryStatus('available');
                setMessage('Delivery available by Feb 18');
            } else {
                setDeliveryStatus('unavailable');
                setMessage('Sorry, we do not deliver to this location yet.');
            }
        }, 1000);
    };

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Truck className="h-4 w-4" /> Check Delivery
            </h3>

            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Enter Pincode"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                    />
                    {deliveryStatus === 'checking' && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin h-4 w-4 border-2 border-gray-300 border-t-primary rounded-full"></div>
                    )}
                </div>
                <button
                    onClick={handleCheck}
                    disabled={deliveryStatus === 'checking'}
                    className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-md hover:bg-primary-dark disabled:opacity-70 transition-colors"
                >
                    Check
                </button>
            </div>

            {/* Result Message */}
            {message && (
                <p className={cn(
                    "mt-2 text-xs font-medium flex items-center gap-1",
                    deliveryStatus === 'available' ? "text-green-700" : "text-red-600"
                )}>
                    {deliveryStatus === 'available' ? '✔' : '❌'} {message}
                </p>
            )}
        </div>
    );
};

export default DeliveryCheck;
