'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  autoPlayInterval?: number;
}

export function ProductImageGallery({ 
  images, 
  productName,
  autoPlayInterval = 4000 
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Auto-play del carrusel
  useEffect(() => {
    if (images.length <= 1 || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length, isPaused, autoPlayInterval]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div 
      className="glass-dark rounded-3xl p-6 h-fit space-y-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Imagen principal */}
      <div className="relative w-full rounded-2xl overflow-hidden group" style={{ height: '420px' }}>
      <Image
          src={images[selectedIndex]}
          alt={`${productName} - Imagen ${selectedIndex + 1}`}
          fill
          className="object-contain transition-transform duration-500"
          priority
        />
        
        {/* Controles de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 glass-button w-10 h-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 glass-button w-10 h-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={24} />
            </button>

            {/* Indicador de posición */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-card px-3 py-1.5 rounded-full">
              <span className="text-white text-sm font-medium">
                {selectedIndex + 1} / {images.length}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Miniaturas debajo de la imagen principal */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden transition-all duration-300 ${
                selectedIndex === index
                  ? 'ring-2 ring-cyan-400 scale-105 opacity-100'
                  : 'opacity-50 hover:opacity-80 hover:scale-102'
              }`}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} - Miniatura ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Indicadores de progreso (dots) */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                selectedIndex === index
                  ? 'w-6 bg-cyan-400'
                  : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
