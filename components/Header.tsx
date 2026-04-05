'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export function Header() {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass">
        <nav className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline gradient-text">Viral Shop Bo</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/shop"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Tienda
              </Link>
              <Link
                href="/about"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Sobre Nosotros
              </Link>
              <Link
                href="/contact"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Contacto
              </Link>
            </div>

            {/* Right Section */}

            {/* <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors hidden sm:flex">
                <Search className="icon-flat text-foreground" />
              </button>

              <Link
                href="/cart"
                className="relative p-2 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <ShoppingCart className="icon-flat text-foreground" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="icon-flat text-foreground" />
                ) : (
                  <Menu className="icon-flat text-foreground" />
                )}
              </button>
            </div> */}
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/20 flex flex-col gap-4">
              <Link href="/shop" className="text-foreground hover:text-primary font-medium">
                Tienda
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary font-medium">
                Sobre Nosotros
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary font-medium">
                Contacto
              </Link>
            </div>
          )}
        </nav>
      </div>

      <!-- Meta Pixel Code -->
      <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1625870901965014');
        fbq('track', 'PageView');
      </script>
      <noscript><img height="1" width="1" style="display:none"
                     src="https://www.facebook.com/tr?id=1625870901965014&ev=PageView&noscript=1"
      /></noscript>
      <!-- End Meta Pixel Code -->
    </header>
  );
}
