import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Heart, Mail, Lock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-brown text-brand-cream mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-brand-roseDark">Fatma's Crochet Corner</h3>
            <p className="text-brand-cream/80 max-w-xs mx-auto md:mx-0 font-sans">
              Handmade with love, care, and the finest materials. Bringing warmth to your home and wardrobe.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a 
                href="https://www.instagram.com/xx.fxtma_xx?igsh=MWk1d2dmODhkN2RkcQ==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-brand-roseDark transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-brand-roseDark transition-colors" aria-label="Facebook"><Facebook size={24} /></a>
              <a href="mailto:hello@fatmascrochet.com" className="hover:text-brand-roseDark transition-colors" aria-label="Email"><Mail size={24} /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-serif font-semibold text-brand-roseDark">Explore</h4>
            <ul className="space-y-2 font-sans">
              <li><Link to="/" className="hover:text-brand-roseDark transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-brand-roseDark transition-colors">Shop All</Link></li>
              <li><Link to="/about" className="hover:text-brand-roseDark transition-colors">About Fatma</Link></li>
              <li><Link to="/contact" className="hover:text-brand-roseDark transition-colors">Custom Orders</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-4">
            <h4 className="text-xl font-serif font-semibold text-brand-roseDark">Visit Us</h4>
            <div className="font-sans text-brand-cream/80">
              <p>Monday - Friday: 9am - 5pm</p>
              <p>Weekends: Closed for crafting</p>
              <p className="mt-4">Based in Kenya</p>
              <p>Shipping Worldwide</p>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-cream/20 mt-12 pt-8 text-center font-sans text-sm text-brand-cream/60 flex flex-col items-center">
          <p className="flex items-center justify-center gap-1 mb-2">
            © {new Date().getFullYear()} Fatma's Crochet Corner. Made with <Heart size={14} className="text-brand-roseDark fill-current" />
          </p>
          <Link to="/admin" className="flex items-center gap-1 text-xs opacity-50 hover:opacity-100 transition-opacity">
            <Lock size={12} /> Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
