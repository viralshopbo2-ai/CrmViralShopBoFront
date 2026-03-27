'use client';

import { Navigation } from '@/components/navigation';
import { ProductGrid } from '@/components/product-grid';
import { CartProvider } from '@/lib/cart-context';
import { products, categories } from '@/lib/products';
import { useState } from 'react';
import { Search, X } from 'lucide-react';

function ShopContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 300]);

  const filteredProducts = products.filter((product) => {
    const matchCategory = !selectedCategory || product.category === selectedCategory;
    const matchSearch =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchCategory && matchSearch && matchPrice;
  });

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setPriceRange([0, 300]);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-4">
            Tienda Completa
          </h1>
          <p className="text-white/60 max-w-2xl">
            Explora nuestro catálogo completo de productos premium con envío a domicilio
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-2xl sticky top-24 space-y-6">
              <div>
                <h3 className="font-bold text-white mb-4 flex items-center justify-between">
                  Filtros
                  {(selectedCategory || searchQuery || priceRange[0] > 0 || priceRange[1] < 300) && (
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Limpiar
                    </button>
                  )}
                </h3>
              </div>

              {/* Search */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="glass-input pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-sm font-semibold text-white mb-3 block">
                  Categorías
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === null
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Todos
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  Rango de Precio
                </label>
                <div className="space-y-3">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full accent-primary"
                    />
                  </div>
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-primary"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${priceRange[0]} - ${priceRange[1]}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-white/60">
                Mostrando {filteredProducts.length} de {products.length} productos
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="glass p-12 rounded-2xl text-center">
                <p className="text-lg text-white/70 mb-6">
                  No se encontraron productos que coincidan con tus filtros
                </p>
                <button
                  onClick={handleClearFilters}
                  className="glass-button text-white hover:shadow-lg"
                >
                  Limpiar Filtros
                </button>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} title="" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <CartProvider>
      <ShopContent />
    </CartProvider>
  );
}
