import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Star, Sparkles, MessageCircle, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { TESTIMONIALS } from '../constants';
import { useProducts } from '../hooks/useProducts';
import { useSiteContent } from '../hooks/useSiteContent';

const Home: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const { content, loading: contentLoading } = useSiteContent();
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 3);

  if (contentLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-sageDark" size={48} /></div>;
  }

  return (
    <div className="w-full overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Hero Text */}
          <div className="glass p-8 md:p-12 rounded-[2rem] animate-fade-in-up relative z-10">
            <span className="inline-block py-1.5 px-4 bg-brand-rose/80 backdrop-blur-sm rounded-full text-brand-brown text-sm font-bold tracking-widest uppercase mb-6 shadow-sm">
              Est. 2023
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-brand-brown leading-tight mb-6">
              {content.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-brand-text/80 font-sans leading-relaxed mb-8">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/products" 
                className="group bg-brand-sageDark text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-brown transition-all shadow-lg hover:shadow-brand-sageDark/40 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                View Collection <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href={`https://wa.me/${content.whatsappNumber}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="glass px-8 py-4 rounded-full font-bold text-lg text-brand-brown hover:bg-white/80 transition-all shadow-sm hover:shadow-md hover:-translate-y-1 flex items-center justify-center gap-2 border-2 border-brand-rose/20"
              >
                <MessageCircle size={20} />
                Custom Order
              </a>
            </div>
          </div>
          
          {/* Hero Images - Floating Glass Cards */}
          <div className="relative h-[600px] hidden md:block animate-fade-in-up delay-200">
             <div className="absolute top-0 right-10 w-72 h-96 glass-card rounded-2xl overflow-hidden p-2 transform rotate-3 hover:rotate-0 transition-transform duration-700 animate-float">
                <img 
                  src={content.heroImage1} 
                  alt="Crochet 1" 
                  className="w-full h-full object-cover rounded-xl"
                />
             </div>
             <div className="absolute bottom-10 left-10 w-72 h-80 glass-card rounded-2xl overflow-hidden p-2 transform -rotate-3 hover:rotate-0 transition-transform duration-700 animate-float-delayed z-20">
                <img 
                  src={content.heroImage2} 
                  alt="Crochet 2" 
                  className="w-full h-full object-cover rounded-xl"
                />
             </div>
             {/* Decorative element */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-sageDark/20 rounded-full blur-2xl z-0"></div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-4">Curated Favorites</h2>
            <div className="w-24 h-1.5 bg-brand-sageDark mx-auto rounded-full opacity-60"></div>
          </div>
          
          {productsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-brand-sageDark" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, idx) => (
                <div key={product.id} className={`animate-fade-in-up`} style={{animationDelay: `${idx * 150}ms`}}>
                   <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link to="/products" className="inline-flex items-center text-lg font-bold text-brand-brown bg-white/50 px-8 py-3 rounded-full hover:bg-white transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 border border-brand-rose/20 backdrop-blur-sm">
              Explore Full Catalog <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Handmade? - Glass Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Heart size={32} fill="currentColor" />, title: "Made with Love", desc: "Every stitch is made by hand, ensuring unique character and attention to detail.", color: "text-brand-roseDark" },
              { icon: <Sparkles size={32} />, title: "Premium Materials", desc: "We use soft, durable, and skin-friendly yarns to ensure your items last for years.", color: "text-brand-sageDark" },
              { icon: <Star size={32} />, title: "Custom For You", desc: "Want a different color or size? We love custom orders! Let's create something special.", color: "text-brand-brown" }
            ].map((item, i) => (
              <div key={i} className="glass p-8 rounded-3xl text-center hover-lift spring-transition group">
                <div className={`w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold text-brand-brown mb-4">{item.title}</h3>
                <p className="text-brand-text/80 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Masonry feel */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-brand-brown text-center mb-16">Happy Hearts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {TESTIMONIALS.map((t, i) => (
               <div key={t.id} className={`glass-card p-8 rounded-[2rem] relative ${i === 1 ? 'md:translate-y-12' : ''}`}>
                 <div className="absolute top-6 right-8 text-6xl text-brand-sage/40 font-serif leading-none opacity-50 select-none">"</div>
                 <div className="flex mb-6 text-yellow-400 gap-1">
                   {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                 </div>
                 <p className="text-brand-text/90 italic text-lg mb-6 leading-relaxed relative z-10">{t.text}</p>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-rose to-brand-sage rounded-full flex items-center justify-center font-bold text-brand-brown text-xl">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-brand-brown">{t.name}</div>
                      <div className="text-xs text-brand-sageDark font-bold uppercase tracking-wide">{t.location}</div>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 px-4 text-center mt-12">
        <div className="max-w-4xl mx-auto glass-heavy p-12 md:p-16 rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-rose via-brand-sage to-brand-brown"></div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-6">Ready to get cozy?</h2>
          <p className="mb-10 text-xl text-brand-text/80 max-w-2xl mx-auto">Browse our shop for the perfect handmade gift, or contact us to start a custom project.</p>
          <Link 
            to="/products" 
            className="inline-block bg-brand-brown text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-brand-sageDark transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Start Shopping
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;