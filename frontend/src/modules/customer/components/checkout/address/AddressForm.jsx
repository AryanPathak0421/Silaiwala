import React, { useState } from 'react';
import { Home, Briefcase, ChevronRight } from 'lucide-react';
import useAddressStore from '../../../../../store/userStore';

const InputField = ({ label, name, placeholder, type = "text", required, form, errors, setForm, setErrors }) => (
    <div className="mb-3">
        <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">{label} {required && "*"}</label>
        <input
            type={type}
            placeholder={placeholder}
            value={form[name]}
            onChange={(e) => {
                setForm({ ...form, [name]: e.target.value });
                if (errors[name]) setErrors({ ...errors, [name]: null });
            }}
            className={`w-full text-xs font-semibold p-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all ${errors[name] ? "border-red-300 focus:border-red-500 bg-red-50" : "border-gray-200 focus:border-[#1e3932] bg-gray-50/50 focus:bg-white"
                }`}
        />
        {errors[name] && <span className="text-[9px] text-red-500 font-medium ml-1">{errors[name]}</span>}
    </div>
);

const AddressForm = ({ onCancel, onSuccess }) => {
    const addAddress = useAddressStore((state) => state.addAddress);

    const [form, setForm] = useState({
        receiverName: '', phone: '', zipCode: '',
        street: '', city: '', state: '', type: 'Home'
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!form.receiverName.trim()) newErrors.receiverName = "Required";
        if (!form.phone.match(/^\d{10}$/)) newErrors.phone = "Invalid Phone";
        if (!form.zipCode.match(/^\d{6}$/)) newErrors.zipCode = "Invalid Pin";
        if (!form.street.trim()) newErrors.street = "Required";
        if (!form.city.trim()) newErrors.city = "Required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            addAddress(form);
            onSuccess && onSuccess();
        }
    };

    return (
        <div className="bg-white rounded-2xl p-4 animate-in slide-in-from-bottom-4 duration-300 shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    Add New Address
                </h3>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-3">
                    <InputField label="Contact Name" name="receiverName" placeholder="John Doe" required form={form} errors={errors} setForm={setForm} setErrors={setErrors} />
                    <InputField label="Phone Number" name="phone" placeholder="9876543210" required form={form} errors={errors} setForm={setForm} setErrors={setErrors} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <InputField label="Pincode" name="zipCode" placeholder="110001" required form={form} errors={errors} setForm={setForm} setErrors={setErrors} />
                    <InputField label="City" name="city" placeholder="New Delhi" required form={form} errors={errors} setForm={setForm} setErrors={setErrors} />
                </div>

                <InputField label="Address (House No, Area, Landmark)" name="street" placeholder="Flat 402, Block A, Main Road" required form={form} errors={errors} setForm={setForm} setErrors={setErrors} />
                <InputField label="State" name="state" placeholder="Delhi" required form={form} errors={errors} setForm={setForm} setErrors={setErrors} />

                {/* Type Selection */}
                <div className="mb-6">
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">Address Type</label>
                    <div className="flex gap-2">
                        {['Home', 'Work', 'Other'].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setForm({ ...form, type })}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${form.type === type
                                    ? "bg-[#1e3932] text-white shadow-md ring-2 ring-[#e6f4f1]"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}
                            >
                                {type === 'Home' && <Home size={12} />}
                                {type === 'Work' && <Briefcase size={12} />}
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="py-2.5 rounded-xl bg-[#1e3932] text-white text-xs font-bold shadow-lg hover:bg-[#152e28] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        Save Address <ChevronRight size={14} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddressForm;
