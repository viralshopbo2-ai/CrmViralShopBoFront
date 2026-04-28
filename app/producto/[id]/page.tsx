'use client';

import { Navigation } from '@/components/navigation';
import { CartProvider, useCart } from '@/lib/cart-context';
import { useToast } from '@/lib/toast-context';
import { getProductById, getProductsByCategory } from '@/lib/products';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { BuyNowButton } from '@/components/buy-now-button';
import { DiscountCards } from '@/components/discount-cards';
import { ProductImageGallery } from '@/components/product-image-gallery';
import { useState, useEffect } from 'react';
import { Star, ShoppingCart, ArrowLeft, Truck, Shield, RefreshCw, Check, Gift, Banknote } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function mapApiProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? '',
    price: Number(p.price) || 0,
    image: Array.isArray(p.images) ? (p.images[0] ?? '') : '',
    images: Array.isArray(p.images) ? p.images : [],
    category: 'home' as const,
    rating: Number(p.stars) || 0,
    reviews: Number(p.reviews) || 0,
    stock: Number(p.stock) || 0,
    features: p.characteristics ?? [],
    specs: p.specifications?.length
      ? Object.fromEntries(p.specifications.map((s: string, i: number) => [`Especificación ${i + 1}`, s]))
      : undefined,
    video: p.video || undefined,
  };
}

