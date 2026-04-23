'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CartProvider } from '@/lib/cart-context';
import {
    ArrowLeft, ShoppingBag, Phone, MapPin,
    ChevronDown, RefreshCw, Search, Package,
    DollarSign, Users, ChevronLeft, ChevronRight,
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

// ─── Types ────────────────────────────────────────────────────────────────────
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
    createdAt?: string;
    items: OrderItem[];
    subtotal: string;
    total: string;
}

interface OrdersResponse {
    data: Order[];
    total: number;
    page: string | number;
    size: string | number;
}

// ─── Fecha formateada sin hydration error ─────────────────────────────────────
function FormattedDate({ dateString }: { dateString?: string }) {
    const [text, setText] = useState('');
    useEffect(() => {
        if (!dateString) return;
        setText(new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        }));
    }, [dateString]);
    if (!dateString) return null;
    return <span className="text-white/40 text-xs">{text}</span>;
}

// ─── Main Content ─────────────────────────────────────────────────────────────
function OrdersContent() {
    const [orders, setOrders]     = useState<Order[]>([]);
    const [filtered, setFiltered] = useState<Order[]>([]);
    const [total, setTotal]       = useState(0);
    const [page, setPage]         = useState(1);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState('');
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [search, setSearch]     = useState('');

    const SIZE       = 50;
    const totalPages = Math.ceil(total / SIZE);

    const getToken = () => {
        if (typeof window === 'undefined') return '';
        return localStorage.getItem('auth_token') || '';
    };

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/orders?page=${page}&size=${SIZE}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error();
            const json = await res.json();

            // Soporta respuesta paginada ({ data, total }) o array directo
            const list: Order[] = Array.isArray(json) ? json : (json.data || []);
            const tot: number   = Array.isArray(json) ? json.length : (json.total || list.length);

            const sorted = [...list].sort((a, b) => b.id - a.id);
            setOrders(sorted);
            setFiltered(sorted);
            setTotal(tot);
        } catch {
            setError('No se pudieron cargar las órdenes');
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    // Filtro de búsqueda (local)
    useEffect(() => {
        const q = search.toLowerCase();
        if (!q) { setFiltered(orders); return; }
        setFiltered(orders.filter(o =>
            `${o.nombre} ${o.apellido}`.toLowerCase().includes(q) ||
            o.telefono.includes(q) ||
            (o.departamento || '').toLowerCase().includes(q) ||
            String(o.id).includes(q) ||
            o.items.some(i => i.producto.toLowerCase().includes(q))
        ));
    }, [search, orders]);

    // Stats
    const totalRevenue  = orders.reduce((sum, o) => sum + parseFloat(o.total || '0'), 0);
    const totalItems    = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.cantidad, 0), 0);
    const uniqueClients = new Set(orders.map(o => o.telefono)).size;

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Breadcrumb */}
                <Link href="/admin" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm">
                    <ArrowLeft size={16} />
                    Volver al Panel
                </Link>

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-400/10 flex items-center justify-center">
                            <ShoppingBag size={24} className="text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Órdenes</h1>
                            <p className="text-white/40 text-sm mt-0.5">
                                {total} orden{total !== 1 ? 'es' : ''} en total
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
                        title="Recargar"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                {/* Stats */}
                {!loading && orders.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Ingresos Totales', value: `Bs. ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                            { label: 'Productos Vendidos', value: totalItems, icon: Package, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
                            { label: 'Clientes Únicos', value: uniqueClients, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                        ].map((s) => (
                            <div key={s.label} className="glass-dark rounded-2xl p-5 flex items-center gap-4 border border-white/5">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
                                    <s.icon size={20} className={s.color} />
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs">{s.label}</p>
                                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Search */}
                <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, teléfono, departamento, producto u orden #..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="glass-input pl-10"
                    />
                </div>

                {/* Loading */}
                {loading && (
                    <div className="glass-dark rounded-2xl p-12 text-center">
                        <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-white/40">Cargando órdenes...</p>
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="glass-dark rounded-2xl p-8 border border-red-500/20 text-center">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {/* Orders List */}
                {!loading && !error && (
                    <div className="space-y-3">
                        {filtered.length === 0 && (
                            <div className="glass-dark rounded-2xl p-12 text-center border border-white/5">
                                <ShoppingBag size={40} className="mx-auto text-white/10 mb-3" />
                                <p className="text-white/30">No se encontraron órdenes</p>
                            </div>
                        )}

                        {filtered.map((order) => (
                            <div key={order.id} className="glass-dark rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all">

                                {/* Order Header */}
                                <button
                                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                                    className="w-full p-5 flex items-center gap-4 hover:bg-white/5 transition-colors text-left"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-blue-400 font-bold text-sm">#{order.id}</span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-semibold truncate">
                                            {order.nombre} {order.apellido}
                                        </p>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <span className="text-white/40 text-xs flex items-center gap-1">
                                                <Phone size={11} />
                                                {order.telefono}
                                            </span>
                                            {order.departamento && (
                                                <span className="text-white/40 text-xs flex items-center gap-1">
                                                    <MapPin size={11} />
                                                    {order.departamento}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                                        {order.items.slice(0, 2).map((item, i) => (
                                            <span key={i} className="text-xs bg-white/5 text-white/50 px-2 py-1 rounded-lg truncate max-w-32">
                                                {item.cantidad}x {item.producto.split(' ').slice(0, 2).join(' ')}
                                            </span>
                                        ))}
                                        {order.items.length > 2 && (
                                            <span className="text-xs text-white/30">+{order.items.length - 2}</span>
                                        )}
                                    </div>

                                    <div className="text-right flex-shrink-0 ml-4">
                                        <p className="text-emerald-400 font-bold text-lg">Bs. {order.total}</p>
                                        <FormattedDate dateString={order.createdAt} />
                                    </div>

                                    <ChevronDown
                                        size={16}
                                        className={`text-white/30 flex-shrink-0 transition-transform ${expandedId === order.id ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Order Details */}
                                {expandedId === order.id && (
                                    <div className="border-t border-white/10 p-5 space-y-5 bg-white/2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {/* Cliente */}
                                            <div className="space-y-3">
                                                <h4 className="text-white/60 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                                    <Phone size={12} className="text-cyan-400" />
                                                    Datos del Cliente
                                                </h4>
                                                <div className="glass rounded-xl p-4 space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-white/40 text-sm">Nombre</span>
                                                        <span className="text-white text-sm font-medium">{order.nombre} {order.apellido}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-white/40 text-sm">Teléfono</span>
                                                        <a href={`tel:${order.telefono}`} className="text-cyan-400 text-sm font-medium hover:text-cyan-300">
                                                            {order.telefono}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dirección */}
                                            <div className="space-y-3">
                                                <h4 className="text-white/60 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                                    <MapPin size={12} className="text-orange-400" />
                                                    Dirección de Envío
                                                </h4>
                                                <div className="glass rounded-xl p-4 space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-white/40 text-sm">Dirección</span>
                                                        <span className="text-white text-sm font-medium text-right max-w-48 truncate">
                                                            {order.direccion} {order.numero}
                                                        </span>
                                                    </div>
                                                    {order.municipio && (
                                                        <div className="flex justify-between">
                                                            <span className="text-white/40 text-sm">Municipio</span>
                                                            <span className="text-white text-sm">{order.municipio}</span>
                                                        </div>
                                                    )}
                                                    {order.provincia && (
                                                        <div className="flex justify-between">
                                                            <span className="text-white/40 text-sm">Provincia</span>
                                                            <span className="text-white text-sm">{order.provincia}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between">
                                                        <span className="text-white/40 text-sm">Departamento</span>
                                                        <span className="text-white text-sm">{order.departamento || '—'}</span>
                                                    </div>
                                                    {order.referencia && (
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-white/40 text-sm flex-shrink-0">Referencia</span>
                                                            <span className="text-white/70 text-sm text-right">{order.referencia}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="space-y-3">
                                            <h4 className="text-white/60 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                                <Package size={12} className="text-emerald-400" />
                                                Productos
                                            </h4>
                                            <div className="rounded-xl overflow-hidden border border-white/5">
                                                <table className="w-full">
                                                    <thead>
                                                    <tr className="bg-white/5">
                                                        <th className="text-left py-3 px-4 text-white/40 text-xs font-semibold">Producto</th>
                                                        <th className="text-center py-3 px-4 text-white/40 text-xs font-semibold">Cant.</th>
                                                        <th className="text-right py-3 px-4 text-white/40 text-xs font-semibold">Precio</th>
                                                        <th className="text-right py-3 px-4 text-white/40 text-xs font-semibold">Subtotal</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {order.items.map((item, idx) => (
                                                        <tr key={idx} className="border-t border-white/5">
                                                            <td className="py-3 px-4 text-white text-sm">{item.producto}</td>
                                                            <td className="py-3 px-4 text-center">
                                                                <span className="bg-white/10 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                                                    x{item.cantidad}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-4 text-right text-white/60 text-sm">Bs. {item.precio}</td>
                                                            <td className="py-3 px-4 text-right text-white font-semibold text-sm">
                                                                Bs. {(item.cantidad * item.precio).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Totals */}
                                        <div className="flex justify-end">
                                            <div className="space-y-2 min-w-48">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-white/40">Subtotal</span>
                                                    <span className="text-white">Bs. {order.subtotal}</span>
                                                </div>
                                                {order.subtotal !== order.total && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-emerald-400">Descuento</span>
                                                        <span className="text-emerald-400">
                                                            - Bs. {(parseFloat(order.subtotal) - parseFloat(order.total)).toFixed(0)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between border-t border-white/10 pt-2">
                                                    <span className="text-white font-bold">Total</span>
                                                    <span className="text-emerald-400 font-bold text-lg">Bs. {order.total}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-between px-2 py-2">
                        <p className="text-white/40 text-sm">
                            Página {page} de {totalPages} — {total} registros
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 disabled:opacity-30 transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OrdersPage() {
    return (
        <AdminLayout>
            <CartProvider>
                <OrdersContent />
            </CartProvider>
        </AdminLayout>
    );
}