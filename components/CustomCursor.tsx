import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring physics for smooth delay
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only active on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over interactive elements
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // Don't render on mobile to prevent artifacts
  if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <>
      {/* Main Dot - Follows exactly */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-brand-brown rounded-full pointer-events-none z-[9999] mix-blend-exclusion"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      
      {/* Trailing Ring/Shape - Has spring delay */}
      <motion.div
        className="fixed top-0 left-0 border border-brand-brown rounded-full pointer-events-none z-[9998] mix-blend-exclusion bg-white"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          height: isHovering ? 64 : 32,
          width: isHovering ? 64 : 32,
          opacity: isHovering ? 1 : 0.5,
          scale: isHovering ? 1.2 : 1,
          filter: isHovering ? "blur(0px)" : "blur(2px)",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 28
        }}
      >
        {/* Optional text inside cursor when hovering */}
        <motion.span 
          className="absolute inset-0 flex items-center justify-center text-[8px] font-bold uppercase tracking-widest text-brand-brown"
          animate={{ opacity: isHovering ? 1 : 0 }}
        >
          View
        </motion.span>
      </motion.div>
    </>
  );
};

export default CustomCursor;