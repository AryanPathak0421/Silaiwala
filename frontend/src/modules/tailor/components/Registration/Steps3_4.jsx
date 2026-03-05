import React from 'react';
import { Input, FileUpload } from '../UIElements';

export const Step3Docs = ({ register, errors, setValue, watch }) => {
    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 mb-2">
                <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest mb-1">Important</p>
                <p className="text-xs text-orange-800 font-medium leading-relaxed">Please ensure all images are clear and text is readable for faster approval.</p>
            </div>

            <Input
                label="Aadhar Number"
                placeholder="12 digit number"
                {...register('aadharNumber', { required: 'Aadhar is required' })}
                error={errors.aadharNumber?.message}
            />
            <div className="grid grid-cols-2 gap-4">
                <FileUpload
                    label="Aadhar Front"
                    value={watch('aadharFront')}
                    onChange={(file) => setValue('aadharFront', file)}
                    error={errors.aadharFront?.message}
                />
                <FileUpload
                    label="Aadhar Back"
                    value={watch('aadharBack')}
                    onChange={(file) => setValue('aadharBack', file)}
                    error={errors.aadharBack?.message}
                />
            </div>

            <Input
                label="PAN Number"
                placeholder="ABCDE1234F"
                {...register('panNumber', { required: 'PAN is required' })}
                error={errors.panNumber?.message}
            />
            <FileUpload
                label="PAN Card Image"
                value={watch('panImage')}
                onChange={(file) => setValue('panImage', file)}
                error={errors.panImage?.message}
            />

            <FileUpload
                label="Shop License (Gumasta)"
                value={watch('licenseImage')}
                onChange={(file) => setValue('licenseImage', file)}
                error={errors.licenseImage?.message}
            />
        </div>
    );
};

export const Step4Portfolio = ({ register, errors, setValue, watch }) => {
    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-2">
                <p className="text-[10px] font-black text-[#1e3932] uppercase tracking-widest mb-1">Showcase Your Work</p>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">Upload clear photos of your best creations to attract more customers.</p>
            </div>

            <FileUpload
                label="Portfolio Image 1"
                value={watch('portfolio1')}
                onChange={(file) => setValue('portfolio1', file)}
                error={errors.portfolio1?.message}
            />
            <FileUpload
                label="Portfolio Image 2"
                value={watch('portfolio2')}
                onChange={(file) => setValue('portfolio2', file)}
                error={errors.portfolio2?.message}
            />

            <div className="space-y-4 mt-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Availability Schedule</p>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400">Working Days</label>
                        <select
                            {...register('workingDays', { required: 'Working days required' })}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:outline-none focus:border-[#1e3932] focus:bg-white transition-all text-sm font-medium"
                        >
                            <option value="">Select Days</option>
                            <option value="mon-fri">Mon - Fri</option>
                            <option value="mon-sat">Mon - Sat</option>
                            <option value="everyday">Everyday (Mon-Sun)</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400">Daily Hours</label>
                        <select
                            {...register('workingHours', { required: 'Working hours required' })}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:outline-none focus:border-[#1e3932] focus:bg-white transition-all text-sm font-medium"
                        >
                            <option value="">Select Hours</option>
                            <option value="9-5">9:00 AM - 5:00 PM</option>
                            <option value="10-7">10:00 AM - 7:00 PM</option>
                            <option value="10-8">10:00 AM - 8:00 PM</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};
