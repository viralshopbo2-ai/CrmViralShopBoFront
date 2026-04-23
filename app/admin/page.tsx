'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { CartProvider } from '@/lib/cart-context';
import { products as initialProducts } from '@/lib/products';
import { Product } from '@/lib/types';
import {
  Edit2, Trash2, Plus, ArrowLeft, Save, X,
  ShoppingBag, Users, Shield, Package, LayoutDashboard,
  ChevronRight, Menu
} from 'lucide-react';
import Image from 'next/image';
import AdminLayout from "@/components/AdminLayout";

// ─── Sidebar Menu Config ───────────────────────────────────────────────────────
const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
  {
    id: 'products',
    label: 'Productos',
    icon: Package,
    href: '/admin',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    id: 'orders',
    label: 'Órdenes',
    icon: ShoppingBag,
    href: '/admin/orders',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    id: 'users',
    label: 'Usuarios',
    icon: Users,
    href: '/admin/users',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    id: 'roles',
    label: 'Roles',
    icon: Shield,
    href: '/admin/roles',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
];

// ─── Sidebar Component ─────────────────────────────────────────────────────────
function Sidebar({
                   activeSection,
                   onSelect,
                   isOpen,
                   onClose,
                 }: {
  activeSection: string;
  onSelect: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
      <>
        {/* Overlay mobile */}
        {isOpen && (
            <div
                className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                onClick={onClose}
            />
        )}

        {/* Sidebar */}
        <aside
            className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 w-64
          glass-dark border-r border-white/10
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:h-auto lg:z-auto
        `}
        >
          <div className="p-4 space-y-1 pt-6">
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest px-3 mb-4">
              Menú Principal
            </p>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              // Órdenes, usuarios y roles tienen su propia página — usar Link directo
              if (item.id === 'orders' || item.id === 'users' || item.id === 'roles') {
                return (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group
                    ${isActive
                            ? `${item.bg} border border-white/10`
                            : 'hover:bg-white/5'
                        }
                  `}
                        onClick={onClose}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.bg}`}>
                        <Icon size={16} className={item.color} />
                      </div>
                      <span className={`font-medium text-sm ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                    {item.label}
                  </span>
                      <ChevronRight size={14} className={`ml-auto ${isActive ? item.color : 'text-white/20 group-hover:text-white/40'}`} />
                    </Link>
                );
              }

              return (
                  <button
                      key={item.id}
                      onClick={() => { onSelect(item.id); onClose(); }}
                      className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group
                  ${isActive
                          ? `${item.bg} border border-white/10`
                          : 'hover:bg-white/5'
                      }
                `}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.bg}`}>
                      <Icon size={16} className={item.color} />
                    </div>
                    <span className={`font-medium text-sm ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                  {item.label}
                </span>
                    {isActive && (
                        <div className={`ml-auto w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                    )}
                  </button>
              );
            })}

            {/* Divider */}
            <div className="border-t border-white/10 my-4" />

            {/* Back to store */}
            <Link
                href="/"
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
                <ArrowLeft size={16} className="text-white/40" />
              </div>
              <span className="font-medium text-sm text-white/40 group-hover:text-white">
              Ir a la Tienda
            </span>
            </Link>
          </div>
        </aside>
      </>
  );
}

