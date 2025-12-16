import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Star, Sparkles, MessageCircle, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { TESTIMONIALS } from '../constants';
import { useProducts } from '../hooks/useProducts';
import { useSiteContent } from '../hooks/useSiteContent';
import { motion } from 'framer-motion';
import { Reveal, StaggerContainer, StaggerItem } from '../components/AnimationWrapper';

// Animated Text Component
const AnimatedCrochetText: React.FC<{ text: string }> = ({ text }) => {
  // Split text into words and then letters
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const child = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.8,
      rotate: -10
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap justify-center gap-x-4 gap-y-2"
    >
      {words.map((word, i) => (
        <div key={i} className="flex whitespace-nowrap">
          {word.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={child}
              className="text-4xl md:text-7xl lg:text-8xl font-serif crochet-text inline-block origin-bottom"
              style={{
                // Add slight random rotation to each letter for handmade feel
                rotate: Math.random() * 6 - 3
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      ))}
    </motion.div>
  );
};

const Home: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const { content, loading: contentLoading } = useSiteContent();
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 3);
  
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
      
      {/* Hero Section - Redesigned for Clarity and Immersion */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        
        {/* Background Video Layer - Full Clarity */}
        {content.heroBackgroundVideo ? (
          <div className="absolute inset-0 z-0">
             <video 
               src={content.heroBackgroundVideo}
               autoPlay
               loop
               muted
               playsInline
               className="w-full h-full object-cover"
             />
             {/* Gradient overlay: Transparent in center/top to show video, dark at bottom for text contrast if needed, 
                 but mostly we rely on the text effect itself. Adding a very subtle vignette. */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none"></div>
          </div>
        ) : (
          /* Fallback if no video */
          <div className="absolute inset-0 z-0 bg-brand-sageDark">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=2000')] bg-cover bg-center opacity-50 mix-blend-overlay"></div>
          </div>
        )}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center">
          
          <div className="mb-8">
            <Reveal direction="down">
              <span className="inline-block py-2 px-6 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-sm font-bold tracking-[0.2em] uppercase mb-8 shadow-lg">
                Est. 2023 • Handmade in Kenya
              </span>
            </Reveal>

            {/* Main Title with Crochet Animation */}
            <div className="mb-8 py-2">
               <AnimatedCrochetText text={content.heroTitle} />
            </div>
            
            <Reveal delay={0.6}>
              <p className="text-xl md:text-2xl text-white font-sans font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                {content.heroSubtitle}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.8} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link 
              to="/products" 
              className="group bg-brand-roseDark text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-brand-brown transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 flex items-center justify-center gap-3"
            >
               <span>View Collection</span> 
               <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href={`https://wa.me/${content.whatsappNumber}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-md border-2 border-white/50 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-brand-brown transition-all duration-300 shadow-lg flex items-center justify-center gap-3"
            >
              <MessageCircle size={22} />
              <span>Custom Order</span>
            </a>
          </Reveal>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent mx-auto mb-2"></div>
          <span className="text-xs uppercase tracking-widest">Scroll</span>
        </motion.div>
      </section>

      {/* Featured Section */}
      <section className="py-24 relative bg-brand-cream">
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
      <section className="py-20 bg-white">
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
                  className="bg-brand-cream p-8 rounded-3xl text-center h-full group transition-all duration-300 border border-brand-rose/20 hover:shadow-xl"
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
      <section className="py-20 relative bg-brand-cream">
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