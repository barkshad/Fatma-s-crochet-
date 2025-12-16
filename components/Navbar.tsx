import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'glass-nav h-20' : 'bg-transparent h-24'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="relative">
              <span className="absolute -inset-2 bg-brand-rose/50 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <span className="relative text-3xl md:text-4xl font-serif font-bold text-brand-brown tracking-tight">
                Fatma's <span className="text-brand-sageDark">Crochet</span>
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-2 rounded-full font-sans text-lg font-medium transition-all duration-300 spring-transition hover:bg-white/40 ${
                  isActive(link.path) 
                    ? 'text-brand-sageDark bg-white/60 shadow-sm' 
                    : 'text-brand-text hover:text-brand-sageDark'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/products" 
              className="bg-brand-sageDark/90 backdrop-blur-sm text-white px-6 py-2.5 rounded-full font-medium hover:bg-brand-brown transition-all duration-300 shadow-lg hover:shadow-brand-sageDark/30 hover:-translate-y-1 flex items-center gap-2 spring-transition"
            >
              <ShoppingBag size={18} />
              Shop Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-white/50 text-brand-text hover:text-brand-sageDark focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass border-t border-white/50 animate-fade-in-up">
          <div className="px-4 py-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-2xl text-lg font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-brand-rose/50 text-brand-brown shadow-inner'
                    : 'text-brand-text hover:bg-white/40'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-brand-brown/10">
              <Link
                to="/products"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-brand-sageDark text-white px-4 py-3 rounded-xl font-medium shadow-lg active:scale-95 transition-transform"
              >
                Browse Shop
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;