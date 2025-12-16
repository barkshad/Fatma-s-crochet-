import React from 'react';
import { Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-brand-cream min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-6">Behind the Stitches</h1>
          <div className="w-24 h-1 bg-brand-roseDark mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-brand-rose/20 overflow-hidden mb-12 animate-fade-in-up delay-100">
           <div className="md:flex">
             <div className="md:w-1/2 h-80 md:h-auto">
               <img 
                 src="https://picsum.photos/id/453/800/800" 
                 alt="Fatma working on crochet" 
                 className="w-full h-full object-cover"
               />
             </div>
             <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
               <h2 className="text-2xl font-serif font-bold text-brand-brown mb-4">Hi, I'm Fatma!</h2>
               <p className="text-brand-text/80 mb-4 leading-relaxed">
                 Welcome to my cozy corner of the internet. I started crocheting five years ago when I wanted to make a blanket for my nephew. What began as a small hobby quickly turned into a deep passion for fiber arts.
               </p>
               <p className="text-brand-text/80 mb-4 leading-relaxed">
                 There is something incredibly grounding about taking a simple string of yarn and turning it into something functional, warm, and beautiful.
               </p>
               <div className="flex items-center gap-2 text-brand-sageDark font-semibold mt-4">
                 <Heart size={20} fill="currentColor" />
                 <span>Made with intention</span>
               </div>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-fade-in-up delay-200">
          <div className="bg-[#F5F2EF] p-8 rounded-2xl">
            <h3 className="text-xl font-serif font-bold text-brand-brown mb-3">Why Handmade?</h3>
            <p className="text-brand-text/80">
              In a world of fast fashion, handmade items carry a soul. When you buy from Fatma's Crochet Corner, you aren't just buying a product; you are supporting a slow, sustainable art form. Each piece takes hours of dedication and focus.
            </p>
          </div>
          <div className="bg-brand-rose/10 p-8 rounded-2xl">
             <h3 className="text-xl font-serif font-bold text-brand-brown mb-3">My Promise</h3>
            <p className="text-brand-text/80">
              Quality is my top priority. I carefully select my yarns—from soft merino wools to durable cottons—to ensure your items don't just look good, but feel amazing and stand the test of time.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
