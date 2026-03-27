import { Product } from '@/lib/types';
import { ProductCard } from './product-card';

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {title && (
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-balance">
              {title.split(' ').map((word, i) => (
                <span key={i}>
                  {word}{' '}
                </span>
              ))}
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-400 mt-4 rounded-full" />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No hay productos disponibles</p>
          </div>
        )}
      </div>
    </section>
  );
}
