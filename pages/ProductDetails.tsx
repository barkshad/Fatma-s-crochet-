import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Truck, RefreshCw, ShieldCheck } from 'lucide-react';
import { PRODUCTS, WHATSAPP_NUMBER } from '../constants';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find(p => p.id === id);
  const [selectedColor, setSelectedColor] = useState('Default');

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream">
        <h2 className="text-2xl font-serif text-brand-brown mb-4">Product Not Found</h2>
        <Link to="/products" className="text-brand-sageDark underline">Back to Shop</Link>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi Fatma! I'd like to order the ${product.name} (Color: ${selectedColor}). Is it available?`;

  return (
    <div className="bg-brand-cream min-h-screen py-10 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <Link to="/products" className="inline-flex items-center text-brand-text/60 hover:text-brand-sageDark mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-1" /> Back to Shop
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-brand-rose/20 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Image Section */}
            <div className="h-96 md:h-full bg-brand-stone-100 relative">
               <img 
                 src={product.image} 
                 alt={product.name} 
                 className="w-full h-full object-cover"
               />
            </div>

            {/* Info Section */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <span className="text-sm font-bold text-brand-sageDark uppercase tracking-widest mb-2">{product.category}</span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-4">{product.name}</h1>
              <p className="text-2xl font-medium text-brand-text mb-6">${product.price.toFixed(2)}</p>
              
              <div className="prose prose-stone text-brand-text/80 mb-8">
                <p>{product.description}</p>
              </div>

              {/* Customization Dummy */}
              <div className="mb-8">
                <h3 className="font-semibold text-brand-brown mb-3">Select Preference:</h3>
                <div className="flex gap-3">
                  {['Default', 'Custom Color', 'Custom Size'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSelectedColor(opt)}
                      className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                        selectedColor === opt 
                          ? 'border-brand-sageDark bg-brand-sageDark/10 text-brand-sageDark font-semibold' 
                          : 'border-brand-rose/20 text-brand-text/60 hover:border-brand-sageDark/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {selectedColor !== 'Default' && (
                  <p className="text-xs text-brand-sageDark mt-2">
                    * For custom orders, please specify details in the WhatsApp message.
                  </p>
                )}
              </div>

              {/* Actions */}
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-3 mb-6"
              >
                <MessageCircle size={24} />
                Order on WhatsApp
              </a>

              {/* Details List */}
              <div className="space-y-4 border-t border-brand-rose/20 pt-6 text-sm text-brand-text/70">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={20} className="text-brand-brown mt-0.5" />
                  <div>
                    <span className="font-semibold text-brand-brown block">Materials</span>
                    {product.materials}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw size={20} className="text-brand-brown mt-0.5" />
                  <div>
                    <span className="font-semibold text-brand-brown block">Care Instructions</span>
                    {product.care}
                  </div>
                </div>
                 <div className="flex items-start gap-3">
                  <Truck size={20} className="text-brand-brown mt-0.5" />
                  <div>
                    <span className="font-semibold text-brand-brown block">Shipping</span>
                    Calculated at checkout via WhatsApp. Worldwide shipping available.
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
