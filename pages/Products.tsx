import React, { useState } from 'react';
import { Filter, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

const Products: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const { products, loading } = useProducts();
  
  const categories = ['All', 'Bags', 'Sweaters', 'Baby', 'Accessories', 'Home'];
  
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="bg-brand-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-brand-brown mb-4">Shop Collection</h1>
          <p className="text-brand-text/70 max-w-2xl mx-auto">
            Explore our range of handmade crochet items. From fashion to home decor, everything is crafted with care.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            <Filter size={20} className="text-brand-brown flex-shrink-0" />
            <span className="font-semibold text-brand-brown mr-2">Filter:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-brand-sageDark text-white shadow-md'
                    : 'bg-white text-brand-text border border-brand-rose/20 hover:bg-brand-rose/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <p className="text-sm text-brand-text/60">
            Showing {filteredProducts.length} items
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <Loader2 className="animate-spin text-brand-sageDark" size={48} />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-brand-rose/20">
            <p className="text-xl text-brand-text/60 font-serif">No items found in this category yet.</p>
            <button 
              onClick={() => setActiveCategory('All')}
              className="mt-4 text-brand-sageDark font-semibold hover:underline"
            >
              View all products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
