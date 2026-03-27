import Link from 'next/link';
import { ArrowRight, Truck, Star, ShieldCheck } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-20 overflow-hidden flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block glass-card-sm">
                <span className="text-sm font-semibold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
                  ✨ Descubre Nuestros Productos Premium
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight text-balance">
                Productos únicos para un <span className="gradient-text-purple">estilo único</span>
              </h1>

              <p className="text-lg text-white/70 max-w-lg leading-relaxed">
                Encuentra miles de productos de calidad con envío rápido a domicilio. Desde electrónica hasta accesorios, todo lo que necesitas en un solo lugar.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#products"
                className="glass-button group bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600 hover:to-purple-600 text-white inline-flex items-center justify-center gap-2"
              >
                Explorar Tienda
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              {/* <button className="glass-button text-white hover:bg-white/10">
                Ver Categorías
              </button> */}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="glass-card-sm p-3 space-y-2">
                <div className="text-cyan-400">
                  <Truck size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Envío Rápido</p>
                  <p className="text-xs text-white/60">1-3 días</p>
                </div>
              </div>

              <div className="glass-card-sm p-3 space-y-2">
                <div className="text-green-400">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">100% Seguro</p>
                  <p className="text-xs text-white/60">Garantizado</p>
                </div>
              </div>

              <div className="glass-card-sm p-3 space-y-2">
                <div className="text-yellow-400">
                  <Star size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">4.8 Rating</p>
                  <p className="text-xs text-white/60">+5k reviews</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-full aspect-video">
            <div className="relative w-full aspect-video">

              {/* Mobile Image */}
              <img
                src="/viral-shop.jpeg"
                alt="preview"
                className="w-full h-full object-cover md:hidden rounded-3xl"
              />

              {/* Desktop Video */}
              <div className="hidden md:block absolute inset-0">
                <video
                  src="/viral-shop.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent rounded-3xl" />
            </div>

            {/* Floating Card */}
            {/* <div className="absolute bottom-10 -left-10 glass-card max-w-xs">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-white">Oferta Especial</p>
                <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                  Hasta 50% OFF
                </p>
                <p className="text-xs text-white/70">En productos seleccionados</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
