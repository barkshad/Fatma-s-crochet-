import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to WhatsApp with the message
    const text = `Hi, I'm ${formData.name}. ${formData.message}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-brand-cream min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl font-serif font-bold text-brand-brown mb-4">Get in Touch</h1>
          <p className="text-brand-text/70 max-w-xl mx-auto">
            Have a question about a product? Want to request a custom color or size? I'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          
          {/* Contact Info */}
          <div className="space-y-8 animate-fade-in-up delay-100">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-rose/20">
               <h3 className="text-2xl font-serif font-bold text-brand-brown mb-6">Contact Info</h3>
               
               <div className="space-y-6">
                 <div className="flex items-start gap-4">
                   <div className="bg-brand-sage/20 p-3 rounded-full text-brand-sageDark">
                     <Phone size={24} />
                   </div>
                   <div>
                     <p className="font-semibold text-brand-brown">WhatsApp</p>
                     <p className="text-brand-text/70">+123 456 7890</p>
                     <p className="text-xs text-brand-text/50">Fastest response time</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-4">
                   <div className="bg-brand-rose/20 p-3 rounded-full text-brand-roseDark">
                     <Mail size={24} />
                   </div>
                   <div>
                     <p className="font-semibold text-brand-brown">Email</p>
                     <p className="text-brand-text/70">hello@fatmascrochet.com</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-4">
                   <div className="bg-brand-brown/10 p-3 rounded-full text-brand-brown">
                     <MapPin size={24} />
                   </div>
                   <div>
                     <p className="font-semibold text-brand-brown">Workshop</p>
                     <p className="text-brand-text/70">Nairobi, Kenya</p>
                     <p className="text-xs text-brand-text/50">Online orders only</p>
                   </div>
                 </div>
               </div>
             </div>

             <div className="bg-brand-sageDark text-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-2">Business Hours</h3>
                <p className="opacity-90 mb-4">I reply to messages as soon as my hands are free from knitting needles!</p>
                <div className="space-y-2 text-sm opacity-90">
                  <div className="flex justify-between border-b border-white/20 pb-1">
                    <span>Mon - Fri</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 pb-1">
                    <span>Saturday</span>
                    <span>10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
             </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-brand-rose/20 animate-fade-in-up delay-200">
            <h3 className="text-2xl font-serif font-bold text-brand-brown mb-2">Send a Message</h3>
            <p className="text-brand-text/60 mb-8">This will open WhatsApp with your message pre-filled.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-brand-brown mb-1">Your Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-brand-rose/30 focus:border-brand-sageDark focus:ring-2 focus:ring-brand-sageDark/20 outline-none transition-all bg-brand-cream/30"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-brand-brown mb-1">Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-brand-rose/30 focus:border-brand-sageDark focus:ring-2 focus:ring-brand-sageDark/20 outline-none transition-all bg-brand-cream/30 resize-none"
                  placeholder="I'm interested in a custom baby blanket..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-brown text-white font-bold py-4 rounded-xl hover:bg-brand-sageDark transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Send via WhatsApp <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
