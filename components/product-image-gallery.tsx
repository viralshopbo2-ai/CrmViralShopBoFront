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
  autoPlayInterval = 4000,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);

  const handlePrevious = () =>
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const handleNext = () =>
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  // Swipe en mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? handleNext() : handlePrevious();
    touchStartX.current = null;
    setTimeout(() => setIsPaused(false), 3000);
  };

  // Auto-play
  useEffect(() => {
    if (images.length <= 1 || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }
    intervalRef.current = setInterval(() => {
      setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, autoPlayInterval);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [images.length, isPaused, autoPlayInterval]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className="glass-dark rounded-3xl p-3 sm:p-6 h-fit space-y-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Imagen principal — alto dinámico según la imagen */}
      <div
        className="relative w-full rounded-2xl overflow-hidden group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[selectedIndex]}
          alt={`${productName} - Imagen ${selectedIndex + 1}`}
          width={0}
          height={0}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="w-full h-auto max-h-[520px] object-contain transition-opacity duration-300"
          priority
        />

        {/* Botones de navegación — pequeños y discretos */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              aria-label="Imagen anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-all opacity-50 sm:opacity-0 group-hover:opacity-100 active:scale-90"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Imagen siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-all opacity-50 sm:opacity-0 group-hover:opacity-100 active:scale-90"
            >
              <ChevronRight size={14} />
            </button>

            {/* Contador minimalista en esquina inferior derecha */}
            <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
              <span className="text-white/70 text-[10px] sm:text-xs font-medium">
                {selectedIndex + 1}/{images.length}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Miniaturas en fila horizontal con scroll — sin wrap */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              aria-label={`Ver imagen ${index + 1}`}
              className={`relative shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                selectedIndex === index
                  ? 'ring-2 ring-cyan-400 opacity-100'
                  : 'opacity-40 hover:opacity-70'
              }`}
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

      {/* Dots de progreso */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              aria-label={`Ir a imagen ${index + 1}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                selectedIndex === index
                  ? 'w-5 bg-cyan-400'
                  : 'w-1 bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
