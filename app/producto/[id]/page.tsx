'use client';

import { Navigation } from '@/components/navigation';
import { CartProvider, useCart } from '@/lib/cart-context';
import { useToast } from '@/lib/toast-context';
import { products, getProductById, getProductsByCategory } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { ProductImageGallery } from '@/components/product-image-gallery';
import Image from 'next/image';
import { useState } from 'react';
import { Star, ShoppingCart, ArrowLeft, Truck, Shield, RefreshCw, MessageCircle, Check } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function ProductContent() {
  const params = useParams();
  const productId = params.id as string;
  const product = getProductById(productId);
  const { addToCart } = useCart();
  const { success } = useToast();
  const [quantity, setQuantity] = useState(1);

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

  const whatsappMessage = `Hola! Me interesa comprar: ${product.name} - Cantidad: ${quantity} - Precio: Bs. ${(product.price * quantity).toFixed(2)}`;

  const stars = Array(5).fill(0);

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
            <ArrowLeft size={20} />
            Volver al catálogo
          </Link>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Image Gallery */}
            <ProductImageGallery 
              images={product.images && product.images.length > 0 ? product.images : [product.image]} 
              productName={product.name} 
            />

            {/* Info */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-cyan-400 font-semibold mb-2 capitalize">{product.category}</p>
                    <h1 className="text-5xl font-bold text-white text-balance">{product.name}</h1>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center gap-1">
                    {stars.map((_, i) => (
                      <Star
                        key={i}
                        size={24}
                        className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}
                      />
                    ))}
                  </div>
                  <div className="text-white/60">
                    <span className="text-white font-semibold">{product.rating.toFixed(1)}</span>
                    <span className="text-sm"> ({product.reviews} reseñas)</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="glass-card p-6 rounded-2xl">
                <p className="text-white/60 text-sm mb-2">Precio</p>
                <div className="flex items-end justify-between">
                  <p className="text-5xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                    Bs. {product.price.toFixed(2)}
                  </p>
                  <p className="text-white/60 text-sm">por unidad</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Descripción</h2>
                <p className="text-white/70 text-lg leading-relaxed">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="glass-card p-4 rounded-xl">
                <p className={`font-semibold flex items-center gap-2 ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  <Check size={20} />
                  {product.stock > 0 ? `${product.stock} en stock - Disponible` : 'Sin stock'}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4">
                <p className="text-white/70 text-sm font-semibold">Cantidad</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="glass-button text-white hover:shadow-lg hover:bg-white/10 w-12 h-12 flex items-center justify-center active:scale-95 transition-all"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-white w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="glass-button text-white hover:shadow-lg hover:bg-white/10 w-12 h-12 flex items-center justify-center active:scale-95 transition-all"
                  >
                    +
                  </button>
                  <p className="text-white/60 text-sm ml-auto">
                    Total: <span className="text-cyan-400 font-semibold">Bs. {(product.price * quantity).toFixed(2)}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full glass-button ${product.stock > 0
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:from-blue-700 hover:to-purple-700 active:scale-95'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                    } py-4 text-lg font-semibold inline-flex items-center justify-center gap-2 transition-all`}
                >
                  <ShoppingCart size={24} />
                  {product.stock > 0 ? `Agregar al Carrito (${quantity})` : 'Agotado'}
                </button>

                {product.stock > 0 && (
                  <WhatsAppButton message={whatsappMessage} />
                )}

                <Link
                  href="/carrito"
                  className="block text-center glass-button text-white hover:shadow-lg py-4 text-lg font-semibold transition-all"
                >
                  Ver Carrito
                </Link>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card-sm p-4 rounded-xl space-y-2">
                  <Truck className="text-cyan-400" size={24} />
                  <p className="text-sm text-white font-semibold">Envío Rápido</p>
                  <p className="text-xs text-white/60">A domicilio en 1-3 días</p>
                </div>
                <div className="glass-card-sm p-4 rounded-xl space-y-2">
                  <Shield className="text-cyan-400" size={24} />
                  <p className="text-sm text-white font-semibold">Compra Segura</p>
                  <p className="text-xs text-white/60">100% protegida y certificada</p>
                </div>
                <div className="glass-card-sm p-4 rounded-xl space-y-2">
                  <RefreshCw className="text-cyan-400" size={24} />
                  <p className="text-sm text-white font-semibold">Garantía</p>
                  <p className="text-xs text-white/60">{product.warranty || '30 días'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications and Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Especificaciones</h2>
                  <p className="text-white/60">Detalles técnicos del producto</p>
                </div>
                <div className="glass-dark rounded-2xl p-8">
                  <div className="space-y-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                        <p className="text-cyan-400 font-semibold text-sm mb-1">{key}</p>
                        <p className="text-white/80">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Características</h2>
                  <p className="text-white/60">Lo que hace este producto especial</p>
                </div>
                <div className="glass-dark rounded-2xl p-8">
                  <ul className="space-y-4">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1">
                          <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                        </div>
                        <span className="text-white/80 text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Testimonials Section */}
          <div className="space-y-8 mb-20">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Lo que dicen nuestros clientes</h2>
              <p className="text-white/60">Miles de clientes satisfechos en todo el país</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Juan Martínez',
                  text: 'Excelente producto, llegó en tiempo y en perfecto estado. Muy satisfecho con la compra.',
                  rating: 5,
                },
                {
                  name: 'María García',
                  text: 'El servicio de atención por WhatsApp fue muy rápido y eficiente. Recomendado!',
                  rating: 5,
                },
                {
                  name: 'Carlos López',
                  text: 'Mejor precio que en otros lugares y con garantía. Volvería a comprar sin dudarlo.',
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl space-y-4">
                  <div className="flex gap-1">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                      ))}
                  </div>
                  <p className="text-white/80 italic">"{testimonial.text}"</p>
                  <p className="text-cyan-400 font-semibold">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-8 mb-20">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Preguntas Frecuentes</h2>
              <p className="text-white/60">Resuelve tus dudas sobre el producto</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  question: '¿Cuál es el tiempo de envío?',
                  answer: 'Realizamos envíos a todo el país en 1-3 días hábiles después de confirmar tu pago.',
                },
                {
                  question: '¿Qué métodos de pago aceptan?',
                  answer: 'Aceptamos transferencias bancarias, pago móvil, tarjetas de crédito y compras por WhatsApp.',
                },
                {
                  question: '¿El producto tiene garantía?',
                  answer: `Sí, todos nuestros productos incluyen garantía. ${product.warranty || 'Consulta los detalles en la sección de especificaciones.'}`,
                },
                {
                  question: '¿Puedo devolver el producto si no me gusta?',
                  answer: 'Sí, ofrecemos devoluciones sin costo durante 30 días si el producto no cumple tus expectativas.',
                },
              ].map((faq, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl space-y-2">
                  <h3 className="text-lg font-semibold text-cyan-400">{faq.question}</h3>
                  <p className="text-white/70">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="glass-dark rounded-3xl p-12 text-center space-y-6 mb-12">
            <h2 className="text-4xl font-bold text-white">¿Listo para tu compra?</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Contáctanos por WhatsApp para completar tu pedido rápidamente y sin complicaciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WhatsAppButton message={whatsappMessage} />
              <Link
                href="/"
                className="glass-button text-white hover:shadow-lg py-4 px-8 text-lg font-semibold transition-all"
              >
                Ver más productos
              </Link>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">Productos Relacionados</h2>
                <p className="text-white/60">Otros productos similares que te pueden interesar</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
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
