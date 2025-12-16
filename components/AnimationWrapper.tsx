import React, { useRef } from 'react';
import { motion, useInView, UseInViewOptions } from 'framer-motion';

interface AnimationWrapperProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  viewport?: UseInViewOptions;
}

export const Reveal: React.FC<AnimationWrapperProps> = ({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = "",
  viewport = { once: true, amount: 0.2 }
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, viewport);

  const getVariants = () => {
    const distance = 50;
    const variants = {
      hidden: { opacity: 0, y: 0, x: 0 },
      visible: { opacity: 1, y: 0, x: 0 }
    };

    switch (direction) {
      case 'up': variants.hidden.y = distance; break;
      case 'down': variants.hidden.y = -distance; break;
      case 'left': variants.hidden.x = distance; break;
      case 'right': variants.hidden.x = -distance; break;
      case 'none': break;
    }

    return variants;
  };

  return (
    <motion.div
      ref={ref}
      variants={getVariants()}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const ParallaxImage: React.FC<{ src: string, alt: string, className?: string, speed?: number }> = ({ src, alt, className = "", speed = 1 }) => {
  // Simple parallax shim if we don't pass useScroll from parent, 
  // but simpler to just use CSS float animation for floating cards mixed with entrance
  return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={className}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </motion.div>
  );
};

export const StaggerContainer: React.FC<{ children: React.ReactNode, className?: string, delay?: number }> = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const StaggerItem: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}