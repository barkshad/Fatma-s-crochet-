import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Video } from 'lucide-react';
import { Product } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi Fatma, I'm interested in the ${product.name}!`;

  const isVideo = (product.image?.includes('/video/upload/') || product.image?.match(/\.(mp4|webm|mov)$/i));

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-brand-rose/20 flex flex-col h-full">
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
            <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white backdrop-blur-sm">
               <Video size={14} />
            </div>
          </div>
        ) : (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-xs uppercase tracking-wider text-brand-sageDark font-semibold">{product.category}</span>
        </div>
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="text-xl font-serif font-bold text-brand-brown mb-2 group-hover:text-brand-sageDark transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-lg font-medium text-brand-text mb-4 mt-auto">
          ${product.price.toFixed(2)}
        </p>
        
        <div className="grid grid-cols-5 gap-2 mt-auto">
           <Link 
            to={`/products/${product.id}`}
            className="col-span-3 text-center border-2 border-brand-sageDark text-brand-sageDark font-semibold py-2 rounded-xl hover:bg-brand-sageDark hover:text-white transition-colors"
          >
            View Details
          </Link>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 flex items-center justify-center bg-brand-sage text-brand-brown hover:bg-green-500 hover:text-white transition-colors rounded-xl py-2"
            aria-label="Order on WhatsApp"
          >
            <MessageCircle size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;