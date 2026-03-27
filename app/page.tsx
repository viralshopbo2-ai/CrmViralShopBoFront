'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { ProductGrid } from '@/components/product-grid';
import { ContactSection } from '@/components/contact-section';
import { CartProvider } from '@/lib/cart-context';
import { products, categories, getFeaturedProducts } from '@/lib/products';
import { Mail, Facebook, Instagram, Twitter } from 'lucide-react';

function HomeContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const displayedProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
    alert('¡Gracias por suscribirte!');
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Category Filter */}
      <section id="products" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`glass-button whitespace-nowrap ${selectedCategory === null
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-white/50'
                : 'hover:bg-white/10'
              }`}
          >
            Todos los Productos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`glass-button whitespace-nowrap ${selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-white/50'
                  : 'hover:bg-white/10'
                }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <ProductGrid products={displayedProducts} title={selectedCategory ? 'Productos Filtrados' : 'Catálogo Completo'} />

      {/* Contact Section */}
      <ContactSection />

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-dark rounded-3xl p-8 md:p-12 text-center space-y-6">
            <Mail className="w-12 h-12 mx-auto text-cyan-400" />
            <h2 className="text-4xl md:text-5xl font-bold text-white text-balance">
              Únete y entérate primero
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Te avisamos de ofertas, nuevos productos y promos antes que nadie.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-input flex-1"
              />
              <button
                type="submit"
                className="glass-button bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white whitespace-nowrap"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold gradient-text-purple">Viral Shop Bo</h3>
              <p className="text-white/60 text-sm">
                La mejor tienda de artículos premium con envío rápido a domicilio.
              </p>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/profile.php?id=61581629574354" className="glass-card-sm p-2 hover:shadow-lg transition-shadow">
                  <Facebook size={18} className="text-white" />
                </a>
              
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Compra</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/#products" className="text-white/60 hover:text-white transition-colors text-sm">
                    Productos
                  </Link>
                </li>
                <li>
                  <Link href="/carrito" className="text-white/60 hover:text-white transition-colors text-sm">
                    Mi Carrito
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Ayuda</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Contacto
                  </a>
                </li>
                {/* <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Preguntas Frecuentes
                  </a>
                </li> */}
                {/* <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Envíos
                  </a>
                </li> */}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Términos y Condiciones
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Política de Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Política de Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2026 HaJo. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <HomeContent />
    </CartProvider>
  );
}
