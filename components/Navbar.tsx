import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-brand-cream/90 backdrop-blur-md shadow-sm border-b border-brand-rose/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown tracking-tight">
              Fatma's <span className="text-brand-sageDark">Crochet</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-sans text-lg font-medium transition-colors duration-200 ${
                  isActive(link.path) 
                    ? 'text-brand-sageDark underline underline-offset-4 decoration-2' 
                    : 'text-brand-text hover:text-brand-sageDark'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/products" 
              className="bg-brand-sageDark text-white px-5 py-2 rounded-full font-medium hover:bg-brand-brown transition-colors shadow-md flex items-center gap-2"
            >
              <ShoppingBag size={18} />
              Shop Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-brand-text hover:text-brand-sageDark focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-brand-cream border-t border-brand-rose/20 absolute w-full left-0 animate-fade-in-down shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-lg text-lg font-medium ${
                  isActive(link.path)
                    ? 'bg-brand-rose/30 text-brand-brown'
                    : 'text-brand-text hover:bg-brand-rose/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-brand-rose/20">
              <Link
                to="/products"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-brand-sageDark text-white px-4 py-3 rounded-xl font-medium shadow-sm active:scale-95 transition-transform"
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
