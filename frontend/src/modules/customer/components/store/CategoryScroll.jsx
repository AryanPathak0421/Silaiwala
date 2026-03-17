import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
import api from '../../../../utils/api';

const CategoryScroll = ({ onSelectCategory, activeCategory }) => {
    const scrollRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const [history, setHistory] = useState([]); // Stack of { id, name, data }
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategories = async (parentId = 'null') => {
        setIsLoading(true);
        try {
            const response = await api.get('/products/categories', {
                params: { parent: parentId, type: 'product' }
            });
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCategoryClick = async (category) => {
        // Fetch children
        try {
            const res = await api.get('/products/categories', {
                params: { parent: category._id }
            });
            
            if (res.data.success && res.data.data.length > 0) {
                // It's a parent, push to history and show children
                setHistory(prev => [...prev, { id: category._id, name: category.name, data: categories }]);
                setCategories(res.data.data);
                // Also notify store about the broad category filter if needed
                onSelectCategory(category.name, category._id);
            } else {
                // It's a leaf node or has no children, just filter
                onSelectCategory(category.name, category._id);
            }
        } catch (error) {
            onSelectCategory(category.name, category._id);
        }
    };

    const handleBack = () => {
        const last = history[history.length - 1];
        if (last) {
            setCategories(last.data);
            setHistory(prev => prev.slice(0, -1));
            onSelectCategory("All", null);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 200;
            current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-white py-4 relative group border-b border-gray-50">
            {history.length > 0 && (
                <div className="px-4 mb-2 flex items-center gap-2">
                    <button 
                        onClick={handleBack}
                        className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                        <ArrowLeft size={14} />
                    </button>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {history.map(h => h.name).join(' / ')}
                    </span>
                </div>
            )}

            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 px-4 pb-2 scrollbar-hide snap-x"
            >
                {/* Reset button if not at root */}
                {history.length === 0 && (
                    <button
                        onClick={() => {
                            onSelectCategory("All", null);
                        }}
                        className={`flex flex-col items-center gap-2 min-w-[80px] snap-center transition-all duration-300 ${activeCategory === "All" ? 'scale-105' : 'opacity-80'}`}
                    >
                        <div className={`w-16 h-16 rounded-full overflow-hidden border-2 flex items-center justify-center bg-gray-50 ${activeCategory === "All" ? 'border-[#1e3932] shadow-lg' : 'border-gray-100'}`}>
                            <span className="text-[10px] font-black uppercase text-[#1e3932]">All</span>
                        </div>
                        <span className={`text-xs font-medium text-center ${activeCategory === "All" ? 'text-[#1e3932] font-bold' : 'text-gray-600'}`}>
                            All Fabrics
                        </span>
                    </button>
                )}

                {isLoading ? (
                    [1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="min-w-[80px] flex flex-col items-center gap-2 animate-pulse">
                            <div className="w-16 h-16 rounded-full bg-gray-100" />
                            <div className="h-2 w-12 bg-gray-100 rounded" />
                        </div>
                    ))
                ) : (
                    categories.map((category) => (
                        <button
                            key={category._id}
                            onClick={() => handleCategoryClick(category)}
                            className={`flex flex-col items-center gap-2 min-w-[80px] snap-center transition-all duration-300 ${activeCategory === category.name ? 'scale-105' : 'opacity-80 hover:opacity-100'}`}
                        >
                            <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${activeCategory === category.name ? 'border-[#1e3932] shadow-lg' : 'border-gray-100'}`}>
                                <img
                                    src={category.image || 'https://via.placeholder.com/150?text=' + category.name}
                                    alt={category.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className={`text-xs font-medium text-center whitespace-nowrap ${activeCategory === category.name ? 'text-[#1e3932] font-bold' : 'text-gray-600'}`}>
                                {category.name}
                            </span>
                        </button>
                    ))
                )}
            </div>

            {/* Scroll Buttons (Desktop Only) */}
            <button
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-r-lg shadow-md hover:bg-white z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => scroll('left')}
            >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-l-lg shadow-md hover:bg-white z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => scroll('right')}
            >
                <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
        </div>
    );
};

export default CategoryScroll;
