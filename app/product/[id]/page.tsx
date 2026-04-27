'use client';

import { Header } from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { CartProvider } from '@/context/CartContext';
import { getProductById, products } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Truck, Shield, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

function ProductContent({ id }: { id: string }) {
  const product = getProductById(id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <p className="text-center text-muted-foreground text-lg">Producto no encontrado</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      category: product.category,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <Link href="/" className="flex items-center gap-2 text-primary hover:gap-3 transition-all mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver a la tienda
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Image */}
          <div className="glass p-6 rounded-2xl flex items-center justify-center h-96 lg:h-full min-h-96">
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              className="object-contain"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            <div className="glass p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.rating)
                          ? 'fill-accent text-accent'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-foreground">{product.rating}/5</span>
              </div>
              <p className="text-sm text-muted-foreground">
                ({product.reviews} reseñas de clientes)
              </p>
            </div>

            {/* Price */}
            <div className="glass p-6 rounded-2xl">
              <p className="text-5xl font-bold gradient-text mb-2">Bs. {product.price}</p>
              {product.stock ? (
                <p className="text-green-500 font-semibold">✓ En Stock</p>
              ) : (
                <p className="text-red-500 font-semibold">✗ Agotado</p>
              )}
            </div>

            {/* Shipping Info */}
            <div className="glass p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Envío Rápido</p>
                  <p className="text-sm text-muted-foreground">
                    Entrega en 1-2 dias hábiles
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Compra Segura</p>
                  <p className="text-sm text-muted-foreground">
                    Protección al comprador garantizada
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="glass p-6 rounded-2xl">
              <p className="text-sm font-semibold text-foreground mb-3">Cantidad</p>
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Minus className="w-5 h-5 text-foreground" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center bg-white/30 border border-white/20 rounded-lg text-foreground font-semibold text-lg"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.stock}
                className={`w-full glass-button text-lg font-semibold ${
                  addedToCart
                    ? 'bg-green-500 border-green-500 text-white'
                    : product.stock
                    ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-white border-none hover:shadow-lg'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                {addedToCart ? 'Pedir ahora' : 'Agotado'}
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-8">Productos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  return (
    <CartProvider>
      <ProductContent id={id} />
    </CartProvider>
  );
}
