import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, FileText, ChevronRight, Info, Loader2 } from 'lucide-react';
import api from '../services/api';

const VerificationStatus = () => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchVerification = async () => {
            try {
                const res = await api.get('/tailors/me');
                if (res.data.success) {
                    setProfile(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching verification status:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVerification();
    }, []);

    if (isLoading) {
        return <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Checking Documents...</p>
        </div>;
    }

    const documents = profile?.documents || [];
    const verifiedCount = documents.filter(doc => doc.status === 'verified').length;
    const progress = documents.length > 0 ? Math.round((verifiedCount / 4) * 100) : 0; // Assuming 4 core docs are needed

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="p-8 bg-primary rounded-[3rem] shadow-[0_20px_50px_rgba(255,92,138,0.3)] text-white relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 h-40 w-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
                <h4 className="text-[14px] font-black tracking-widest uppercase italic opacity-70">Verification Status</h4>
                <div className="mt-6 flex items-end gap-3">
                    <span className="text-[56px] leading-none font-black italic tracking-tighter">{progress}%</span>
                    <span className="text-[10px] font-black text-pink-100 uppercase tracking-[0.2em] pb-2">Complete</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full mt-7 overflow-hidden border border-white/5">
                    <div 
                        className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full shadow-[0_0_20px_rgba(255,92,138,0.5)] transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-4">Digital Registry</h4>
                <div className="space-y-3">
                    {documents.length === 0 ? (
                        <div className="bg-white p-8 rounded-[2rem] border-2 border-dashed border-gray-100 text-center">
                            <p className="text-sm font-bold text-gray-400">No documents uploaded yet.</p>
                        </div>
                    ) : (
                        documents.map((doc, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex flex-col gap-4 hover:border-gray-200 transition-all">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900">{doc.name}</p>
                                            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${
                                                doc.status === 'verified' ? 'text-primary' : 
                                                doc.status === 'rejected' ? 'text-red-500' : 'text-amber-500'
                                            }`}>
                                                {doc.status}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded-xl">
                                        {doc.status === 'verified' ? (
                                            <ShieldCheck className="text-primary" size={20} />
                                        ) : doc.status === 'rejected' ? (
                                            <ShieldAlert className="text-red-500" size={20} />
                                        ) : (
                                            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                    </div>
                                </div>
                                {doc.status === 'rejected' && doc.remarks && (
                                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-2xl border border-red-100">
                                        <Info size={14} className="text-red-600 shrink-0" />
                                        <p className="text-[10px] font-bold text-red-800 leading-tight">Reason: {doc.remarks}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="pt-6">
                <button className="w-full bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 bg-pink-50 rounded-xl flex items-center justify-center text-primary">
                            <FileText size={16} />
                        </div>
                        <span className="text-xs font-black text-gray-700 uppercase tracking-widest">Update Documents</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </button>
            </div>
        </div>
    );
};

export default VerificationStatus;
