import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Video, Heart } from 'lucide-react';
import { Product } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi Fatma, I'm interested in the ${product.name}!`;
  const isVideo = (product.image?.includes('/video/upload/') || product.image?.match(/\.(mp4|webm|mov)$/i));

  const [isLoaded, setIsLoaded] = useState(false);

  // 3D Tilt & Spotlight Logic
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spotlight coordinates (pixels from top/left)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  // Create the gradient background for spotlight
  const background = useMotionTemplate`radial-gradient(
    650px circle at ${mouseX}px ${mouseY}px,
    rgba(255, 255, 255, 0.4),
    transparent 80%
  )`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Tilt calculations (normalized -0.5 to 0.5)
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    
    x.set(xPct);
    y.set(yPct);

    // Spotlight calculations (absolute px)
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group h-full perspective-1000 relative"
    >
      <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full relative shadow-sm hover:shadow-2xl transition-shadow duration-500 ease-out bg-white/40 border border-white/40">
        
        {/* Spotlight Effect Overlay */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-30"
          style={{ background }}
        />

        <Link to={`/products/${product.id}`} className="block relative overflow-hidden aspect-[4/5] z-10 bg-brand-rose/10">
          {/* Loading Skeleton */}
          <div className={`absolute inset-0 bg-brand-rose/10 animate-pulse transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />

          {isVideo ? (
            <div className="relative w-full h-full">
              <video 
                src={product.image} 
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
                muted
                loop
                playsInline
                autoPlay
                onLoadedData={() => setIsLoaded(true)}
              />
              <div className="absolute top-3 right-3 glass px-2 py-1 rounded-full text-brand-brown backdrop-blur-md flex items-center gap-1 z-20">
                 <Video size={14} /> <span className="text-xs font-bold">Video</span>
              </div>
            </div>
          ) : (
            <img 
              src={product.image} 
              alt={product.name} 
              onLoad={() => setIsLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
            />
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          {/* Quick Action Overlay */}
          <motion.div 
             initial={{ y: 50, opacity: 0 }}
             whileHover={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.3 }}
             className="absolute bottom-4 left-0 right-0 px-4 z-20"
          >
             <div className="block w-full text-center bg-white/90 backdrop-blur-md text-brand-brown py-2 rounded-xl font-bold shadow-lg text-sm hover:bg-brand-sageDark hover:text-white transition-colors cursor-pointer">
                View Details
             </div>
          </motion.div>
        </Link>
        
        <div className="p-5 flex flex-col flex-grow relative z-20 bg-white/10 backdrop-blur-sm">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-xs uppercase tracking-widest text-brand-sageDark font-bold bg-brand-sage/20 px-2 py-0.5 rounded-md">{product.category}</span>
            <motion.button 
              whileTap={{ scale: 0.8 }} 
              className="text-brand-roseDark hover:text-brand-rose transition-colors"
            >
               <Heart size={18} />
            </motion.button>
          </div>
          
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="text-xl font-serif font-bold text-brand-brown mb-2 leading-tight group-hover:text-brand-sageDark transition-colors">
              {product.name}
            </h3>
          </Link>
          
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-brand-brown/10">
            <p className="text-xl font-bold text-brand-text">
              Ksh {product.price.toLocaleString()}
            </p>
            <motion.a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-brand-sage text-brand-brown hover:bg-green-500 hover:text-white transition-colors rounded-full shadow-sm"
              title="Order on WhatsApp"
            >
              <MessageCircle size={20} />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;