import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PixelSnow from './PixelSnow';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate from 0 to 100 over 2 seconds
    const duration = 2000;
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      // const nextProgress = Math.min(100, Math.floor((currentStep / steps) * 100));
      // Ease out cubic
      const easeProgress = Math.floor(100 * (1 - Math.pow(1 - currentStep/steps, 3)));
      setProgress(Math.min(100, easeProgress));

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 400); // Wait a tiny bit at 100%
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Format with leading zeros
  const displayNum = progress.toString().padStart(3, '0');

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1c] overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-40">
        <PixelSnow 
          color="#06b6d4"
          flakeSize={0.01}
          minFlakeSize={1.25}
          pixelResolution={100}
          speed={1.5}
          density={0.4}
          direction={125}
          brightness={1}
        />
      </div>

      <div className="relative w-[500px] h-[500px] flex items-center justify-center z-10">
        {/* Outer dashed ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-[#1f2940] opacity-50"
        />

        {/* Text ring simulation */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-4 rounded-full border border-cyan-900/30 opacity-70 flex items-center justify-center"
        >
          {/* We can put some tiny dots to simulate the orbital markers */}
          <div className="absolute top-0 w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4]"></div>
          <div className="absolute bottom-0 w-1 h-1 bg-indigo-400 rounded-full"></div>
          <div className="absolute left-0 w-1 h-1 bg-cyan-400 rounded-full"></div>
        </motion.div>

        {/* Middle thin ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-12 rounded-full border border-indigo-900/40"
        >
           <div className="absolute right-0 top-1/2 w-1 h-1 bg-cyan-500 rounded-full"></div>
        </motion.div>

        {/* Thick inner ring segments */}
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-20 w-[340px] h-[340px] opacity-40 text-cyan-700"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="60 40" />
        </motion.svg>
        
        {/* Counter-rotating inner ring */}
        <motion.svg
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-24 w-[308px] h-[308px] opacity-60 text-indigo-500"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="15 5 5 5" />
        </motion.svg>

        {/* Deep inner glowing ring */}
        <div className="absolute inset-32 rounded-full border border-cyan-500/20 shadow-[inset_0_0_40px_rgba(6,182,212,0.1)]"></div>

        {/* Center Percentage Text */}
        <div className="absolute z-10 flex items-center justify-center">
          <span className="text-6xl md:text-8xl font-mono font-light tracking-widest text-cyan-100 mix-blend-screen" style={{ textShadow: '0 0 20px rgba(6,182,212,0.5)' }}>
            {displayNum}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