function ProductContent() {
  const params = useParams();
  const productId = params.id as string;
  const { addToCart } = useCart();
  const { success } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(() => getProductById(productId) ?? null);
  const [loading, setLoading] = useState(!product);

  useEffect(() => {
    if (product) return;
    fetch(`/api/products/${productId}`)
      .then(r => r.json())
      .then(data => {
        if (data?.id) setProduct(mapApiProduct(data));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId, product]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="animate-pulse text-white/40 text-lg mt-20">Cargando producto...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
              <ArrowLeft size={20} />
              Volver
            </Link>
            <div className="glass-dark rounded-3xl p-12 text-center">
              <p className="text-white/60 text-lg">Producto no encontrado</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    success(`${product.name} - Cantidad: ${quantity} fue agregado al carrito!`);
  };

  // Calcular descuento según cantidad
  const getDiscountPercent = (qty: number) => {
    if (qty >= 3) return 20;
    if (qty >= 2) return 15;
    return 0;
  };

  const discountPercent = getDiscountPercent(quantity);
  const originalTotal = product.price * quantity;
  const discountAmount = originalTotal * (discountPercent / 100);
  const finalTotal = originalTotal - discountAmount;

  const stars = Array(5).fill(0);

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 pb-36 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4 lg:mb-8 text-sm lg:text-base">
            <ArrowLeft size={16} />
            Volver al catálogo
          </Link>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-10 lg:mb-20">
            <ProductImageGallery
              images={product.images && product.images.length > 0 ? product.images : [product.image]}
              productName={product.name}
            />

            {/* Info */}
            <div className="space-y-3 lg:space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white text-balance">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mt-2 lg:mt-6">
                  <div className="flex items-center gap-0.5">
                    {stars.map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}
                      />
                    ))}
                  </div>
                  <div className="text-white/60 text-xs lg:text-sm">
                    <span className="text-white font-semibold">{product.rating.toFixed(1)}</span>
                    <span> ({product.reviews} reseñas)</span>
                  </div>
                </div>
              </div>

              {/* Entrega Gratis y Pago Contraentrega */}
              <div className="grid grid-cols-2 gap-2 lg:gap-3">
                <div className="glass-card p-2.5 lg:p-3 rounded-2xl flex items-center gap-2 border-emerald-400/30 bg-emerald-400/5 min-w-0">
                  <div className="w-7 h-7 lg:w-9 lg:h-9 shrink-0 rounded-full bg-emerald-400/20 flex items-center justify-center">
                    <Gift className="text-emerald-400" size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-emerald-400 font-bold text-xs leading-tight">ENTREGA GRATIS</p>
                    <p className="text-white/60 text-xs">A todo el país</p>
                  </div>
                </div>
                <div className="glass-card p-2.5 lg:p-3 rounded-2xl flex items-center gap-2 border-amber-400/30 bg-amber-400/5 min-w-0">
                  <div className="w-7 h-7 lg:w-9 lg:h-9 shrink-0 rounded-full bg-amber-400/20 flex items-center justify-center">
                    <Banknote className="text-amber-400" size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-amber-400 font-bold text-xs leading-tight">PAGO CONTRAENTREGA</p>
                    <p className="text-white/60 text-xs">Pagas cuando recibas</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="glass-card p-3 lg:p-6 rounded-2xl">
                <p className="text-white/60 text-xs lg:text-sm mb-1">Precio</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                    Bs. {product.price.toFixed(2)}
                  </p>
                  <p className="text-white/60 text-xs lg:text-sm">por unidad</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 lg:space-y-4">
                <h2 className="text-base lg:text-2xl font-bold text-white">Descripción</h2>
                <p className="text-white/70 text-sm lg:text-lg leading-relaxed">{product.description}</p>
              </div>

              {/* Discount Cards */}
              <DiscountCards
                price={product.price}
                selectedQuantity={quantity}
                onSelectQuantity={setQuantity}
              />

              {/* Stock Status */}
              <div className="glass-card p-2.5 lg:p-4 rounded-xl">
                <p className={`font-semibold flex items-center gap-2 text-sm lg:text-base ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  <Check size={16} />
                  {product.stock > 0 ? `${product.stock} en stock — Disponible` : 'Sin stock'}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2 lg:space-y-4">
                <p className="text-white/70 text-xs lg:text-sm font-semibold">Cantidad</p>
                <div className="flex items-center gap-3 lg:gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="glass-button text-white hover:shadow-lg hover:bg-white/10 w-9 h-9 lg:w-12 lg:h-12 flex items-center justify-center active:scale-95 transition-all text-lg"
                  >
                    -
                  </button>
                  <span className="text-xl lg:text-2xl font-bold text-white w-8 lg:w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="glass-button text-white hover:shadow-lg hover:bg-white/10 w-9 h-9 lg:w-12 lg:h-12 flex items-center justify-center active:scale-95 transition-all text-lg"
                  >
                    +
                  </button>
                  <div className="ml-auto text-right">
                    {discountPercent > 0 && (
                      <p className="text-white/40 text-xs line-through">Bs. {originalTotal.toFixed(2)}</p>
                    )}
                    <p className="text-cyan-400 font-semibold text-sm lg:text-base">
                      Total: <span className="text-base lg:text-lg">Bs. {finalTotal.toFixed(2)}</span>
                      {discountPercent > 0 && (
                        <span className="ml-1 text-emerald-400 text-xs">(-{discountPercent}%)</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 lg:space-y-4">
                {product.stock > 0 && (
                  <div className="hidden lg:block">
                    <BuyNowButton product={product} quantity={quantity} />
                  </div>
                )}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full glass-button ${product.stock > 0
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:from-blue-700 hover:to-purple-700 active:scale-95'
                    : 'bg-white/10 text-white/50 cursor-not-allowed'
                  } py-3 lg:py-4 text-sm lg:text-lg font-semibold inline-flex items-center justify-center gap-2 transition-all`}
                >
                  <ShoppingCart size={18} />
                  {product.stock > 0 ? `Agregar al Carrito (${quantity})` : 'Agotado'}
                </button>
                <Link
                  href="/carrito"
                  className="block text-center glass-button text-white hover:shadow-lg py-3 lg:py-4 text-sm lg:text-lg font-semibold transition-all"
                >
                  Ver Carrito
                </Link>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-2 lg:gap-4">
                <div className="glass-card-sm p-2.5 lg:p-4 rounded-xl space-y-1 lg:space-y-2">
                  <Truck className="text-cyan-400" size={18} />
                  <p className="text-xs text-white font-semibold leading-tight">Envío Gratis</p>
                  <p className="text-xs text-white/60 hidden sm:block">A domicilio en 1-3 días</p>
                </div>
                <div className="glass-card-sm p-2.5 lg:p-4 rounded-xl space-y-1 lg:space-y-2">
                  <Shield className="text-cyan-400" size={18} />
                  <p className="text-xs text-white font-semibold leading-tight">Compra Segura</p>
                  <p className="text-xs text-white/60 hidden sm:block">100% protegida</p>
                </div>
                <div className="glass-card-sm p-2.5 lg:p-4 rounded-xl space-y-1 lg:space-y-2">
                  <RefreshCw className="text-cyan-400" size={18} />
                  <p className="text-xs text-white font-semibold leading-tight">Garantía</p>
                  <p className="text-xs text-white/60 hidden sm:block">{product.warranty || '30 días'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications and Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-10 lg:mb-20">
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="space-y-3 lg:space-y-6">
                <div>
                  <h2 className="text-xl lg:text-3xl font-bold text-white mb-1">Especificaciones</h2>
                  <p className="text-white/60 text-sm">Detalles técnicos del producto</p>
                </div>
                <div className="glass-dark rounded-2xl p-4 lg:p-8">
                  <div className="space-y-3 lg:space-y-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                        <p className="text-cyan-400 font-semibold text-xs lg:text-sm mb-0.5">{key}</p>
                        <p className="text-white/80 text-sm lg:text-base">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className="space-y-3 lg:space-y-6">
                <div>
                  <h2 className="text-xl lg:text-3xl font-bold text-white mb-1">Características</h2>
                  <p className="text-white/60 text-sm">Lo que hace este producto especial</p>
                </div>
                <div className="glass-dark rounded-2xl p-4 lg:p-8">
                  <ul className="space-y-2.5 lg:space-y-4">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 lg:gap-3">
                        <div className="mt-1.5 shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                        </div>
                        <span className="text-white/80 text-sm lg:text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Video Section */}
          {product.video && (
            <div className="space-y-3 lg:space-y-6 mb-10 lg:mb-20">
              <div>
                <h2 className="text-xl lg:text-3xl font-bold text-white mb-1">Video del producto</h2>
                <p className="text-white/60 text-sm">Mira el producto en acción</p>
              </div>
              <div className="glass-dark rounded-2xl overflow-hidden">
                <video src={product.video} controls playsInline className="w-full max-h-[560px] object-contain bg-black">
                  Tu navegador no soporta la reproducción de video.
                </video>
              </div>
            </div>
          )}

          {/* Testimonials Section */}
          <div className="space-y-4 lg:space-y-8 mb-10 lg:mb-20">
            <div>
              <h2 className="text-xl lg:text-4xl font-bold text-white mb-1">Lo que dicen nuestros clientes</h2>
              <p className="text-white/60 text-sm">Miles de clientes satisfechos en todo el país</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-6">
              {[
                { name: 'Juan Martínez', text: 'Excelente producto, llegó en tiempo y en perfecto estado. Muy satisfecho con la compra.', rating: 5 },
                { name: 'María García', text: 'El servicio de atención fue muy rápido y eficiente. El pago contraentrega me dio mucha confianza!', rating: 5 },
                { name: 'Carlos López', text: 'Mejor precio que en otros lugares y con garantía. Volvería a comprar sin dudarlo.', rating: 5 },
              ].map((testimonial, index) => (
                <div key={index} className="glass-card p-3 lg:p-6 rounded-2xl space-y-2 lg:space-y-4">
                  <div className="flex gap-1">
                    {Array(testimonial.rating).fill(0).map((_, i) => (
                      <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white/80 italic text-sm">{`"${testimonial.text}"`}</p>
                  <p className="text-cyan-400 font-semibold text-sm">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-4 lg:space-y-8 mb-10 lg:mb-20">
            <div>
              <h2 className="text-xl lg:text-4xl font-bold text-white mb-1">Preguntas Frecuentes</h2>
              <p className="text-white/60 text-sm">Resuelve tus dudas sobre el producto</p>
            </div>
            <div className="grid grid-cols-1 gap-2 lg:gap-4">
              {[
                { question: '¿Cuál es el tiempo de envío?', answer: 'Realizamos envíos a todo el país en 1-3 días hábiles. El envío es completamente GRATIS.' },
                { question: '¿Cómo funciona el pago contraentrega?', answer: 'Pagas cuando recibes tu producto en la puerta de tu casa. No necesitas pagar nada por adelantado.' },
                { question: '¿El producto tiene garantía?', answer: `Sí, todos nuestros productos incluyen garantía. ${product.warranty || 'Consulta los detalles en la sección de especificaciones.'}` },
                { question: '¿Puedo devolver el producto si no me gusta?', answer: 'Sí, ofrecemos devoluciones sin costo durante 30 días si el producto no cumple tus expectativas.' },
              ].map((faq, index) => (
                <div key={index} className="glass-card p-3 lg:p-6 rounded-2xl space-y-1 lg:space-y-2">
                  <h3 className="text-sm lg:text-lg font-semibold text-cyan-400">{faq.question}</h3>
                  <p className="text-white/70 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="space-y-4 lg:space-y-8">
              <div>
                <h2 className="text-xl lg:text-4xl font-bold text-white mb-1">Productos Relacionados</h2>
                <p className="text-white/60 text-sm">Otros productos similares que te pueden interesar</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barra flotante móvil - solo visible en pantallas < lg */}
      {product.stock > 0 && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40">
          {/* Blur backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md border-t border-white/10" />
          <div className="relative px-4 py-3 flex items-center gap-3">
            {/* Precio y cantidad */}
            <div className="flex-1 min-w-0">
              <p className="text-white/50 text-xs">Total ({quantity} ud.)</p>
              <p className="text-cyan-400 font-bold text-lg leading-tight">
                Bs. {finalTotal.toFixed(2)}
                {discountPercent > 0 && (
                  <span className="ml-2 text-emerald-400 text-xs font-semibold">-{discountPercent}%</span>
                )}
              </p>
            </div>
            {/* Botón Comprar Ahora */}
            <div className="flex-1">
              <BuyNowButton product={product} quantity={quantity} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  return (
    <CartProvider>
      <ProductContent />
    </CartProvider>
  );
}
