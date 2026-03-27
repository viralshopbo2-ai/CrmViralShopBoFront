'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navigation() {
  const { items } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Cerrar menú cuando se cambia de tamaño la ventana
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cartCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/#products', label: 'Productos' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl">
      <div className="glass-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="glass-card-sm p-2 group-hover:shadow-lg transition-shadow">
                <div className="text-2xl font-bold gradient-text-purple">Viral Shop Bo</div>
              </div>
            </Link>

            {/* Center Nav Links - Desktop */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="glass-card-sm p-2 hover:bg-white/10 transition-colors text-white hidden sm:flex"
              >
                <Search size={20} />
              </button>

              {/* Cart Link - Always Visible */}
              <Link
                href="/carrito"
                className="relative glass-card-sm p-2 hover:shadow-lg transition-all flex-shrink-0"
              >
                <ShoppingBag size={20} className="text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden glass-card-sm p-2 hover:bg-white/10 transition-colors text-white flex-shrink-0"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="pb-4 border-t border-white/10 pt-4">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="glass-input"
                autoFocus
              />
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm font-medium text-white/80 hover:text-white transition-colors px-2 py-2 rounded-lg hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Search */}
              <button
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors px-2 py-2 rounded-lg hover:bg-white/5"
              >
                <Search size={18} />
                Buscar
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
