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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-brown mb-6">Shop Collection</h1>
          <p className="text-xl text-brand-text/80 max-w-2xl mx-auto font-sans">
            Explore our range of handmade crochet items. From fashion to home decor, everything is crafted with care.
          </p>
        </div>

        {/* Filters - Glass Bar */}
        <div className="glass p-3 rounded-2xl mb-12 flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in-up delay-100">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar px-2">
            <div className="flex items-center gap-2 text-brand-brown mr-2">
               <Filter size={20} />
               <span className="font-bold hidden sm:inline">Filter:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap spring-transition ${
                  activeCategory === cat
                    ? 'bg-brand-sageDark text-white shadow-lg scale-105'
                    : 'bg-white/50 text-brand-text hover:bg-white hover:shadow-md'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="px-4 py-2 bg-white/50 rounded-xl text-sm font-bold text-brand-brown/80 whitespace-nowrap">
            {filteredProducts.length} Items
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64 glass rounded-3xl">
             <Loader2 className="animate-spin text-brand-sageDark" size={48} />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, idx) => (
              <div 
                key={product.id} 
                className="animate-fade-in-up" 
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass rounded-3xl animate-fade-in-up">
            <p className="text-2xl text-brand-text/60 font-serif mb-4">No items found in this category yet.</p>
            <button 
              onClick={() => setActiveCategory('All')}
              className="px-6 py-3 bg-brand-sageDark text-white rounded-full font-bold hover:bg-brand-brown transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;