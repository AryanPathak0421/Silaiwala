import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Truck,
    Package,
    IndianRupee,
    ArrowUpRight,
    MapPin,
    Clock,
    ChevronRight,
    TrendingUp,
    CheckCircle2,
    X,
    Navigation,
    Loader2,
    Store,
    AlertCircle,
    User,
    ChevronLeft,
    ShieldCheck,
    PhoneCall,
    Info
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { SOCKET_URL } from '../../../../config/constants';
import useAuthStore from '../../../../store/authStore';
import deliveryService from '../../services/deliveryService';
import { io } from 'socket.io-client';
import { Power } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DeliveryDashboard = () => {
    const navigate = useNavigate();
    const { isOnline } = useOutletContext() || { isOnline: true };
    const { user } = useAuthStore();
    const [showMapModal, setShowMapModal] = useState(false);
    const [selectedAvailableTask, setSelectedAvailableTask] = useState(null);
    const [isAccepting, setIsAccepting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        profile: null,
        activeOrders: [],
        availableOrders: [],
        stats: {
            activeTasks: 0,
            earnings: 0,
            totalPickups: 0
        }
    });

    const fetchDashboardData = async () => {
        try {
            const [statsRes, ordersRes, availableRes] = await Promise.all([
                deliveryService.getStats(),
                deliveryService.getAssignedOrders(),
                deliveryService.getAvailableOrders()
            ]);

            if (statsRes.success && ordersRes.success && availableRes.success) {
                setDashboardData({
                    profile: {
                        rating: statsRes.data.rating,
                        isAvailable: statsRes.data.isAvailable,
                        totalDeliveries: statsRes.data.totalDeliveries
                    },
                    activeOrders: ordersRes.data,
                    availableOrders: availableRes.data,
                    stats: {
                        activeTasks: statsRes.data.activeDeliveries,
                        earnings: statsRes.data.totalEarnings,
                        totalPickups: statsRes.data.totalDeliveries
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        const socket = io(SOCKET_URL);
        
        // Join delivery fleet and personal room
        socket.emit('join', 'delivery_partners');
        if (user?._id) {
            socket.emit('join', `user_${user._id}`);
        }

        socket.on('new_task', (data) => {
            toast.success('New delivery task available!', { icon: '🚚' });
            fetchDashboardData();
        });

        socket.on('new_notification', (data) => {
            toast(data.message, { icon: '🔔' });
            fetchDashboardData();
        });

        return () => {
            socket.disconnect();
        };
    }, [user?._id]);

    const handleAcceptTask = async (orderId) => {
        setIsAccepting(true);
        try {
            const res = await deliveryService.acceptOrder(orderId);
            if (res.success) {
                toast.success('Task accepted successfully!');
                setSelectedAvailableTask(null);
                fetchDashboardData();
                // Optionally navigate to tasks page
                // navigate('/delivery/tasks');
            } else {
                toast.error(res.message || 'Failed to accept task');
            }
        } catch (error) {
            console.error('Error accepting task:', error);
            toast.error('Failed to accept task');
        } finally {
            setIsAccepting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-800 animate-spin" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Dashboard...</p>
            </div>
        );
    }

    const { stats: dashboardStats, activeOrders, availableOrders, profile } = dashboardData;
    
    const stats = [
        { label: 'Active Tasks', value: dashboardStats.activeTasks.toString().padStart(2, '0'), icon: Truck, color: 'bg-emerald-800', trend: 'In Progress' },
        { label: 'Wallet Balance', value: `₹${dashboardStats.earnings}`, icon: IndianRupee, color: 'bg-emerald-800', trend: 'Earnings' },
        { label: 'Total Deliveries', value: dashboardStats.totalPickups.toString().padStart(2, '0'), icon: Package, color: 'bg-slate-900', trend: 'Completed' },
    ];

    const formatAddress = (addr) => {
        if (!addr) return 'Address not specified';
        if (typeof addr === 'string') return addr;
        const parts = [addr.street, addr.city, addr.state, addr.zipCode].filter(Boolean);
        return parts.join(', ') || 'Address not specified';
    };

    const getTaskType = (status) => {
        if (status.includes('fabric')) return 'Fabric Pickup';
        if (status === 'ready-for-pickup' || status === 'out-for-delivery') return 'Final Delivery';
        return 'General Task';
    };

    const getTaskLabel = (status) => {
        if (status === 'fabric-ready-for-pickup') return 'PICKUP FROM CUSTOMER';
        if (status === 'ready-for-pickup') return 'PICKUP FROM TAILOR';
        if (status === 'out-for-delivery') return 'DROP TO CUSTOMER';
        return status.replace(/-/g, ' ').toUpperCase();
    };

    const getTaskAddress = (task) => {
        // If it's a fabric pickup, destination is the TAILOR (to deliver the fabric)
        // If it's the final delivery, destination is the CUSTOMER
        if (task.status.includes('fabric')) return formatAddress(task.tailor?.address) || 'Artisan Workshop';
        return formatAddress(task.deliveryAddress);
    };

    const currentTask = activeOrders.length > 0 ? activeOrders[0] : null;
    const upcomingTasks = activeOrders.slice(1);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-8">
            {/* Greeting Header */}
            <div>
                <div className="flex items-center gap-3 text-emerald-800 mb-1">
                    <div className="h-px w-8 bg-emerald-200"></div>
                    <span className="text-[11px] font-black tracking-[0.2em] opacity-80 uppercase">Partner Command</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                    <div>
                        Ready to <span className="text-slate-400">Move</span>, <br />
                        Partner {user?.name.split(' ')[0] || 'Partner'}?
                    </div>
                    {user?.isVerified && (
                        <div className="bg-emerald-50 p-2 rounded-2xl border border-emerald-100 shadow-sm self-start mt-1">
                            <ShieldCheck size={20} className="text-emerald-800 fill-white" />
                        </div>
                    )}
                </h1>
            </div>

            {!isOnline && (
                <div className="bg-white p-10 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center space-y-6 shadow-sm animate-in fade-in zoom-in duration-700">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto border border-slate-100 shadow-inner">
                        <Power size={40} className="opacity-40" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">System Hibernated</h3>
                        <p className="text-slate-500 text-sm font-medium tracking-wide leading-relaxed max-w-[240px] mx-auto">Toggle your status to <span className="text-emerald-800 font-bold">ONLINE</span> in the header to start receiving dispatch requests.</p>
                    </div>
                </div>
            )}

            {isOnline && (
                <>
                {/* Quick Pulse Stats */}
                <div className="grid grid-cols-1">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-4 lg:p-5 rounded-[1.25rem] border border-slate-200 min-w-[calc(50%-6px)] shadow-md flex flex-col justify-between shrink-0"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <p className="text-[11px] font-bold text-[#3B4254] tracking-wide leading-tight w-min capitalize">{stat.label}</p>
                                <span className={`text-[9px] ml-auto font-black leading-none px-2 py-1.5 rounded-md w-max capitalize ${idx === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <h3 className="text-2xl lg:text-[28px] font-black text-slate-900 tracking-tight">{stat.value}</h3>
                                <div className={`w-10 h-10 rounded-[1rem] flex items-center justify-center ${idx === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                                    <stat.icon size={20} strokeWidth={2.5} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Active Task Hero Card */}
            {currentTask ? (
                <div className="relative group w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0">
                    <div className="absolute -inset-1 bg-gradient-to-r from-slate-700 to-slate-900 rounded-[1.25rem] blur-lg opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative bg-[#142921] rounded-[1.25rem] overflow-hidden text-white shadow-xl mx-1 border border-white/5">
                        <div className="p-5 lg:p-6">
                            <div className="flex justify-between items-start mb-5">
                                <div className="space-y-1.5">
                                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 rounded-md border border-white/10">
                                        <div className="w-1.5 h-1.5 bg-emerald-800 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] font-bold tracking-wider text-[#e2e4e9] capitalize">Active Dispatch</span>
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight text-white mt-1 capitalize">{getTaskType(currentTask.status)}</h2>
                                </div>
                                <div className="w-11 h-11 bg-white/5 backdrop-blur-md rounded-[0.8rem] flex items-center justify-center border border-white/10 mt-1">
                                    <Truck size={22} className="text-white/80" />
                                </div>
                            </div>

                            <div className="relative z-10 flex flex-col mt-2">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-800/30 bg-transparent z-10"></div>
                                        <div className="w-px h-6 bg-emerald-800/30 border-dashed border-l border-emerald-800/40"></div>
                                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-800 z-10 border-2 border-emerald-800/30"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                            <span className="text-[9px] font-black text-white/50 uppercase tracking-widest leading-none">
                                                {currentTask.status === 'out-for-delivery' ? 'Recipient' : 'Source'}
                                            </span>
                                        </div>
                                        <p className="text-[15px] font-black text-white truncate leading-none mb-1.5">
                                            {currentTask.status === 'out-for-delivery' 
                                                ? currentTask.customer?.name 
                                                : (currentTask.status === 'fabric-ready-for-pickup' ? currentTask.customer?.name : currentTask.tailor?.shopName)}
                                        </p>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-[10px] text-white/50 font-bold truncate leading-tight">
                                                {currentTask.status === 'out-for-delivery' 
                                                    ? formatAddress(currentTask.deliveryAddress) 
                                                    : (currentTask.status === 'fabric-ready-for-pickup' ? formatAddress(currentTask.customer?.address) : formatAddress(currentTask.tailor?.address))}
                                            </p>
                                            <p className="text-[10px] text-emerald-400/80 font-black tracking-widest mt-1">
                                                {currentTask.status === 'out-for-delivery' 
                                                    ? currentTask.customer?.phoneNumber 
                                                    : (currentTask.status === 'fabric-ready-for-pickup' ? currentTask.customer?.phoneNumber : currentTask.tailor?.phone)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-0">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-emerald-800/80" />
                                        <span className="text-[11px] font-bold tracking-wider text-slate-300 capitalize">Arriving Soon</span>
                                    </div>
                                    <button
                                        onClick={() => setShowMapModal(true)}
                                        className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold text-[12px] capitalize hover:scale-105 transition-all"
                                    >
                                        Open Map
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[1.25rem] p-8 text-center overscroll-none">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-300 mx-auto mb-3 shadow-sm">
                        <Package size={24} />
                    </div>
                    {availableOrders.length > 0 ? (
                        <div className="space-y-4">
                            <p className="text-slate-600 font-bold text-sm">You have no active tasks, but there are <span className="text-emerald-800">{availableOrders.length} live orders</span> waiting!</p>
                            <button 
                                onClick={() => navigate('/delivery/tasks')}
                                className="px-6 py-2 bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-900/20"
                            >
                                View Live Pool
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="text-slate-500 font-bold text-sm">No active tasks at the moment.</p>
                            <p className="text-slate-400 text-xs mt-1">Check back later for new dispatches.</p>
                        </>
                    )}
                </div>
            )}

            {/* Live Orders Available section (Horizontal scroll) */}
            {isOnline && availableOrders.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                             <h2 className="text-lg font-black text-slate-900 tracking-tight capitalize">Live <span className="text-emerald-800">Available</span> Tasks</h2>
                        </div>
                        <button onClick={() => navigate('/delivery/tasks')} className="text-[10px] font-black text-emerald-800 uppercase tracking-widest hover:underline">See All</button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1 -mx-1">
                        {availableOrders.slice(0, 5).map((order) => (
                            <motion.div 
                                key={order._id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedAvailableTask(order)}
                                className="min-w-[240px] bg-gradient-to-br from-white to-slate-50/50 p-4 rounded-[1.25rem] border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer group hover:border-emerald-200 hover:shadow-md transition-all"
                            >
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase tracking-wider">{getTaskType(order.status)}</span>
                                        <span className="text-[9px] font-bold text-slate-400">₹{order.totalAmount || '--'}</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup From</p>
                                        <p className="text-xs font-bold text-slate-800 truncate">{order.status.includes('fabric') ? order.customer?.name : order.tailor?.shopName}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                        <Navigation size={12} className="text-emerald-800" /> Nearby
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-800 group-hover:translate-x-1 transition-transform">View Details →</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Today's upcoming Tasks */}
            {upcomingTasks.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-black text-slate-900 tracking-tight capitalize">Upcoming <span className="text-slate-400">Tasks</span></h2>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1 -mx-1">
                        {upcomingTasks.map((task) => (
                            <div key={task._id} className="min-w-[280px] flex-1 bg-white py-4 px-4 rounded-[1rem] border-2 border-slate-100 shadow-sm flex items-center justify-between group hover:border-slate-200 active:bg-slate-50/50 transition-all cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 bg-slate-50 rounded-[0.8rem] flex items-center justify-center text-slate-500 group-active:text-slate-600 group-active:bg-slate-100/50 shrink-0">
                                        <MapPin size={20} className="stroke-[2.5px]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[14px] font-black text-slate-800 tracking-tight leading-none mb-1.5 capitalize">{getTaskType(task.status)}</p>
                                        <p className="text-[11px] text-slate-500 font-bold tracking-wide truncate max-w-[140px] capitalize">{getTaskAddress(task)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Activity Stream - Simplified for now */}
            <div className="space-y-3 pt-3">
                <div className="flex items-center justify-between px-1 pb-1">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight capitalize">Recent Activity <span className="text-slate-400">History</span></h2>
                </div>
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[1rem] p-6 text-center">
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">No activities to show</p>
                </div>
            </div>

            {/* Dummy Map Modal */}
            <AnimatePresence>
                {showMapModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-slate-900/60 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="bg-white rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-md overflow-hidden relative shadow-2xl"
                        >
                            {/* Dummy Map Background */}
                            <div className="relative h-[280px] bg-[#f8f9fa] overflow-hidden flex items-center justify-center">
                                {/* Grid Pattern */}
                                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

                                {/* Route Line Path Mapping Simulation */}
                                <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M 25,75 L 75,25" fill="none" stroke="#059669" strokeWidth="3" strokeDasharray="6,4" />
                                </svg>

                                {/* Start Marker */}
                                <div className="absolute left-[25%] top-[75%] -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-4 h-4 rounded-full bg-[#1A1F36] border-[2.5px] border-white shadow-sm"></div>
                                </div>

                                {/* End Marker */}
                                <div className="absolute left-[75%] top-[25%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-full absolute opacity-60"></div>
                                    <div className="w-5 h-5 rounded-full bg-emerald-600 border-[3px] border-white shadow-sm relative z-10 flex items-center justify-center overflow-hidden">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                    </div>
                                </div>

                                {/* Floating Header Options */}
                                <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
                                    <div className="bg-white px-3.5 py-1.5 rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none mt-0.5">On the way</span>
                                    </div>
                                    <button
                                        onClick={() => setShowMapModal(false)}
                                        className="w-10 h-10 bg-white rounded-[1rem] shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Trip Info Area */}
                            <div className="p-6 pt-7 bg-white relative">
                                <div className="absolute -top-7 right-6">
                                    <button className="w-14 h-14 bg-[#1A1F36] text-white rounded-full flex items-center justify-center shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">
                                        <Navigation size={22} fill="currentColor" strokeWidth={1.5} className="ml-[-2px] mt-[1px]" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Destination</p>
                                        <h3 className="text-[19px] font-black text-slate-900 leading-tight tracking-tight">{getTaskAddress(currentTask)}</h3>
                                        <p className="text-[13px] font-bold text-slate-500 mt-1">{currentTask.customer?.name || 'Customer'}</p>
                                    </div>

                                    <div className="flex items-center gap-8 pt-5 border-t border-slate-100 mt-5">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Est. Arrival</p>
                                            <p className="text-xl font-black text-emerald-600 tracking-tight">5 Min</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Distance</p>
                                            <p className="text-xl font-black text-slate-900 tracking-tight">1.2 km</p>
                                        </div>
                                    </div>

                                    <button onClick={() => setShowMapModal(false)} className="w-full mt-6 py-4 bg-transparent text-slate-900 text-[11px] font-black uppercase tracking-[0.2em] rounded-full border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all outline-none">
                                        Close Map
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            </>
            )}
            {/* Available Task Detail Modal */}
            <AnimatePresence>
                {selectedAvailableTask && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setSelectedAvailableTask(null)}
                    >
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-md p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setSelectedAvailableTask(null)}
                                className="absolute top-5 right-5 w-8 h-8 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-200 hover:text-slate-600 transition-all z-20"
                            >
                                <X size={16} />
                            </button>

                            <div className="mb-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedAvailableTask.status.includes('fabric') ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'}`}>
                                        {getTaskType(selectedAvailableTask.status)}
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900">₹{selectedAvailableTask.totalAmount}</h2>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Order #{selectedAvailableTask.orderId?.slice(-6) || selectedAvailableTask._id.slice(-6)}</h3>
                                <p className="text-xs font-bold text-slate-400 tracking-widest mt-1 uppercase">Dispatch Available Now</p>
                            </div>

                            <div className="space-y-6 mb-8">
                                {/* Route Info */}
                                <div className="relative pl-6 space-y-6">
                                    <div className="absolute left-[7px] top-[10px] bottom-[10px] w-0.5 border-l-2 border-dashed border-slate-100"></div>
                                    
                                    <div className="relative">
                                        <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup From ({selectedAvailableTask.status.includes('fabric') ? 'Customer' : 'Artisan'})</p>
                                                <p className="text-sm font-bold text-slate-800">
                                                    {selectedAvailableTask.status.includes('fabric') 
                                                        ? selectedAvailableTask.customer?.name 
                                                        : selectedAvailableTask.tailor?.shopName}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5 italic">
                                                    {selectedAvailableTask.status.includes('fabric') 
                                                        ? formatAddress(selectedAvailableTask.customer?.address) 
                                                        : formatAddress(selectedAvailableTask.tailor?.address)}
                                                </p>
                                            </div>
                                            {(selectedAvailableTask.status.includes('fabric') ? selectedAvailableTask.customer?.phoneNumber : selectedAvailableTask.tailor?.phone) && (
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Contact</p>
                                                    <p className="text-[10px] font-bold text-slate-600">
                                                        {selectedAvailableTask.status.includes('fabric') ? selectedAvailableTask.customer.phoneNumber : selectedAvailableTask.tailor.phone}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-white border-2 border-emerald-800 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-800"></div>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Drop To ({selectedAvailableTask.status.includes('fabric') ? 'Artisan' : 'Customer'})</p>
                                                <p className="text-sm font-bold text-slate-800">
                                                    {selectedAvailableTask.status.includes('fabric') 
                                                        ? selectedAvailableTask.tailor?.shopName 
                                                        : selectedAvailableTask.customer?.name}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5 italic">
                                                    {selectedAvailableTask.status.includes('fabric') 
                                                        ? formatAddress(selectedAvailableTask.tailor?.address) 
                                                        : formatAddress(selectedAvailableTask.deliveryAddress)}
                                                </p>
                                            </div>
                                            {(selectedAvailableTask.status.includes('fabric') ? selectedAvailableTask.tailor?.phone : selectedAvailableTask.customer?.phoneNumber) && (
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Contact</p>
                                                    <p className="text-[10px] font-bold text-slate-600">
                                                        {selectedAvailableTask.status.includes('fabric') ? selectedAvailableTask.tailor.phone : selectedAvailableTask.customer.phoneNumber}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Content */}
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Package size={14} className="text-slate-400" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Order Content</span>
                                    </div>
                                    <div className="space-y-2">
                                        {selectedAvailableTask.items.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center text-xs font-bold text-slate-800">
                                                <span>{item.service?.title || item.product?.name || 'Item'}</span>
                                                <span className="text-slate-400 font-medium">x{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleAcceptTask(selectedAvailableTask._id)}
                                disabled={isAccepting}
                                className="w-full bg-slate-900 text-white rounded-2xl p-4 font-black tracking-widest text-xs hover:bg-black active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 uppercase disabled:opacity-50"
                            >
                                {isAccepting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                        Accept This Task
                                    </>
                                )}
                            </button>

                            <p className="text-center mt-4 text-[9px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
                                Please reach pickup location within 15 mins.<br />Earnings will be credited after delivery.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DeliveryDashboard;

