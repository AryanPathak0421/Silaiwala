import React, { useState } from 'react';
import { ArrowLeft, Bell, MessageSquare, Tag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        type: 'order',
        title: 'New Order Request',
        message: 'You have received a new order from Anjali R. for Kurti Stitching.',
        time: '2 mins ago',
        read: false,
        icon: <Bell size={18} className="text-[#1e3932]" />,
        bg: 'bg-green-50'
    },
    {
        id: 2,
        type: 'system',
        title: 'Withdrawal Successful',
        message: '₹4,500 has been transferred to your connected HDFC bank account.',
        time: '2 hours ago',
        read: false,
        icon: <AlertCircle size={18} className="text-blue-600" />,
        bg: 'bg-blue-50'
    },
    {
        id: 3,
        type: 'promo',
        title: 'Premium Subscription Offer',
        message: 'Upgrade to Premium today and get 50% more visibility in your area!',
        time: '1 day ago',
        read: true,
        icon: <Tag size={18} className="text-orange-600" />,
        bg: 'bg-orange-50'
    },
    {
        id: 4,
        type: 'message',
        title: 'Message from Suresh M.',
        message: '"Hi, can you make the sleeves a bit tighter?"',
        time: '2 days ago',
        read: true,
        icon: <MessageSquare size={18} className="text-purple-600" />,
        bg: 'bg-purple-50'
    }
];

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

    const markAllAsRead = () => {
        setNotifications(current => current.map(n => ({ ...n, read: true })));
    };

    const hasUnread = notifications.some(n => !n.read);

    return (
        <div className="min-h-full bg-gray-50 flex flex-col relative animate-in fade-in duration-300">
            {/* Header */}
            <div className="bg-white px-5 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-black text-gray-900 tracking-tight">Notifications</h1>
                </div>
                {hasUnread ? (
                    <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-black text-[#1e3932] uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-lg active:scale-95 transition-all hover:bg-[#1e3932] hover:text-white"
                    >
                        Mark All Read
                    </button>
                ) : (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg">
                        <CheckCircle2 size={12} /> All Caught Up
                    </div>
                )}
            </div>

            <div className="flex-1 p-5">
                <div className="space-y-3">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`p-4 rounded-[1.25rem] border transition-all flex gap-4 ${notif.read ? 'bg-white border-gray-100 opacity-75' : 'bg-white border-green-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)]'} relative`}
                        >
                            {!notif.read && (
                                <div className="absolute top-4 right-4 h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                            )}
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${notif.bg}`}>
                                {notif.icon}
                            </div>
                            <div className="flex-1 pr-4">
                                <h3 className="text-sm font-black text-gray-900 leading-tight mb-1">{notif.title}</h3>
                                <p className="text-xs font-medium text-gray-500 leading-snug line-clamp-2">{notif.message}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">{notif.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
