'use client';

import { Header } from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { CartProvider } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';

function CartContent() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  const shipping = items.length > 0 ? (total > 100 ? 0 : 10) : 0;
  const subtotal = total;
  const finalTotal = total ;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <Link href="/" className="flex items-center gap-2 text-primary hover:gap-3 transition-all mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver a la tienda
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-12">Tu Carrito de Compras</h1>

        {items.length === 0 ? (
          <div className="glass p-12 rounded-2xl text-center">
            <p className="text-xl text-muted-foreground mb-6">Tu carrito está vacío</p>
            <Link href="/" className="glass-button bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-none">
              Explorar Productos
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2">
              <div className="glass p-6 rounded-2xl">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 border-b border-white/20 last:border-b-0 last:pb-0"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        <p className="font-bold gradient-text mt-2">Bs. {item.price}</p>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4 text-foreground" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="w-12 text-center bg-white/30 border border-white/20 rounded-lg text-foreground"
                          min="1"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4 text-foreground" />
                        </button>
                      </div>

                      {/* Total */}
                      <div className="text-right w-20">
                        <p className="font-semibold text-foreground">
                          Bs. {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-4">
                  <Link
                    href="/"
                    className="glass-button text-foreground hover:bg-white/70"
                  >
                    Continuar Comprando
                  </Link>
                  <button
                    onClick={() => clearCart()}
                    className="glass-button text-red-500 hover:bg-red-500/20"
                  >
                    Limpiar Carrito
                  </button>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="glass p-6 rounded-2xl h-fit sticky top-24">
              <h2 className="text-2xl font-bold text-foreground mb-6">Resumen</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold">Bs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Envío</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-500">Gratis</span>
                    ) : (
                      `Bs. ${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    ✨ Envío gratis
                  </p>
                )}
              </div>

              <div className="border-t border-white/20 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span className="gradient-text">Bs. {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full glass-button bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-none block text-center hover:shadow-lg"
              >
                Proceder al Checkout
              </Link>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Envío a domicilio en 1-3 días hábiles
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <CartProvider>
      <CartContent />
    </CartProvider>
  );
}
