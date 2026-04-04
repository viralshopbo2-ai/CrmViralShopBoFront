import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { CartProvider } from '@/lib/cart-context';
import { ArrowLeft, ChevronDown, MapPin, Phone, Package } from 'lucide-react';

interface OrderItem {
  producto: string;
  cantidad: number;
  precio: number;
}

interface Order {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  numero: string;
  departamento: string;
  provincia: string;
  municipio: string;
  referencia: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: string;
  total: string;
}

function FormattedDate({ dateString }: { dateString: string }) {
  const [formatted, setFormatted] = useState('');

  useEffect(() => {
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setFormatted(formatted);
  }, [dateString]);

  return <span className="text-cyan-400 text-xs">{formatted}</span>;
}

'use client';

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('No se pudieron cargar las órdenes');
        }
        const data = await response.json();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Error al cargar las órdenes. Intenta más tarde.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4">
              <ArrowLeft size={20} />
              Volver al Panel
            </Link>
            <h1 className="text-5xl font-bold text-white">Gestión de Órdenes</h1>
            <p className="text-white/60 mt-2">Visualiza y gestiona todas las órdenes de clientes</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="glass-dark rounded-3xl p-8 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white text-lg">Cargando órdenes...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="glass-dark rounded-3xl p-8 border border-red-500/30 bg-red-500/5">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          )}

          {/* Orders List */}
          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="glass-dark rounded-2xl overflow-hidden">
                  {/* Order Header */}
                  <button
                    onClick={() => toggleOrderExpand(order.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1 text-left">
                      <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg p-3">
                        <Package size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">
                          Orden #{order.id}
                        </h3>
                        <p className="text-white/60 text-sm mb-2">
                          {order.nombre} {order.apellido}
                        </p>
                        <FormattedDate dateString={order.createdAt} />
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-white/60 text-xs mb-1">Total</p>
                        <p className="text-2xl font-bold text-white">Bs. {order.total}</p>
                      </div>
                      <ChevronDown
                        size={24}
                        className={`text-white/60 transition-transform ${
                          expandedOrderId === order.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Order Details */}
                  {expandedOrderId === order.id && (
                    <div className="border-t border-white/10 p-6 space-y-6">
                      {/* Customer Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                            <Phone size={18} className="text-cyan-400" />
                            Información del Cliente
                          </h4>
                          <div className="space-y-2">
                            <p className="text-white">
                              <span className="text-white/60">Nombre:</span> {order.nombre} {order.apellido}
                            </p>
                            <p className="text-white">
                              <span className="text-white/60">Teléfono:</span> {order.telefono}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                            <MapPin size={18} className="text-cyan-400" />
                            Dirección de Envío
                          </h4>
                          <div className="space-y-2">
                            <p className="text-white">
                              <span className="text-white/60">Dirección:</span> {order.direccion} #{order.numero}
                            </p>
                            <p className="text-white">
                              <span className="text-white/60">Municipio:</span> {order.municipio || 'N/A'}
                            </p>
                            <p className="text-white">
                              <span className="text-white/60">Provincia:</span> {order.provincia}
                            </p>
                            <p className="text-white">
                              <span className="text-white/60">Departamento:</span> {order.departamento}
                            </p>
                            {order.referencia && (
                              <p className="text-white">
                                <span className="text-white/60">Referencia:</span> {order.referencia}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <h4 className="text-white font-bold mb-3">Artículos de la Orden</h4>
                        <div className="bg-white/5 rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-white/10 bg-white/5">
                                <th className="text-left py-3 px-4 text-white/70 font-semibold text-sm">Producto</th>
                                <th className="text-center py-3 px-4 text-white/70 font-semibold text-sm">Cantidad</th>
                                <th className="text-right py-3 px-4 text-white/70 font-semibold text-sm">Precio Unit.</th>
                                <th className="text-right py-3 px-4 text-white/70 font-semibold text-sm">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item, idx) => (
                                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                  <td className="py-3 px-4 text-white">{item.producto}</td>
                                  <td className="py-3 px-4 text-white text-center font-semibold">{item.cantidad}</td>
                                  <td className="py-3 px-4 text-white text-right">Bs. {item.precio.toFixed(2)}</td>
                                  <td className="py-3 px-4 text-white text-right font-semibold">
                                    Bs. {(item.cantidad * item.precio).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="flex justify-end">
                        <div className="space-y-2 text-right">
                          <div className="flex gap-4">
                            <span className="text-white/60">Subtotal:</span>
                            <span className="text-white font-semibold">Bs. {order.subtotal}</span>
                          </div>
                          <div className="flex gap-4 text-lg">
                            <span className="text-white font-bold">Total:</span>
                            <span className="text-emerald-400 font-bold">Bs. {order.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && orders.length === 0 && (
            <div className="glass-dark rounded-3xl p-12 text-center">
              <Package size={48} className="mx-auto text-white/20 mb-4" />
              <p className="text-white/60 text-lg">No hay órdenes disponibles en este momento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <CartProvider>
      <OrdersContent />
    </CartProvider>
  );
}
