import React from 'react';
import { ShieldCheck, ShieldAlert, FileText, ChevronRight, Info } from 'lucide-react';

const VerificationStatus = () => {
    const docs = [
        { name: 'Aadhar Identity', status: 'VERIFIED', icon: <ShieldCheck className="text-green-500" /> },
        { name: 'PAN Card Details', status: 'VERIFIED', icon: <ShieldCheck className="text-green-500" /> },
        { name: 'Shop License', status: 'PENDING', icon: <div className="h-5 w-5 border-2 border-[#1e3932] border-t-transparent rounded-full animate-spin"></div> },
        { name: 'Police Verification', status: 'REJECTED', icon: <ShieldAlert className="text-red-500" />, error: 'Image too blurry' },
    ];

    return (
        <div className="space-y-6 pb-20 animate-in slide-in-from-right duration-500">
            <div className="p-6 bg-[#1e3932] rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                <h4 className="text-[14px] font-black tracking-tighter">Verification Meter</h4>
                <div className="mt-4 flex items-end gap-3">
                    <span className="text-[40px] leading-none font-black italic">65%</span>
                    <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest pb-1">Verification Done</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full mt-5 overflow-hidden">
                    <div className="h-full bg-green-400 rounded-full w-[65%] shadow-[0_0_10px_rgba(74,222,128,0.5)] transition-all duration-1000 ease-out"></div>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Document Registry</h4>
                <div className="space-y-2">
                    {docs.map((doc, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-[1.5rem] border border-gray-50 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shadow-sm border border-gray-50">
                                        {doc.name.includes('Aadhar') ? <FileText size={14} /> : doc.name.includes('PAN') ? <FileText size={14} /> : <FileText size={14} />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-900">{doc.name}</p>
                                        <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${doc.status === 'VERIFIED' ? 'text-green-500' : doc.status === 'REJECTED' ? 'text-red-500' : 'text-orange-500'
                                            }`}>
                                            {doc.status}
                                        </p>
                                    </div>
                                </div>
                                <div className="scale-75">
                                    {doc.icon}
                                </div>
                            </div>
                            {doc.error && (
                                <div className="flex items-center gap-2 p-2.5 bg-red-50 rounded-xl border border-red-100">
                                    <Info size={12} className="text-red-600" />
                                    <p className="text-[9px] font-bold text-red-800 leading-none">Correction Required: {doc.error}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-4">
                <button className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-gray-100 rounded-[1.5rem] text-sm text-gray-900 font-bold hover:bg-gray-50 active:scale-95 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                    <FileText size={16} className="text-[#1e3932]" />
                    View Uploaded Originals
                    <ChevronRight size={16} className="text-gray-300 ml-auto" />
                </button>
            </div>
        </div>
    );
};

export default VerificationStatus;
