'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/lib/toast-context';
import { ShoppingCart, Star, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { success } = useToast();
  const [quantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAddedNotif, setShowAddedNotif] = useState(false);

  const handleAddCart = () => {
    addToCart(product, quantity);
    success(`${product.name} agregado al carrito`);
    setShowAddedNotif(true);
    setTimeout(() => setShowAddedNotif(false), 2000);
  };

  const handleNavigateToProduct = () => {
    router.push(`/producto/${product.id}`);
  };

  const inStock = product.stock > 0;

  return (
    <div className="group h-full">
      <div 
        onClick={handleNavigateToProduct}
        className="glass-card rounded-3xl overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-300 hover:border-white/30 cursor-pointer">
        {/* Image Container */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-white/5">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {product.featured && (
              <div className="glass-card-sm px-3 py-1">
                <span className="text-xs font-bold text-cyan-400">⭐ Destacado</span>
              </div>
            )}
            {inStock && product.stock > 0 && (
              <div className="glass-card-sm px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-green-600/20">
                <span className="text-xs font-bold text-emerald-400">✓ En Stock</span>
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className="absolute top-4 left-4 glass-card-sm p-2 hover:scale-110 transition-transform"
          >
            <Heart
              size={18}
              className={`${isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'}`}
            />
          </button>

          {/* Stock Indicator */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Agotado</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}
                />
              ))}
            </div>
            <span className="text-xs text-white/60">({product.reviews})</span>
          </div>

          {/* Name */}
          <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-white/60 line-clamp-2 flex-grow mb-4">
            {product.description}
          </p>

          {/* Price and Stock */}
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                Bs. {product.price.toFixed(2)}
              </span>
              <span className="text-xs text-white/50">
                {product.stock} disponibles
              </span>
            </div>

            {/* Add to Cart */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddCart();
              }}
              disabled={!inStock}
              className={`w-full py-2 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                inStock
                  ? 'glass-button bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600 hover:to-purple-600 text-white hover:shadow-lg active:scale-95'
                  : 'bg-white/5 text-white/50 cursor-not-allowed'
              }`}
            >
              <ShoppingCart size={16} />
              {inStock ? 'Agregar al carrito' : 'Agotado'}
            </button>

            {/* Added Notification */}
            {showAddedNotif && (
              <div className="absolute inset-0 glass-card rounded-3xl flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-4xl">✓</div>
                  <p className="text-white font-semibold">¡Agregado al carrito!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
