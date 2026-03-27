'use client';

import { Navigation } from '@/components/navigation';
import { CartProvider, useCart } from '@/lib/cart-context';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';

function CheckoutContent() {
  const { items, total, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    shippingMethod: 'standard',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shippingCost = formData.shippingMethod === 'express' ? 19.99 : 9.99;
  const finalTotal = total ;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
    }, 2000);
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Link href="/carrito" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
              <ArrowLeft size={20} />
              Volver al Carrito
            </Link>
            <div className="glass-dark rounded-3xl p-12 text-center">
              <p className="text-white/60">No hay productos en tu carrito</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Navigation />
        <div className="max-w-2xl w-full pt-20">
          <div className="glass-dark rounded-3xl p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="glass-card p-4 rounded-full">
                <Check size={48} className="text-green-400" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white">¡Pedido Confirmado!</h1>

            <div className="space-y-3 bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-white/70">
                Gracias por tu compra. Tu pedido ha sido confirmado exitosamente.
              </p>
              <p className="text-lg font-semibold text-white">
                Total: BS. {finalTotal.toFixed(2)}
              </p>
              <p className="text-sm text-white/60">
                Recibirás un email de confirmación en breve con el número de seguimiento.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-white font-semibold">Próximas acciones:</p>
              <ul className="text-white/70 text-sm space-y-2">
                <li>✓ Revisa tu email para confirmar tu pedido</li>
                <li>✓ Tu paquete será procesado en 24 horas</li>
                <li>✓ Recibirás actualizaciones de envío por SMS</li>
              </ul>
            </div>

            <Link
              href="/"
              className="glass-button bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg inline-block"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <Link href="/carrito" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
            <ArrowLeft size={20} />
            Volver al Carrito
          </Link>

          <h1 className="text-5xl font-bold text-white mb-12">Finalizar Compra</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="glass-dark rounded-3xl p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="glass-card p-2 rounded-full">1</span>
                    Información Personal
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Nombre Completo</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="glass-input"
                        placeholder="Juan Pérez"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-semibold mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="glass-input"
                          placeholder="juan@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-semibold mb-2">Teléfono</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="glass-input"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="glass-dark rounded-3xl p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="glass-card p-2 rounded-full">2</span>
                    Dirección de Envío
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Dirección</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="glass-input"
                        placeholder="Calle Principal 123, Apto 4B"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-semibold mb-2">Ciudad</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="glass-input"
                          placeholder="Madrid"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-semibold mb-2">Código Postal</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          required
                          className="glass-input"
                          placeholder="28001"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="glass-dark rounded-3xl p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="glass-card p-2 rounded-full">3</span>
                    Método de Envío
                  </h2>

                  <div className="space-y-3">
                    <label className="glass-card p-4 cursor-pointer hover:shadow-lg transition-shadow">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={formData.shippingMethod === 'standard'}
                        onChange={handleChange}
                        className="mr-4"
                      />
                      {/* <span className="text-white font-semibold">
                        Envío Estándar - $9.99 (3-5 días)
                      </span> */}
                    </label>

                    <label className="glass-card p-4 cursor-pointer hover:shadow-lg transition-shadow border-cyan-400/50">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={formData.shippingMethod === 'express'}
                        onChange={handleChange}
                        className="mr-4"
                      />
                      {/* <span className="text-white font-semibold">
                        Envío Express - $19.99 (1-2 días)
                      </span> */}
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full glass-button bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl text-lg py-4"
                >
                  Confirmar Pedido
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-dark rounded-3xl p-6 space-y-6 sticky top-24">
                <h2 className="text-2xl font-bold text-white">Resumen del Pedido</h2>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                      <div className="flex-1">
                        <p className="text-white font-semibold">{item.product.name}</p>
                        <p className="text-white/60">x{item.quantity}</p>
                      </div>
                      <span className="text-cyan-400 font-semibold">
                        Bs.{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-white/10 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Subtotal</span>
                    <span className="text-white font-semibold">Bs. {total.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Envío</span>
                    <span className="text-white font-semibold">Bs. {shippingCost.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                      Bs.{finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="glass-card-sm p-4 space-y-2 border border-green-400/30">
                  <p className="text-sm font-semibold text-green-400">✓ Compra Segura</p>
                  <p className="text-xs text-white/60">
                    Tu pago está protegido por encriptación SSL de 256 bits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <CartProvider>
      <CheckoutContent />
    </CartProvider>
  );
}
