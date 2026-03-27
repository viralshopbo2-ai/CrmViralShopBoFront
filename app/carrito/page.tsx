'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { CartProvider, useCart } from '@/lib/cart-context';
import { useToast } from '@/lib/toast-context';
import { CONTACT_INFO } from '@/lib/config';
import { OrderFormDialog } from '@/components/order-form-dialog';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowLeft, MessageCircle, ClipboardList } from 'lucide-react';

function CarritoContent() {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const { error } = useToast();
  const [orderFormOpen, setOrderFormOpen] = useState(false);

  const shippingCost = items.length > 0 ? 9.99 : 0;
  const subtotal = total;
  const finalTotal = subtotal ;

  const handleCheckoutWhatsApp = () => {
    if (!CONTACT_INFO.whatsappNumber) {
      error('Por favor, configura tu número de WhatsApp en las variables de entorno');
      return;
    }

    // Construir mensaje con los productos del carrito
    let messageText = 'Hola! Quisiera hacer la siguiente compra:\n\n';
    messageText += '📦 *PRODUCTOS*:\n';
    
    items.forEach((item) => {
      messageText += `\n• ${item.product.name}\n`;
      messageText += `  Cantidad: ${item.quantity}\n`;
      messageText += `  Precio unitario: Bs. ${item.product.price.toFixed(2)}\n`;
      messageText += `  Subtotal: Bs. ${(item.product.price * item.quantity).toFixed(2)}`;
    });

    messageText += `\n\n💰 *RESUMEN DE PAGO*:\n`;
    messageText += `Subtotal: Bs. ${subtotal.toFixed(2)}\n`;
    messageText += `Envío: Bs. ${shippingCost.toFixed(2)}\n`;
    messageText += `*TOTAL: Bs. ${finalTotal.toFixed(2)}*\n\n`;
    messageText += '¿Podemos proceder con la compra?';

    const whatsappURL = `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappURL, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
              <ArrowLeft size={20} />
              Volver a Inicio
            </Link>

            <div className="glass-dark rounded-3xl p-12 text-center space-y-6 min-h-96 flex flex-col items-center justify-center">
              <div className="text-6xl">🛒</div>
              <h1 className="text-4xl font-bold text-white">Tu carrito está vacío</h1>
              <p className="text-lg text-white/60 max-w-md">
                Explora nuestros productos y agrega algunos a tu carrito para comenzar a comprar.
              </p>
              <Link
                href="/"
                className="glass-button bg-gradient-to-r from-blue-600 to-purple-600 text-white mt-8"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
            <ArrowLeft size={20} />
            Volver a Comprar
          </Link>

          <h1 className="text-5xl font-bold text-white mb-12">Tu Carrito de Compras</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Carrito Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="glass-card rounded-2xl p-4 sm:p-6 flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-white/60 mb-4">
                        {item.product.description}
                      </p>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 glass-dark rounded-xl p-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <Minus size={18} className="text-white" />
                        </button>
                        <span className="px-4 text-white font-semibold w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <Plus size={18} className="text-white" />
                        </button>
                      </div>

                      <div className="text-right space-y-1">
                        <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                          Bs. {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm"
                        >
                          <Trash2 size={16} />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-dark rounded-3xl p-6 space-y-6 sticky top-24">
                <h2 className="text-2xl font-bold text-white">Resumen del Pedido</h2>

                <div className="space-y-4 border-t border-white/10 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Subtotal</span>
                    <span className="text-white font-semibold">Bs. {subtotal.toFixed(2)}</span>
                  </div>

                  {/* <div className="flex justify-between items-center">
                    <span className="text-white/70">Envío a Domicilio</span>
                    <span className="text-white font-semibold">${shippingCost.toFixed(2)}</span>
                  </div> */}

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-400">Impuestos</span>
                    <span className="text-green-400 font-semibold">Incluido</span>
                  </div>

                  <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                      Bs. {finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full glass-button bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:shadow-lg inline-flex items-center justify-center gap-2 font-semibold"
                >
                  <MessageCircle size={20} />
                  Comprar por WhatsApp
                </button>

                <button
                  onClick={() => setOrderFormOpen(true)}
                  className="w-full glass-button bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white hover:shadow-lg inline-flex items-center justify-center gap-2 font-semibold"
                >
                  <ClipboardList size={20} />
                  Comprar por Formulario
                </button>

                <Link
                  href="/"
                  className="w-full glass-button text-white hover:bg-white/10 text-center"
                >
                  Continuar Comprando
                </Link>

                <OrderFormDialog open={orderFormOpen} onOpenChange={setOrderFormOpen} />

                {/* Shipping Info */}
                <div className="glass-card-sm p-4 space-y-2 border border-cyan-400/30">
                  <p className="text-sm font-semibold text-cyan-400">📦 Envío Gratis</p>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CarritoPage() {
  return (
    <CartProvider>
      <CarritoContent />
    </CartProvider>
  );
}
