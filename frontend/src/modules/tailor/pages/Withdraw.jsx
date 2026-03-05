import React, { useState } from 'react';
import { ArrowLeft, Check, Delete } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Withdraw = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('0');
    const [step, setStep] = useState(1); // 1: Input, 2: Success

    const availableBalance = 14500;
    const numAmount = parseInt(amount.replace(/,/g, '') || '0', 10);

    const handleKeyPress = (key) => {
        if (amount === '0') {
            setAmount(key);
        } else if (amount.replace(/,/g, '').length < 6) { // limit to reasonable length
            const newAmountStr = amount.replace(/,/g, '') + key;
            setAmount(parseInt(newAmountStr, 10).toLocaleString('en-IN'));
        }
    };

    const handleDelete = () => {
        const rawAmount = amount.replace(/,/g, '');
        if (rawAmount.length <= 1) {
            setAmount('0');
        } else {
            const newAmountStr = rawAmount.slice(0, -1);
            setAmount(parseInt(newAmountStr, 10).toLocaleString('en-IN'));
        }
    };

    if (step === 2) {
        return (
            <div className="min-h-full bg-[#1e3932] flex items-center justify-center p-6 animate-in zoom-in duration-300">
                <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl flex flex-col items-center">
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-[#1e3932] shadow-inner">
                        <Check size={40} strokeWidth={3} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Withdrawal Initiated</h2>
                    <p className="text-gray-500 font-medium text-sm mt-3">
                        ₹{amount} is being processed. It will reflect in your registered bank account in 2-3 hours.
                    </p>
                    <button
                        onClick={() => navigate('/tailor')}
                        className="mt-8 w-full bg-[#1e3932] text-white py-4 rounded-[1.25rem] font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-[#1e3932] flex flex-col relative animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-5 py-6 flex items-center justify-between sticky top-0 z-10 text-white">
                <button onClick={() => navigate(-1)} className="h-10 w-10 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-colors border border-white/10">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-black tracking-tight">Withdraw</h1>
                <div className="w-10"></div> {/* Spacer for alignment */}
            </div>

            {/* Input Section (Top Half) */}
            <div className="flex-1 flex flex-col items-center justify-center -mt-10">
                <p className="text-green-100/70 font-bold uppercase tracking-widest text-[10px] mb-2">Available: ₹14,500</p>
                <div className="flex items-center text-white">
                    <span className="text-4xl font-light opacity-80 mr-1">₹</span>
                    <span className="text-[3.5rem] font-black tracking-tight">{amount}</span>
                </div>
                {numAmount > availableBalance && (
                    <div className="bg-red-500/20 text-red-200 px-4 py-2 rounded-xl text-xs font-bold mt-4 animate-in fade-in slide-in-from-bottom-2">
                        Insufficient balance
                    </div>
                )}
            </div>

            {/* Numpad Section (Bottom Half) */}
            <div className="bg-white rounded-t-[2.5rem] px-6 py-8 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] shrink-0">
                <div className="grid grid-cols-3 gap-x-6 gap-y-4 mb-8 max-w-[320px] mx-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleKeyPress(num.toString())}
                            className="h-16 rounded-[1.25rem] text-3xl font-black text-gray-900 active:bg-gray-100 transition-colors flex items-center justify-center"
                        >
                            {num}
                        </button>
                    ))}
                    <button className="h-16 rounded-[1.25rem] active:bg-gray-100 transition-colors flex items-center justify-center text-gray-400">
                        {/* Empty placeholder */}
                    </button>
                    <button
                        onClick={() => handleKeyPress('0')}
                        className="h-16 rounded-[1.25rem] text-3xl font-black text-gray-900 active:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                        0
                    </button>
                    <button
                        onClick={handleDelete}
                        className="h-16 rounded-[1.25rem] active:bg-gray-100 transition-colors flex items-center justify-center text-gray-500 hover:text-red-500"
                    >
                        <Delete size={28} />
                    </button>
                </div>

                <div className="max-w-[320px] mx-auto pb-4">
                    <button
                        onClick={() => setStep(2)}
                        disabled={numAmount === 0 || numAmount > availableBalance}
                        className="w-full bg-[#1e3932] text-white py-4 rounded-[1.25rem] font-black uppercase tracking-widest text-sm shadow-xl shadow-green-900/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center"
                    >
                        Send Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Withdraw;
