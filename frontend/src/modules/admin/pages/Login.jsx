import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import silaiwalaLogo from '../../../assets/silaiwala-logo.png';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login, isLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        try {
            const user = await login(email, password);
            if (user.role !== 'admin') {
                setError('Unauthorized. Only administrators can access this portal.');
                // Optionally log them out if they are not an admin
                useAuthStore.getState().logout();
                return;
            }
            navigate('/admin');
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a211e] relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#1e3932] rounded-full blur-[120px] opacity-60"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#0f2d26] rounded-full blur-[100px] opacity-80"></div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 mx-4 border border-white/10">
                <div className="p-8 sm:p-10 flex flex-col items-center">
                    
                    {/* Logo & Header */}
                    <div className="w-16 h-16 bg-gradient-to-br from-[#1e3932] to-[#0a211e] rounded-2xl flex items-center justify-center p-3 shadow-lg shadow-green-900/20 mb-6 border border-white/10">
                         <img src={silaiwalaLogo} alt="Logo" className="w-full h-full object-contain filter brightness-0 invert" />
                    </div>
                    
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight text-center">Admin Portal</h2>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Secure Access ONLY</p>

                    <form onSubmit={handleSubmit} className="w-full mt-8 space-y-5">
                        {error && (
                            <div className="p-3 text-xs font-bold text-red-600 bg-red-50/80 border border-red-100 rounded-xl text-center backdrop-blur-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Admin Email</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail size={16} />
                                </span>
                                <input
                                    type="email"
                                    placeholder="Enter your administrative email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-900 outline-none focus:border-[#1e3932] focus:bg-white transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Master Password</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={16} />
                                </span>
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-900 outline-none focus:border-[#1e3932] focus:bg-white transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 mt-4 bg-[#0a211e] hover:bg-[#061512] text-white text-xs font-black rounded-xl shadow-lg shadow-[#0a211e]/20 transition-all uppercase tracking-widest disabled:opacity-70 flex justify-center items-center"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    Authenticating...
                                </span>
                            ) : (
                                "Authorize Access"
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Band */}
                <div className="bg-gray-50/50 p-4 border-t border-gray-100 text-center">
                     <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                         Silaiwala Systems © {new Date().getFullYear()}
                     </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
