import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Star, Sparkles, MessageCircle, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { TESTIMONIALS } from '../constants';
import { useProducts } from '../hooks/useProducts';
import { useSiteContent } from '../hooks/useSiteContent';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Reveal, StaggerContainer, StaggerItem } from '../components/AnimationWrapper';

const Home: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const { content, loading: contentLoading } = useSiteContent();
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 3);
  
  // Parallax Setup
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const yHeroText = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const yHeroImage1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const yHeroImage2 = useTransform(scrollYProgress, [0, 1], [0, -120]);

  if (contentLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-sageDark" size={48} /></div>;
  }

  // Page Exit/Enter Variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="w-full overflow-x-hidden"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 perspective-1000 overflow-hidden">
        
        {/* Background Video Layer */}
        {content.heroBackgroundVideo && (
          <div className="absolute inset-0 z-0">
             <video 
               src={content.heroBackgroundVideo}
               autoPlay
               loop
               muted
               playsInline
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-brand-cream/80 backdrop-blur-[2px]"></div>
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Hero Text */}
          <motion.div style={{ y: yHeroText }} className="relative z-10">
            <div className={`p-8 md:p-12 rounded-[2rem] relative overflow-hidden ${content.heroBackgroundVideo ? 'bg-white/40 backdrop-blur-md border border-white/50 shadow-xl' : 'glass'}`}>
               {/* Shine Effect on Load */}
               <motion.div 
                 initial={{ x: '-100%' }}
                 animate={{ x: '200%' }}
                 transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
               />
               
              <Reveal direction="down">
                <span className="inline-block py-1.5 px-4 bg-brand-rose/80 backdrop-blur-sm rounded-full text-brand-brown text-sm font-bold tracking-widest uppercase mb-6 shadow-sm">
                  Est. 2023
                </span>
              </Reveal>

              <div className="overflow-hidden mb-6">
                <motion.h1 
                  initial={{ y: 100, rotateX: -20 }}
                  animate={{ y: 0, rotateX: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-brand-brown leading-tight origin-bottom"
                >
                  {content.heroTitle}
                </motion.h1>
              </div>

              <Reveal delay={0.2}>
                <p className="text-lg md:text-xl text-brand-text/80 font-sans leading-relaxed mb-8 font-medium">
                  {content.heroSubtitle}
                </p>
              </Reveal>

              <Reveal delay={0.4} className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/products" 
                  className="group bg-brand-sageDark text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-brown transition-all shadow-lg hover:shadow-brand-sageDark/40 flex items-center justify-center gap-2 relative overflow-hidden"
                >
                   {/* Button Ripple Effect could go here, but hover state is CSS for simplicity */}
                  <span className="relative z-10 flex items-center gap-2">
                     View Collection <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <a 
                  href={`https://wa.me/${content.whatsappNumber}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass px-8 py-4 rounded-full font-bold text-lg text-brand-brown hover:bg-white/80 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 border-2 border-brand-rose/20"
                >
                  <MessageCircle size={20} />
                  Custom Order
                </a>
              </Reveal>
            </div>
          </motion.div>
          
          {/* Hero Images - Parallax & Floating */}
          <div className="relative h-[600px] hidden md:block">
             <motion.div 
                style={{ y: yHeroImage1 }}
                initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                animate={{ opacity: 1, scale: 1, rotate: 3 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                className="absolute top-0 right-10 w-72 h-96 glass-card rounded-2xl overflow-hidden p-2 z-10"
             >
                <img 
                  src={content.heroImage1} 
                  alt="Crochet 1" 
                  className="w-full h-full object-cover rounded-xl"
                />
             </motion.div>

             <motion.div 
                style={{ y: yHeroImage2 }}
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: -3 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                className="absolute bottom-10 left-10 w-72 h-80 glass-card rounded-2xl overflow-hidden p-2 z-20"
             >
                <img 
                  src={content.heroImage2} 
                  alt="Crochet 2" 
                  className="w-full h-full object-cover rounded-xl"
                />
             </motion.div>
             
             {/* Decorative Elements (Only if no video) */}
             {!content.heroBackgroundVideo && (
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-sageDark/20 rounded-full blur-3xl z-0" 
               />
             )}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16 relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-4">Curated Favorites</h2>
            <div className="w-24 h-1.5 bg-brand-sageDark mx-auto rounded-full opacity-60"></div>
          </Reveal>
          
          {productsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-brand-sageDark" size={40} />
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <StaggerItem key={product.id}>
                   <ProductCard product={product} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          <Reveal delay={0.4} className="text-center mt-16">
            <Link to="/products" className="inline-flex items-center text-lg font-bold text-brand-brown bg-white/50 px-8 py-3 rounded-full hover:bg-white transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 border border-brand-rose/20 backdrop-blur-sm">
              Explore Full Catalog <ArrowRight size={20} className="ml-2" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Why Handmade? */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" delay={0.2}>
            {[
              { icon: <Heart size={32} fill="currentColor" />, title: "Made with Love", desc: "Every stitch is made by hand, ensuring unique character and attention to detail.", color: "text-brand-roseDark" },
              { icon: <Sparkles size={32} />, title: "Premium Materials", desc: "We use soft, durable, and skin-friendly yarns to ensure your items last for years.", color: "text-brand-sageDark" },
              { icon: <Star size={32} />, title: "Custom For You", desc: "Want a different color or size? We love custom orders! Let's create something special.", color: "text-brand-brown" }
            ].map((item, i) => (
              <StaggerItem key={i} className="h-full">
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="glass p-8 rounded-3xl text-center h-full group transition-all duration-300"
                >
                  <div className={`w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-brand-brown mb-4">{item.title}</h3>
                  <p className="text-brand-text/80 font-medium">{item.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-4xl font-serif font-bold text-brand-brown text-center mb-16">Happy Hearts</h2>
          </Reveal>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {TESTIMONIALS.map((t, i) => (
               <StaggerItem key={t.id} className={`${i === 1 ? 'md:translate-y-12' : ''}`}>
                 <div className="glass-card p-8 rounded-[2rem] relative h-full">
                   <div className="absolute top-6 right-8 text-6xl text-brand-sage/40 font-serif leading-none opacity-50 select-none">"</div>
                   <div className="flex mb-6 text-yellow-400 gap-1">
                     {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                   </div>
                   <p className="text-brand-text/90 italic text-lg mb-6 leading-relaxed relative z-10">{t.text}</p>
                   <div className="flex items-center gap-4 mt-auto">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-rose to-brand-sage rounded-full flex items-center justify-center font-bold text-brand-brown text-xl">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-brand-brown">{t.name}</div>
                        <div className="text-xs text-brand-sageDark font-bold uppercase tracking-wide">{t.location}</div>
                      </div>
                   </div>
                 </div>
               </StaggerItem>
             ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 px-4 text-center mt-12">
        <Reveal direction="up" className="max-w-4xl mx-auto">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="glass-heavy p-12 md:p-16 rounded-[3rem] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-rose via-brand-sage to-brand-brown"></div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-6">Ready to get cozy?</h2>
            <p className="mb-10 text-xl text-brand-text/80 max-w-2xl mx-auto">Browse our shop for the perfect handmade gift, or contact us to start a custom project.</p>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Link 
                to="/products" 
                className="inline-block bg-brand-brown text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-brand-sageDark transition-all shadow-xl hover:shadow-2xl"
              >
                Start Shopping
              </Link>
            </motion.div>
          </motion.div>
        </Reveal>
      </section>

    </motion.div>
  );
};

export default Home;