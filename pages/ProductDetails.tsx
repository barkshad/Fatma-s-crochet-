import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Truck, RefreshCw, ShieldCheck, Loader2, Star, Share2 } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';
import { useProducts } from '../hooks/useProducts';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useProducts();
  const [selectedColor, setSelectedColor] = useState('Default');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
         <Loader2 className="animate-spin text-brand-sageDark" size={48} />
      </div>
    )
  }

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-serif text-brand-brown mb-4">Product Not Found</h2>
        <Link to="/products" className="px-6 py-3 bg-brand-sageDark text-white rounded-full font-bold hover:scale-105 transition-transform">Back to Shop</Link>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi Fatma! I'd like to order the ${product.name} (Color: ${selectedColor}). Is it available?`;

  const isVideo = (product.image?.includes('/video/upload/') || product.image?.match(/\.(mp4|webm|mov)$/i));

  return (
    <div className="min-h-screen py-10 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <Link to="/products" className="inline-flex items-center text-brand-brown/70 hover:text-brand-sageDark mb-8 transition-colors font-bold bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm hover:shadow-md">
          <ArrowLeft size={18} className="mr-2" /> Back to Shop
        </Link>

        <div className="glass-heavy rounded-[2.5rem] overflow-hidden shadow-2xl border-0">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Image/Video Section */}
            <div className="relative min-h-[500px] lg:h-auto bg-brand-brown/5">
               {isVideo ? (
                 <video 
                   src={product.image} 
                   className="w-full h-full object-cover"
                   controls
                   autoPlay
                   muted
                   loop
                 />
               ) : (
                 <img 
                   src={product.image} 
                   alt={product.name} 
                   className="w-full h-full object-cover"
                 />
               )}
               <div className="absolute top-6 left-6">
                 <span className="glass px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-brand-brown shadow-sm">
                   {product.category}
                 </span>
               </div>
            </div>

            {/* Info Section */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex text-yellow-400 gap-1">
                   {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                   <span className="text-brand-text/40 text-sm ml-2 font-medium">(New Arrival)</span>
                 </div>
                 <button className="text-brand-text/40 hover:text-brand-sageDark transition-colors">
                   <Share2 size={20} />
                 </button>
              </div>

              <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-4 leading-tight">{product.name}</h1>
              <p className="text-3xl font-bold text-brand-sageDark mb-8">Ksh {product.price.toLocaleString()}</p>
              
              <div className="prose prose-stone text-brand-text/80 mb-10 text-lg leading-relaxed">
                <p>{product.description}</p>
              </div>

              {/* Customization */}
              <div className="glass p-6 rounded-2xl mb-8 border border-white/60">
                <h3 className="font-bold text-brand-brown mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-sageDark"></span>
                  Customization Options:
                </h3>
                <div className="flex flex-wrap gap-3">
                  {['Default', 'Custom Color', 'Custom Size'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSelectedColor(opt)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                        selectedColor === opt 
                          ? 'border-brand-sageDark bg-brand-sageDark text-white shadow-lg scale-105' 
                          : 'border-transparent bg-white text-brand-text/70 hover:bg-white/80'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-3 mb-8 text-lg hover:-translate-y-1 spring-transition"
              >
                <MessageCircle size={28} fill="white" />
                Order on WhatsApp
              </a>

              {/* Details List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-brand-brown/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-rose/30 rounded-full text-brand-brown">
                     <ShieldCheck size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-brand-brown block mb-1">Materials</span>
                    <p className="text-sm text-brand-text/70">{product.materials}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-sage/30 rounded-full text-brand-sageDark">
                     <RefreshCw size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-brand-brown block mb-1">Care</span>
                    <p className="text-sm text-brand-text/70">{product.care}</p>
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