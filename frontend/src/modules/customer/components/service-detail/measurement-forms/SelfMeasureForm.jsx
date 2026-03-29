import React, { useState, useEffect } from 'react';
import { Info, HelpCircle, Save } from 'lucide-react';
import MeasurementInput from './MeasurementInput';
import { cn } from '../../../../../utils/cn';

const SelfMeasureForm = ({ initialData, onSave, onCancel }) => {
    const [values, setValues] = useState({
        chest: '',
        waist: '',
        hips: '',
        shoulder: '',
        length: '',
        sleeveLength: '',
        neck: '',
        notes: ''
    });

    const [errors, setErrors] = useState({});
    const [saveProfile, setSaveProfile] = useState(false);
    const [profileName, setProfileName] = useState('');

    useEffect(() => {
        if (initialData) {
            setValues(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        // Allow only numbers and decimals
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setValues(prev => ({ ...prev, [field]: value }));
            // Clear error on change
            if (errors[field]) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            }
        }
    };

    const validate = () => {
        const newErrors = {};
        const requiredFields = ['chest', 'waist', 'shoulder', 'length'];

        requiredFields.forEach(field => {
            if (!values[field]) {
                newErrors[field] = 'Required';
            } else {
                const num = parseFloat(values[field]);
                if (num < 10 || num > 100) {
                    newErrors[field] = 'Invalid range';
                }
            }
        });

        if (saveProfile && !profileName.trim()) {
            newErrors.profileName = 'Name your profile';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            onSave({
                type: 'self',
                data: values,
                saveProfile: saveProfile ? { name: profileName } : null
            });
        }
    };

    return (
        <div className="bg-gray-50 border border-t-0 border-gray-100 rounded-b-2xl p-4 animate-in slide-in-from-top-2 duration-300">

            {/* Helper Banner */}
            <div className="bg-pink-50 border border-pink-100 rounded-lg p-3 mb-4 flex gap-3">
                <Info size={18} className="text-primary shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-xs font-bold text-blue-800">Standard Size Guide</h4>
                    <p className="text-[10px] text-primary mt-0.5 leading-relaxed">
                        Measure comfortably. Don't pull the tape too tight. All units are in inches.
                    </p>
                </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <MeasurementInput
                    label="Chest / Bust"
                    placeholder="34"
                    value={values.chest}
                    onChange={(v) => handleChange('chest', v)}
                    error={errors.chest}
                />
                <MeasurementInput
                    label="Waist"
                    placeholder="28"
                    value={values.waist}
                    onChange={(v) => handleChange('waist', v)}
                    error={errors.waist}
                />
                <MeasurementInput
                    label="Hips"
                    placeholder="36"
                    value={values.hips}
                    onChange={(v) => handleChange('hips', v)}
                    error={errors.hips}
                />
                <MeasurementInput
                    label="Shoulder"
                    placeholder="14"
                    value={values.shoulder}
                    onChange={(v) => handleChange('shoulder', v)}
                    error={errors.shoulder}
                />
                <MeasurementInput
                    label="Full Length"
                    placeholder="40"
                    value={values.length}
                    onChange={(v) => handleChange('length', v)}
                    error={errors.length}
                />
                <MeasurementInput
                    label="Sleeve Length"
                    placeholder="16"
                    value={values.sleeveLength}
                    onChange={(v) => handleChange('sleeveLength', v)}
                    error={errors.sleeveLength}
                />
                <MeasurementInput
                    label="Neck Depth (Front)"
                    placeholder="6"
                    value={values.neck}
                    onChange={(v) => handleChange('neck', v)}
                    error={errors.neck}
                />
            </div>

            {/* Notes Section */}
            <div className="mb-4">
                <label className="text-xs font-medium text-gray-700 ml-1 mb-1 block">
                    Specific Instructions (Optional)
                </label>
                <textarea
                    value={values.notes}
                    onChange={(e) => setValues(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-[#e6f4f1] transition-all placeholder:text-gray-300 resize-none"
                    rows={3}
                    placeholder="E.g., I prefer a loose fit around the waist. Please add pockets."
                />
            </div>

            {/* Save Profile Toggle */}
            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 mb-6">
                <div
                    onClick={() => setSaveProfile(!saveProfile)}
                    className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center cursor-pointer mt-0.5",
                        saveProfile ? "bg-primary border-primary" : "border-gray-300 bg-white"
                    )}
                >
                    {saveProfile && <div className="w-2.5 h-1.5 border-b-2 border-l-2 border-white rotate-[-45deg] mb-0.5" />}
                </div>
                <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-900 cursor-pointer" onClick={() => setSaveProfile(!saveProfile)}>
                        Save this measurement profile
                    </p>
                    {saveProfile && (
                        <input
                            type="text"
                            value={profileName}
                            onChange={(e) => {
                                setProfileName(e.target.value);
                                if (errors.profileName) setErrors(prev => ({ ...prev, profileName: null }));
                            }}
                            placeholder="Profile Name (e.g. My Summer Fit)"
                            className={cn(
                                "mt-2 w-full text-xs border-b border-gray-200 py-1 outline-none focus:border-primary bg-transparent",
                                errors.profileName ? "border-red-300 placeholder:text-red-300" : ""
                            )}
                            autoFocus
                        />
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    className="flex-1 py-2.5 rounded-full border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="flex-1 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Save size={14} />
                    Confirm Measurements
                </button>
            </div>

        </div>
    );
};

export default SelfMeasureForm;
