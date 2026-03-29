import React from 'react';
import ProductCard from './ProductCard';

import img1 from '../../../../assets/img1.jpeg';
import img10 from '../../../../assets/img10.webp';
import img12 from '../../../../assets/img12.jpeg';
import img15 from '../../../../assets/img15.jpeg';

const RECENTLY = [
    { id: 101, name: 'Printed Cotton Kurti', price: 899, originalPrice: 1599, image: img1, category: 'Kurtis', rating: 4.1, discount: 45, codAvailable: true },
    { id: 102, name: 'Ethnic Jhumkas', price: 299, originalPrice: 499, image: img10, category: 'Jewelry', rating: 4.8, discount: 40, codAvailable: true },
    { id: 103, name: 'Silk Dupatta', price: 599, originalPrice: 999, image: img12, category: 'Accessories', rating: 4.3, discount: 40, codAvailable: true },
    { id: 104, name: 'Party Wear Gown', price: 3499, originalPrice: 5999, image: img15, category: 'Dresses', rating: 4.6, discount: 42, codAvailable: false },
];

const RecentlyViewed = ({ title = "Recently Viewed", products = RECENTLY }) => {
    return (
        <div className="py-8 bg-gray-50">
            <h3 className="text-lg font-bold text-primary px-4 mb-4">{title}</h3>
            <div className="flex overflow-x-auto gap-4 px-4 pb-4 scrollbar-hide snap-x">
                {products.map((product) => (
                    <div key={product.id} className="min-w-[160px] md:min-w-[200px] snap-center">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;