// ─── Products Section ──────────────────────────────────────────────────────────
function ProductsSection() {
  const [adminProducts, setAdminProducts] = useState<Product[]>(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', price: 0, category: '', description: '',
    image: '', rating: 0, reviews: 0, stock: 0, featured: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert('Por favor completa los campos requeridos');
      return;
    }
    if (editingId) {
      setAdminProducts(adminProducts.map((p) => p.id === editingId ? { ...p, ...formData } : p));
      setEditingId(null);
    } else {
      setAdminProducts([...adminProducts, { ...formData, id: Date.now().toString() }]);
    }
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name, price: product.price, category: product.category,
      description: product.description, image: product.image, rating: product.rating,
      reviews: product.reviews, stock: product.stock, featured: product.featured || false,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este producto?')) {
      setAdminProducts(adminProducts.filter((p) => p.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: 0, category: '', description: '', image: '', rating: 0, reviews: 0, stock: 0, featured: false });
    setEditingId(null);
    setShowForm(false);
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Productos</h2>
            <p className="text-white/50 text-sm mt-1">Gestiona tu catálogo completo</p>
          </div>
          <button
              onClick={() => setShowForm(!showForm)}
              className="glass-button inline-flex items-center gap-2 text-white text-sm"
              style={{ background: showForm ? 'rgba(255,255,255,0.1)' : 'linear-gradient(to right, #10b981, #059669)' }}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancelar' : 'Nuevo Producto'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total', value: adminProducts.length, color: 'text-cyan-400' },
            { label: 'En Stock', value: adminProducts.filter(p => p.stock > 0).length, color: 'text-emerald-400' },
            { label: 'Destacados', value: adminProducts.filter(p => p.featured).length, color: 'text-yellow-400' },
          ].map((s) => (
              <div key={s.label} className="glass-dark rounded-2xl p-4">
                <p className="text-white/50 text-xs font-semibold">{s.label}</p>
                <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
          ))}
        </div>

        {/* Form */}
        {showForm && (
            <div className="glass-dark rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1">Nombre</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="glass-input" placeholder="Nombre del producto" />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Precio (Bs.)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="glass-input" step="0.01" />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Categoría</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="glass-input">
                    <option value="">Selecciona</option>
                    <option value="electronics">Electrónica</option>
                    <option value="technology">Tecnología</option>
                    <option value="accessories">Accesorios</option>
                    <option value="home">Hogar</option>
                    <option value="wellness">Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Stock</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="glass-input" min="0" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white/70 text-sm mb-1">URL de Imagen</label>
                  <input type="text" name="image" value={formData.image} onChange={handleInputChange} className="glass-input" placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white/70 text-sm mb-1">Descripción</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} className="glass-input resize-none" rows={3} />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="w-4 h-4" />
                  <span className="text-white/70 text-sm">Marcar como destacado</span>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={resetForm} className="glass-button text-white/70 text-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>Cancelar</button>
                <button onClick={handleSaveProduct} className="glass-button text-white text-sm inline-flex items-center gap-2" style={{ background: 'linear-gradient(to right, #10b981, #059669)' }}>
                  <Save size={16} />
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </div>
        )}

        {/* Table */}
        <div className="glass-dark rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left py-3 px-4 text-white/50 text-xs font-semibold uppercase">Imagen</th>
                <th className="text-left py-3 px-4 text-white/50 text-xs font-semibold uppercase">Nombre</th>
                <th className="text-left py-3 px-4 text-white/50 text-xs font-semibold uppercase">Categoría</th>
                <th className="text-left py-3 px-4 text-white/50 text-xs font-semibold uppercase">Precio</th>
                <th className="text-left py-3 px-4 text-white/50 text-xs font-semibold uppercase">Stock</th>
                <th className="text-left py-3 px-4 text-white/50 text-xs font-semibold uppercase">Acciones</th>
              </tr>
              </thead>
              <tbody>
              {adminProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/10">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-white font-medium text-sm">{product.name}</p>
                      {product.featured && <span className="text-xs text-yellow-400">★ Destacado</span>}
                    </td>
                    <td className="py-3 px-4 text-white/50 text-sm">{product.category}</td>
                    <td className="py-3 px-4 text-white font-bold text-sm">Bs. {product.price.toFixed(2)}</td>
                    <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {product.stock} unid.
                    </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(product)} className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
            {adminProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-white/30">No hay productos en el catálogo</p>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

// ─── Dashboard Section ─────────────────────────────────────────────────────────
function DashboardSection({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-white/50 text-sm mt-1">Resumen general del sistema</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {menuItems.filter(m => m.id !== 'dashboard').map((item) => {
            const Icon = item.icon;
            return (
                <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className="glass-dark rounded-2xl p-5 text-left hover:border-white/20 border border-white/5 transition-all hover:-translate-y-1 group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${item.bg}`}>
                    <Icon size={20} className={item.color} />
                  </div>
                  <p className="text-white font-bold">{item.label}</p>
                  <p className="text-white/40 text-xs mt-1 flex items-center gap-1 group-hover:text-white/60 transition-colors">
                    Ver módulo <ChevronRight size={12} />
                  </p>
                </button>
            );
          })}
        </div>

        <div className="glass-dark rounded-2xl p-6 border border-white/5">
          <p className="text-white/40 text-sm text-center">
            Selecciona un módulo del sidebar o las cards para comenzar a gestionar
          </p>
        </div>
      </div>
  );
}

// ─── Coming Soon placeholder ───────────────────────────────────────────────────
function ComingSoon({ title, icon: Icon, color }: { title: string; icon: any; color: string }) {
  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          <p className="text-white/50 text-sm mt-1">Gestión de {title.toLowerCase()}</p>
        </div>
        <div className="glass-dark rounded-2xl p-16 text-center border border-white/5">
          <Icon size={48} className={`mx-auto mb-4 ${color} opacity-30`} />
          <p className="text-white/50 text-lg font-semibold">Módulo en construcción</p>
          <p className="text-white/30 text-sm mt-2">Próximamente disponible</p>
        </div>
      </div>
  );
}

// ─── Main Admin Page ───────────────────────────────────────────────────────────
function AdminContent() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardSection onNavigate={setActiveSection} />;
      case 'products':  return <ProductsSection />;
      case 'users':     return <ComingSoon title="Usuarios" icon={Users} color="text-purple-400" />;
      case 'roles':     return <ComingSoon title="Roles" icon={Shield} color="text-orange-400" />;
      default:          return <DashboardSection onNavigate={setActiveSection} />;
    }
  };

  return (
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-16 flex">
          {/* Sidebar */}
          <Sidebar
              activeSection={activeSection}
              onSelect={setActiveSection}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
          />

          {/* Main Content */}
          <main className="flex-1 min-w-0 p-6 lg:p-8 lg:ml-0">
            {/* Mobile header */}
            <div className="flex items-center gap-3 mb-6 lg:hidden">
              <button
                  onClick={() => setSidebarOpen(true)}
                  className="glass-card-sm p-2 text-white"
              >
                <Menu size={20} />
              </button>
              <span className="text-white font-semibold">Panel de Administración</span>
            </div>

            <div className="max-w-6xl">
              {renderSection()}
            </div>
          </main>
        </div>
      </div>
  );
}

export default function AdminPage() {
  return (
      <AdminLayout>
        <CartProvider>
          <AdminContent />
        </CartProvider>
      </AdminLayout>
  );
}