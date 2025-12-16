import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from './constants';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans text-brand-text bg-brand-cream relative selection:bg-brand-roseDark selection:text-white">
        
        {/* Cinematic Atmospheric Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          {/* Warm glow top left - simulates sun flare */}
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-brand-rose/60 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob"></div>
          
          {/* Cool mist top right */}
          <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-brand-sage/50 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-blob animation-delay-2000"></div>
          
          {/* Deep grounding tone bottom left */}
          <div className="absolute bottom-[-20%] left-[-10%] w-[40vw] h-[40vw] bg-brand-brown/5 rounded-full mix-blend-normal filter blur-[80px] opacity-40 animate-blob animation-delay-4000"></div>
          
          {/* Center highlight - mimics studio lighting */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full mix-blend-overlay filter blur-[100px] opacity-40"></div>
        </div>

        <Navbar />
        
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <Footer />

        {/* Floating WhatsApp Button - Refined Design */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_40px_-10px_rgba(37,211,102,0.6)] hover:shadow-[0_20px_50px_-10px_rgba(37,211,102,0.8)] transition-all duration-500 hover:scale-105 spring-transition flex items-center justify-center border border-white/20 backdrop-blur-sm group"
          aria-label="Chat on WhatsApp"
        >
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
          <MessageCircle size={32} fill="white" className="relative z-10" />
        </a>
      </div>
    </Router>
  );
}

export default App;