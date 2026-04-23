'use client';

import { useRouter } from 'next/navigation';
import { CartProvider } from '@/lib/cart-context';
import { ShoppingBag, Users, Shield, Package, ChevronRight } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

const menuItems = [
  { label: 'Productos', icon: Package,     href: '/admin/products', color: 'text-emerald-400', bg: 'bg-emerald-400/10', desc: 'Gestiona el catálogo de productos' },
  { label: 'Órdenes',   icon: ShoppingBag, href: '/admin/orders',   color: 'text-blue-400',    bg: 'bg-blue-400/10',    desc: 'Revisa y administra pedidos'      },
  { label: 'Usuarios',  icon: Users,       href: '/admin/users',    color: 'text-purple-400',  bg: 'bg-purple-400/10',  desc: 'Gestiona los usuarios del sistema' },
  { label: 'Roles',     icon: Shield,      href: '/admin/roles',    color: 'text-orange-400',  bg: 'bg-orange-400/10',  desc: 'Administra permisos y roles'      },
];

function DashboardContent() {
  const router = useRouter();

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">

        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-white/50 text-sm mt-1">Resumen general del sistema</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className="glass-dark rounded-2xl p-5 text-left hover:border-white/20 border border-white/5 transition-all hover:-translate-y-1 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${item.bg}`}>
                  <Icon size={20} className={item.color} />
                </div>
                <p className="text-white font-bold">{item.label}</p>
                <p className="text-white/40 text-xs mt-1">{item.desc}</p>
                <p className="text-white/30 text-xs mt-2 flex items-center gap-1 group-hover:text-white/60 transition-colors">
                  Ver módulo <ChevronRight size={12} />
                </p>
              </button>
            );
          })}
        </div>

        <div className="glass-dark rounded-2xl p-6 border border-white/5">
          <p className="text-white/40 text-sm text-center">
            Selecciona un módulo del sidebar o las cards para comenzar
          </p>
        </div>

      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminLayout>
      <CartProvider>
        <DashboardContent />
      </CartProvider>
    </AdminLayout>
  );
}
