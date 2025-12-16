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
    return <div className="min-h-screen flex items-center justify-center bg-brand-cream"><Loader2 className="animate-spin text-brand-sageDark" size={48} /></div>;
  }

  return (
    <div className="w-full overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative bg-brand-rose/10 py-16 md:py-24 lg:py-32 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up text-center md:text-left">
              <span className="inline-block py-1 px-3 bg-brand-rose rounded-full text-brand-brown text-sm font-semibold tracking-wide mb-2">
                Est. 2023
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-brown leading-tight whitespace-pre-line">
                {content.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-brand-text/80 font-sans max-w-lg mx-auto md:mx-0">
                {content.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <Link 
                  to="/products" 
                  className="bg-brand-sageDark text-white px-8 py-3.5 rounded-full font-medium text-lg hover:bg-brand-brown transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  View Collection <ArrowRight size={18} />
                </Link>
                <a 
                  href={`https://wa.me/${content.whatsappNumber}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white border-2 border-brand-rose text-brand-brown px-8 py-3.5 rounded-full font-medium text-lg hover:bg-brand-rose/20 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  Custom Order
                </a>
              </div>
            </div>
            
            <div className="relative animate-fade-in-up delay-200">
               {/* Decorative blobs background */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-brand-sage/30 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-rose/40 rounded-full blur-3xl -z-10 -translate-x-10 translate-y-10"></div>
              
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src={content.heroImage1} 
                  alt="Crochet visual 1" 
                  className="rounded-2xl shadow-lg transform translate-y-8 object-cover h-64 w-full"
                />
                <img 
                  src={content.heroImage2} 
                  alt="Crochet visual 2" 
                  className="rounded-2xl shadow-lg object-cover h-64 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-4">Our Favorites</h2>
            <div className="w-24 h-1 bg-brand-sageDark mx-auto rounded-full"></div>
            <p className="mt-4 text-brand-text/70">Pieces our customers can't stop raving about.</p>
          </div>
          
          {productsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-brand-sageDark" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products" className="inline-flex items-center text-brand-sageDark font-semibold hover:text-brand-brown transition-colors border-b-2 border-brand-sageDark pb-1">
              See All Products <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Handmade? */}
      <section className="py-20 bg-brand-stone-50 border-y border-brand-rose/20 bg-[#F5F2EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-brand-roseDark">
                <Heart size={32} fill="currentColor" />
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-brown mb-3">Made with Love</h3>
              <p className="text-brand-text/80">Every stitch is made by hand, ensuring unique character and attention to detail that machines can't replicate.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-brand-sageDark">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-brown mb-3">Premium Materials</h3>
              <p className="text-brand-text/80">We use soft, durable, and skin-friendly yarns to ensure your items last for years and feel amazing.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-brand-brown">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-brown mb-3">Custom For You</h3>
              <p className="text-brand-text/80">Want a different color or size? We love custom orders! Let's create something special together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-brand-cream relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-10 left-10 text-9xl text-brand-rose/10 font-serif leading-none opacity-50 select-none">"</div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-12">Happy Customers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {TESTIMONIALS.map((t) => (
               <div key={t.id} className="bg-white p-6 rounded-2xl shadow-sm border border-brand-rose/10">
                 <div className="flex justify-center mb-4 text-yellow-400 gap-1">
                   {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                 </div>
                 <p className="text-brand-text/80 italic mb-4">"{t.text}"</p>
                 <div className="font-semibold text-brand-brown">{t.name}</div>
                 <div className="text-xs text-brand-sageDark font-medium uppercase tracking-wide">{t.location}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-16 px-4 bg-brand-sageDark text-white text-center">
        <h2 className="text-3xl font-serif font-bold mb-4">Ready to get cozy?</h2>
        <p className="mb-8 max-w-xl mx-auto text-brand-sage/90">Browse our shop for the perfect handmade gift, or contact us to start a custom project.</p>
        <Link 
          to="/products" 
          className="bg-white text-brand-sageDark px-8 py-3 rounded-full font-bold hover:bg-brand-cream transition-colors shadow-lg inline-block"
        >
          Start Shopping
        </Link>
      </section>

    </div>
  );
};

export default Home;