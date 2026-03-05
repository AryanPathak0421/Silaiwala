import React from 'react';

export const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false, loading = false }) => {
    const baseStyles = 'w-full py-3 px-6 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100';
    const variants = {
        primary: 'bg-[#1e3932] text-white hover:bg-[#152a25] shadow-lg shadow-green-900/10',
        secondary: 'bg-white text-[#1e3932] border-2 border-[#1e3932] hover:bg-gray-50',
        outline: 'bg-transparent text-gray-400 border border-gray-200 hover:border-gray-400',
        ghost: 'bg-transparent text-[#1e3932] hover:bg-gray-50',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {loading ? (
                <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : children}
        </button>
    );
};

export const Input = ({ label, error, ...props }) => {
    return (
        <div className="space-y-1 w-full">
            {label && <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">{label}</label>}
            <input
                {...props}
                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${error ? 'border-red-400 focus:border-red-500 bg-red-50/50' : 'border-gray-50 focus:border-[#1e3932] focus:bg-white'
                    }`}
            />
        </div>
    );
};

export const FileUpload = ({ label, error, onChange, value, placeholder = "Upload Document" }) => {
    return (
        <div className="space-y-1 w-full">
            {label && <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">{label}</label>}
            <div className={`relative border-2 border-dashed rounded-2xl p-4 transition-all bg-gray-50/50 flex flex-col items-center justify-center gap-1 ${error ? 'border-red-200 bg-red-50/10' : 'border-gray-200 hover:border-[#1e3932]'
                }`}>
                <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => onChange(e.target.files[0])}
                />
                <div className="h-10 w-10 bg-white rounded-xl shadow-sm border flex items-center justify-center text-gray-400 group-hover:text-[#1e3932]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <p className="text-sm font-bold text-gray-600">{value ? value.name : placeholder}</p>
                <span className="text-[10px] text-gray-400 font-medium">PNG, JPG up to 5MB</span>
            </div>
        </div>
    );
};
