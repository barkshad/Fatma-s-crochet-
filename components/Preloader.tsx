import React from 'react';
import { motion } from 'framer-motion';

const Preloader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-brand-cream flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 3.5 }}
        className="relative"
      >
        {/* Animated Yarn Ball/Logo SVG */}
        <svg width="200" height="200" viewBox="0 0 200 200" className="stroke-brand-brown stroke-[3] fill-none overflow-visible">
          {/* A stylized 'F' or Loop */}
          <motion.path
            d="M 60 100 C 60 100, 50 60, 100 60 C 150 60, 150 100, 100 100 C 50 100, 50 140, 100 140 C 150 140, 140 100, 140 100"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            strokeLinecap="round"
          />
          
          {/* The Needle/Hook */}
          <motion.line
            x1="180" y1="20" x2="140" y2="60"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="stroke-brand-sageDark stroke-[4]"
          />
        </svg>

        <motion.div 
          className="mt-6 text-center font-serif text-2xl font-bold text-brand-brown tracking-widest"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          FATMA'S
        </motion.div>

        <motion.p
          className="mt-2 text-center font-sans text-xs text-brand-sageDark uppercase tracking-[0.3em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          Crochet Corner
        </motion.p>
      </motion.div>

      {/* Wipe effect for exit */}
      <motion.div
        className="absolute inset-0 bg-brand-brown z-10"
        initial={{ scaleY: 0, transformOrigin: "bottom" }}
        exit={{ scaleY: 1, transformOrigin: "bottom" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 3 }}
        style={{ pointerEvents: 'none', display: 'none' }} // Logic handled in App.tsx via simple unmount or use specific transition
      />
    </div>
  );
};

export default Preloader;