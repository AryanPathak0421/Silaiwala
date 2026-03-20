import React, { useState, useEffect } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

const SafeImage = ({ src, alt, className, fallback = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800' }) => {
    const [imgSrc, setImgSrc] = useState(null);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!src) {
            setImgSrc(fallback);
            setIsLoading(false);
            return;
        }

        // Reset state when src changes
        setIsLoading(true);
        setError(false);
        setImgSrc(src);
    }, [src, fallback]);

    const handleError = () => {
        if (!error) {
            setImgSrc(fallback);
            setError(true);
        }
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 animate-pulse">
                    <Loader2 size={16} className="text-gray-200 animate-spin" />
                </div>
            )}
            
            {imgSrc && (
                <img
                    src={imgSrc}
                    alt={alt}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    onError={handleError}
                    onLoad={handleLoad}
                    loading="lazy"
                />
            )}

            {error && !imgSrc && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-300">
                    <ImageOff size={24} />
                    <span className="text-[8px] font-bold uppercase mt-1">Failed to load</span>
                </div>
            )}
        </div>
    );
};

export default SafeImage;
