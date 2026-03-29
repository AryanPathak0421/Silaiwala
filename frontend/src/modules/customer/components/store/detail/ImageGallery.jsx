import React, { useState } from 'react';
import { cn } from '../../../../../utils/cn';

const ImageGallery = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x, y });
    };

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails (Desktop: Left, Mobile: Bottom) */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible scrollbar-hide px-4 md:px-0">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={cn(
                            "flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all",
                            selectedImage === img ? "border-primary" : "border-transparent hover:border-gray-200"
                        )}
                    >
                        <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative aspect-[3/4] md:aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden group">
                <div
                    className="w-full h-full cursor-zoom-in"
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleMouseMove}
                >
                    <img
                        src={selectedImage}
                        alt="Product Main"
                        className={cn(
                            "w-full h-full object-cover transition-transform duration-200",
                            isZoomed ? "scale-150" : "scale-100" // Simple scale for mobile/tablet where mouse move isn't primary
                        )}
                        style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
                    />
                </div>

                {/* Mobile Swipe Indicators (Mock) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 md:hidden">
                    {images.map((_, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "w-1.5 h-1.5 rounded-full transition-colors",
                                images[idx] === selectedImage ? "bg-primary" : "bg-white/50"
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageGallery;
