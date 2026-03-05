import React, { useState } from 'react';
import { ArrowLeft, Edit2, History, Bell, MapPin, Shield, LogOut, ChevronRight, FileText, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from '../components/UIElements';

const ProfileSettings = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [activeModal, setActiveModal] = useState(null); // 'pickup', 'terms', 'privacy'
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Profile details saved successfully!");
            setIsEditing(false);
        }, 800);
    };

    const menuOptions = [
        { icon: <Edit2 size={20} />, label: 'Edit Profile', action: () => setIsEditing(true) },
        { icon: <History size={20} />, label: 'Order History', path: '/tailor/orders' },
        { icon: <Bell size={20} />, label: 'Notifications', path: '/tailor/notifications' },
        { icon: <MapPin size={20} />, label: 'Pick Up Information', action: () => setActiveModal('pickup') },
        { icon: <FileText size={20} />, label: 'Terms & Conditions', action: () => setActiveModal('terms') },
        { icon: <Shield size={20} />, label: 'Privacy & Security', action: () => setActiveModal('privacy') },
    ];

    const renderModalContent = () => {
        switch (activeModal) {
            case 'pickup':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-black text-gray-900">Pick Up Information</h3>
                        <p className="text-sm text-gray-600">Default pickup location is your registered shop address. Delivery partners will arrive between 10 AM - 6 PM.</p>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-xs font-bold text-[#1e3932] uppercase tracking-widest mb-1">Current Address</p>
                            <p className="text-sm font-medium text-gray-800">123 Main St, Bandra West, Mumbai</p>
                        </div>
                    </div>
                );
            case 'terms':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-black text-gray-900">Terms & Conditions</h3>
                        <div className="text-xs text-gray-600 space-y-2 h-48 overflow-y-auto custom-scrollbar pr-2 leading-relaxed">
                            <p>1. By using TailorHub, you agree to fulfill all accepted orders within the specified deadline.</p>
                            <p>2. Royal Stitches is responsible for the fabric quality if provided by the shop.</p>
                            <p>3. Payments are processed every Friday for completed orders.</p>
                            <p>4. Platform commission is fixed at 12% per transaction.</p>
                        </div>
                    </div>
                );
            case 'privacy':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-black text-gray-900">Privacy & Security</h3>
                        <div className="space-y-3">
                            <Button onClick={() => alert("Change Password dialog opened")} variant="secondary" className="text-xs py-3 border-gray-200">Change Password</Button>
                            <Button onClick={() => alert("Manage Devices dialog opened")} variant="secondary" className="text-xs py-3 border-gray-200">Manage Devices</Button>
                            <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-start gap-2">
                                <Shield size={16} className="text-red-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-red-700 leading-tight">Your data is fully encrypted. We never share your shop financials with third parties.</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-full bg-gray-50 flex flex-col relative animate-in fade-in duration-300 pb-20">
            {/* Curved Header */}
            <div className={`relative bg-[#1e3932] pt-8 ${isEditing ? 'pb-24' : 'pb-32'} px-5 text-white overflow-hidden shrink-0 shadow-xl shadow-green-900/10 transition-all duration-300`}>
                <div className="absolute inset-0 z-0 opacity-20 Mix-blend-overlay pointer-events-none">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-white">
                        <path d="M0,100 C40,80 60,0 100,0 L100,100 Z" />
                    </svg>
                </div>

                <div className="relative z-10 flex items-center justify-between mb-2">
                    <button onClick={() => isEditing ? setIsEditing(false) : navigate(-1)} className="p-2 -ml-2 text-white hover:text-green-100 transition-colors">
                        {isEditing ? <X size={20} /> : <ArrowLeft size={20} />}
                    </button>
                    <h1 className="text-lg font-black tracking-tight absolute left-1/2 -translate-x-1/2">
                        {isEditing ? 'Edit Profile' : 'Profile'}
                    </h1>
                    <div className="w-10"></div>
                </div>

                <div className="absolute -bottom-1 left-0 w-full leading-none">
                    <svg className="w-full h-16 text-gray-50 fill-current" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0,20 C30,0 70,0 100,20 L100,20 L0,20 Z" />
                    </svg>
                </div>
            </div>

            {/* Avatar Container */}
            {!isEditing && (
                <div className="relative z-20 flex flex-col items-center -mt-20 mb-8 px-5 animate-in zoom-in duration-300">
                    <div className="h-[5.5rem] w-[5.5rem] bg-white p-1 rounded-full shadow-lg mb-4 pointer-events-none">
                        <div className="w-full h-full bg-[#1e3932] rounded-full flex flex-col items-center justify-center text-white relative overflow-hidden pointer-events-auto">
                            <span className="text-3xl font-black">R</span>
                            <div
                                className="absolute bottom-0 w-full bg-black/20 py-1 text-center cursor-pointer hover:bg-black/30 transition-colors"
                                onClick={() => setIsEditing(true)}
                            >
                                <Edit2 size={10} className="mx-auto text-white/90" />
                            </div>
                        </div>
                    </div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Royal Stitches</h2>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Premium Tailor</p>
                </div>
            )}

            {isEditing ? (
                /* Compacted Edit Form */
                <div className="px-5 flex-1 pb-10 relative z-20 -mt-10 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-white p-5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-6">
                        <div className="space-y-3">
                            <Input label="Shop Name" defaultValue="Royal Stitches" />
                            <Input label="Owner Name" defaultValue="Rahul Kumar" />
                            <Input label="Email Address" type="email" defaultValue="rahul@royalstitches.com" />
                            <Input label="Contact Number" type="tel" defaultValue="+91 9876543210" />
                            <Input label="Shop Address" defaultValue="123 Main St, Bandra West, Mumbai" />
                        </div>
                    </div>
                    <Button onClick={handleSave} loading={isSaving} className="py-4 shadow-xl shadow-green-900/10 transition-all">
                        <Save size={18} /> Save Changes
                    </Button>
                </div>
            ) : (
                /* Menu List */
                <div className="px-5 space-y-3 flex-1 pb-10 animate-in fade-in duration-300">
                    {menuOptions.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => item.action ? item.action() : navigate(item.path)}
                            className="w-full bg-white p-4 rounded-[1.25rem] border border-gray-100/50 shadow-[0_2px_15px_rgb(0,0,0,0.03)] flex items-center justify-between hover:border-gray-200 transition-all group active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="text-gray-400 group-hover:text-[#1e3932] transition-colors">
                                    {item.icon}
                                </div>
                                <span className="text-sm font-bold text-gray-700 tracking-tight">{item.label}</span>
                            </div>
                            <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                        </button>
                    ))}

                    <button
                        onClick={() => navigate('/tailor/login')}
                        className="w-full bg-white p-4 rounded-[1.25rem] border border-gray-100/50 shadow-[0_2px_15px_rgb(0,0,0,0.03)] flex items-center justify-between hover:border-red-100 transition-all group active:scale-[0.98] mt-6 relative z-10"
                    >
                        <div className="flex items-center gap-4">
                            <div className="text-red-400 group-hover:text-red-500 transition-colors">
                                <LogOut size={20} />
                            </div>
                            <span className="text-sm font-bold text-red-500 tracking-tight">Logout</span>
                        </div>
                    </button>
                </div>
            )}

            {/* Modals for Pickup, Terms, Privacy */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-[450px] rounded-t-[2rem] sm:rounded-[2rem] p-6 animate-in slide-in-from-bottom flex flex-col max-h-[85vh]">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden"></div>
                        <div className="flex justify-end mb-2">
                            <button onClick={() => setActiveModal(null)} className="p-2 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {renderModalContent()}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <Button onClick={() => setActiveModal(null)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSettings;
