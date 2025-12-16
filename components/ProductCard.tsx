import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Video, Heart } from 'lucide-react';
import { Product } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi Fatma, I'm interested in the ${product.name}!`;
  const isVideo = (product.image?.includes('/video/upload/') || product.image?.match(/\.(mp4|webm|mov)$/i));

  return (
    <div className="group glass-card rounded-2xl overflow-hidden flex flex-col h-full spring-transition hover-lift relative">
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden aspect-[4/5]">
        {isVideo ? (
          <div className="relative w-full h-full">
            <video 
              src={product.image} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              muted
              loop
              playsInline
              autoPlay
            />
            <div className="absolute top-3 right-3 glass px-2 py-1 rounded-full text-brand-brown backdrop-blur-md flex items-center gap-1">
               <Video size={14} /> <span className="text-xs font-bold">Video</span>
            </div>
          </div>
        ) : (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Quick Action Overlay */}
        <div className="absolute bottom-4 left-0 right-0 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-75">
           <Link to={`/products/${product.id}`} className="block w-full text-center bg-white/90 backdrop-blur-md text-brand-brown py-2 rounded-xl font-bold shadow-lg text-sm hover:bg-brand-sageDark hover:text-white transition-colors">
              View Details
           </Link>
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow relative">
        <div className="mb-2 flex justify-between items-center">
          <span className="text-xs uppercase tracking-widest text-brand-sageDark font-bold bg-brand-sage/20 px-2 py-0.5 rounded-md">{product.category}</span>
          <button className="text-brand-roseDark hover:text-brand-rose transition-colors hover:scale-110 active:scale-95 duration-200">
             <Heart size={18} />
          </button>
        </div>
        
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="text-xl font-serif font-bold text-brand-brown mb-2 leading-tight group-hover:text-brand-sageDark transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-brand-brown/10">
          <p className="text-xl font-bold text-brand-text">
            ${product.price.toFixed(2)}
          </p>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-brand-sage text-brand-brown hover:bg-green-500 hover:text-white transition-all rounded-full shadow-sm hover:shadow-lg active:scale-90"
            title="Order on WhatsApp"
          >
            <MessageCircle size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;