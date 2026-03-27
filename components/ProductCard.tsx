'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      category: product.category,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="glass-card group cursor-pointer h-full flex flex-col">
        {/* Image Container */}
        <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {product.inStock && (
            <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold">
              En Stock
            </div>
          )}

          {product.shippingDays <= 2 && (
            <div className="absolute top-3 left-3 bg-blue-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold">
              Envío Rápido
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {product.category}
          </p>
          
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-auto">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="text-sm font-semibold text-foreground">{product.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviews} reviews)
            </span>
          </div>

          {/* Shipping Info */}
          <p className="text-xs text-muted-foreground">
            📦 Entrega en {product.shippingDays} {product.shippingDays === 1 ? 'día' : 'días'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
          <div>
            <p className="text-2xl font-bold gradient-text">${product.price}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className={`glass-button flex items-center gap-2 text-sm ${
              addedToCart
                ? 'bg-green-500 border-green-500 text-white'
                : 'bg-white/50 text-foreground hover:bg-white/70'
            } transition-all`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">{addedToCart ? 'Agregado' : 'Agregar'}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
