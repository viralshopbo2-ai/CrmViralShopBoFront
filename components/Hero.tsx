'use client';

import Link from 'next/link';
import { ArrowRight, Truck, Gift, Shield } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <div className="glass inline-block px-6 py-2 mb-6 rounded-full">
          <p className="text-sm font-semibold text-primary">
            ✨ Compra con confianza - Entrega garantizada
          </p>
        </div>

        {/* Main Content */}
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
          <span className="gradient-text">La mejor</span> tienda
          <br />
          de artículos premium
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Descubre miles de productos de dropshipping con envío rápido a tu domicilio. Electrónica, accesorios, hogar y mucho más.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/shop"
            className="glass-button bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-none hover:shadow-xl inline-flex items-center justify-center gap-2"
          >
            Explorar Tienda
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="glass-button text-foreground hover:bg-white/70"
          >
            Más Información
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="glass p-6 rounded-2xl">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Envío Rápido</h3>
            <p className="text-sm text-muted-foreground">
              Entrega a domicilio en 1-3 días hábiles
            </p>
          </div>

          <div className="glass p-6 rounded-2xl">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">100% Seguro</h3>
            <p className="text-sm text-muted-foreground">
              Pago seguro y protección al comprador
            </p>
          </div>

          <div className="glass p-6 rounded-2xl">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Ofertas Exclusivas</h3>
            <p className="text-sm text-muted-foreground">
              Descuentos y promociones especiales
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
