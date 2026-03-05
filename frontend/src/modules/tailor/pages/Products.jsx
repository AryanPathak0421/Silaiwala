import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Search } from 'lucide-react';
import { Button } from '../components/UIElements';

// Using realistic placeholder fashion images
const INITIAL_SAMPLES = [
    { id: 1, name: 'Bridal Lehenga', category: 'Stitching', price: '₹12,000', stock: '2 days', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80' },
    { id: 2, name: 'Cotton Salwar', category: 'Tailoring', price: '₹1,500', stock: '1 day', image: 'https://images.unsplash.com/photo-1583391733958-d25e07fac04f?w=800&auto=format&fit=crop&q=80' },
    { id: 3, name: 'Silk Blouse', category: 'Embroidery', price: '₹900', stock: '3 days', image: 'https://images.unsplash.com/photo-1620012253295-c15c54e0c4f8?w=800&auto=format&fit=crop&q=80' },
];

const MORE_SAMPLES = [
    { id: 4, name: 'Designer Kurti', category: 'Stitching', price: '₹2,200', stock: '2 days', image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=800&auto=format&fit=crop&q=80' },
    { id: 5, name: 'Mens Wedding Suit', category: 'Tailoring', price: '₹8,500', stock: '5 days', image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800&auto=format&fit=crop&q=80' },
];

const Products = () => {
    const [samples, setSamples] = useState(INITIAL_SAMPLES);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasLoadedMore, setHasLoadedMore] = useState(false);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this sample?')) {
            setSamples(currentSamples => currentSamples.filter(sample => sample.id !== id));
        }
    };

    const handleEdit = (id) => {
        alert(`Edit view opened for sample ID: ${id}`);
    };

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        // Simulate network delay
        setTimeout(() => {
            setSamples(current => [...current, ...MORE_SAMPLES]);
            setIsLoadingMore(false);
            setHasLoadedMore(true);
        }, 800);
    };

    const filteredSamples = samples.filter(sample =>
        sample.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sample.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-2xl font-black text-[#1e3932] tracking-tighter">My Samples</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Showcase your best work</p>
                </div>
                <button
                    onClick={() => alert("Open Add New Sample Form")}
                    className="h-12 w-12 bg-[#1e3932] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/10 hover:bg-[#152a25] active:scale-90 transition-all"
                >
                    <Plus size={24} />
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-[#1e3932] shadow-sm text-sm transition-colors"
                />
            </div>

            <div className="grid gap-6 mt-8">
                {filteredSamples.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-[1.5rem] border border-gray-50 shadow-sm">
                        <p className="text-gray-400 font-bold text-sm">No samples found matching "{searchQuery}"</p>
                    </div>
                ) : (
                    filteredSamples.map((item) => (
                        <div key={item.id} className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-xl hover:translate-y-[-4px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Image Container */}
                            <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item.id)}
                                        className="p-2.5 bg-white backdrop-blur shadow-lg rounded-xl text-gray-600 hover:text-[#1e3932] hover:bg-green-50 active:scale-95 transition-all"
                                        title="Edit Sample"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2.5 bg-white backdrop-blur shadow-lg rounded-xl text-red-500 hover:text-white hover:bg-red-500 active:scale-95 transition-all"
                                        title="Delete Sample"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-[#1e3932] text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/10 backdrop-blur-md">
                                    {item.category}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg font-black text-gray-900 tracking-tight">{item.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Avg Completion: {item.stock}</p>
                                    </div>
                                    <div className="text-right text-[#1e3932]">
                                        <p className="text-sm font-black italic">Labor: {item.price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {!hasLoadedMore && filteredSamples.length > 0 && searchQuery === '' && (
                <div className="pt-10">
                    <Button
                        onClick={handleLoadMore}
                        loading={isLoadingMore}
                        variant="secondary"
                        className="border-gray-100 italic font-black shadow-sm"
                    >
                        Load More Samples
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Products;
