'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface CompareSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function CompareSlider({ 
  beforeImage, 
  afterImage, 
  beforeLabel = "Before", 
  afterLabel = "After" 
}: CompareSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Preload images
    const img1 = new Image();
    const img2 = new Image();
    let loaded = 0;

    const handleLoad = () => {
      loaded++;
      if (loaded === 2) {
        setIsLoaded(true);
      }
    };

    img1.onload = handleLoad;
    img2.onload = handleLoad;
    img1.src = beforeImage;
    img2.src = afterImage;
  }, [beforeImage, afterImage]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden cursor-col-resize select-none"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ touchAction: 'none' }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
          />
        </div>
      )}

      {/* Before Image */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={beforeImage}
            alt={beforeLabel}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
          {beforeLabel}
        </div>
      </div>

      {/* After Image */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={afterImage}
            alt={afterLabel}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
        <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
          {afterLabel}
        </div>
      </div>

      {/* Slider Handle */}
      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize"
        style={{ left: `${sliderPosition}%` }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-300 flex items-center justify-center">
          <div className="w-1 h-4 bg-gray-400 rounded-full mx-0.5"></div>
          <div className="w-1 h-4 bg-gray-400 rounded-full mx-0.5"></div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -10 }}
        transition={{ delay: 0.3 }}
        className="absolute top-4 left-4 px-2 py-1 bg-black/50 text-white text-sm rounded backdrop-blur-sm"
      >
        {beforeLabel}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -10 }}
        transition={{ delay: 0.3 }}
        className="absolute top-4 right-4 px-2 py-1 bg-black/50 text-white text-sm rounded backdrop-blur-sm"
      >
        {afterLabel}
      </motion.div>
    </motion.div>
  );
}