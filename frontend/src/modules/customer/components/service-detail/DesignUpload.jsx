import React, { useState } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';

const DesignUpload = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Upload Design Reference</h3>

            {!file ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mb-3">
                        <UploadCloud size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Click to upload image</p>
                    <p className="text-[10px] text-gray-400 mt-1">Supports JPG, PNG (Max 5MB)</p>
                </div>
            ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={file} alt="Preview" className="w-full h-48 object-cover" />
                    <button
                        onClick={() => setFile(null)}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-sm"
                    >
                        <X size={16} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2 text-white text-xs flex items-center gap-2">
                        <ImageIcon size={14} />
                        <span className="truncate">design_reference.jpg</span>
                    </div>
                </div>
            )}

            <div className="mt-4">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Special Instructions</h3>
                <textarea
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none resize-none bg-gray-50 focus:bg-white transition-colors"
                    rows={3}
                    placeholder="Describe specific details like neck depth, sleeve length, piping color, etc..."
                />
            </div>
        </div>
    );
};

export default DesignUpload;
