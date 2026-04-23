"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode, CSSProperties } from "react";

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface AdminLayoutProps {
    children: ReactNode;
}

interface NavItem {
    label: string;
    icon: keyof typeof ICONS;
    href: string;
}

// ── Iconos SVG ────────────────────────────────────────────────────────────────
const ICONS = {
    dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    products:  "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
    orders:    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2",
    users:     "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
    roles:     "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    search:    "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
    cart:      "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0",
    login:     "M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4 M10 17l5-5-5-5 M15 12H3",
    chevronL:  "M15 18l-6-6 6-6",
    chevronR:  "M9 18l6-6-6-6",
} as const;

// Ajusta los href a tus rutas reales según la carpeta app/
const NAV: NavItem[] = [
    { label: "Dashboard", icon: "dashboard", href: "/admin"           },
    { label: "Productos", icon: "products",  href: "/admin/productos"  },
    { label: "Órdenes",   icon: "orders",    href: "/admin/orders"     },
    { label: "Usuarios",  icon: "users",     href: "/admin/users"   },
    { label: "Roles",     icon: "roles",     href: "/admin/roles"      },
];

// ── Icono SVG ─────────────────────────────────────────────────────────────────
function SvgIcon({ d, size = 16, color = "currentColor" }: { d: string; size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
             stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d={d} />
        </svg>
    );
}

// ── Botón topbar ──────────────────────────────────────────────────────────────
function TopBarBtn({ icon }: { icon: keyof typeof ICONS }) {
    const s: CSSProperties = {
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8, width: 36, height: 36, cursor: "pointer",
        color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center",
    };
    return <button style={s}><SvgIcon d={ICONS[icon]} size={16} /></button>;
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname  = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const sideW = collapsed ? 64 : 210;

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#070d1a", fontFamily: "'Sora','DM Sans',system-ui,sans-serif", color: "#f1f5f9" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>

            {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
            <aside style={{
                width: sideW, flexShrink: 0,
                background: "#0a1120",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                display: "flex", flexDirection: "column",
                padding: "20px 0",
                position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 100,
                transition: "width .25s ease", overflow: "hidden",
            }}>

                {/* Logo + botón colapsar */}
                <div style={{ padding: "0 16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {!collapsed && (
                        <span style={{ fontSize: 18, fontWeight: 800, color: "#fbbf24", whiteSpace: "nowrap" }}>
              Viral Shop Bo
            </span>
                    )}
                    <button onClick={() => setCollapsed(!collapsed)} style={{
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8, width: 28, height: 28, cursor: "pointer", color: "#475569",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, marginLeft: collapsed ? "auto" : 0,
                    }}>
                        <SvgIcon d={collapsed ? ICONS.chevronR : ICONS.chevronL} size={14} />
                    </button>
                </div>

                {/* Etiqueta */}
                {!collapsed && (
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.1em", padding: "0 24px", margin: "0 0 6px" }}>
                        MENÚ PRINCIPAL
                    </p>
                )}

                {/* Nav items */}
                <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 2 }}>
                    {NAV.map(({ label, icon, href }) => {
                        const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
                        return (
                            <Link key={href} href={href} title={collapsed ? label : undefined} style={{
                                display: "flex", alignItems: "center",
                                gap: collapsed ? 0 : 10,
                                justifyContent: collapsed ? "center" : "space-between",
                                padding: collapsed ? "10px" : "9px 12px",
                                borderRadius: 10,
                                background: active ? "rgba(56,189,248,0.1)" : "transparent",
                                color: active ? "#38bdf8" : "#475569",
                                fontSize: 13, fontWeight: active ? 700 : 500,
                                transition: "background .15s", textDecoration: "none",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: collapsed ? 0 : 10 }}>
                                    <SvgIcon d={ICONS[icon]} size={16} color={active ? "#38bdf8" : "#475569"} />
                                    {!collapsed && label}
                                </div>
                                {!collapsed && (
                                    active
                                        ? <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#38bdf8" }} />
                                        : <SvgIcon d={ICONS.chevronR} size={12} color="#334155" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Ir a la Tienda */}
                <div style={{ padding: "12px 10px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <Link href="/" title={collapsed ? "Ir a la Tienda" : undefined} style={{
                        display: "flex", alignItems: "center",
                        gap: collapsed ? 0 : 10,
                        justifyContent: collapsed ? "center" : "flex-start",
                        padding: collapsed ? "10px" : "9px 12px",
                        borderRadius: 10, color: "#475569", fontSize: 13, textDecoration: "none",
                    }}>
                        <SvgIcon d={ICONS.chevronL} size={16} color="#475569" />
                        {!collapsed && "Ir a la Tienda"}
                    </Link>
                </div>
            </aside>

            {/* ── Área derecha ────────────────────────────────────────────────────── */}
            <div style={{ marginLeft: sideW, flex: 1, display: "flex", flexDirection: "column", transition: "margin-left .25s ease" }}>

                {/* Topbar */}
                <header style={{
                    background: "#0a1120",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    padding: "0 28px", height: 60,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    position: "sticky", top: 0, zIndex: 50,
                }}>
                    <div style={{ display: "flex", gap: 24 }}>
                        <Link href="/"     style={{ color: "#64748b", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Inicio</Link>
                        <Link href="/shop" style={{ color: "#64748b", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Productos</Link>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <TopBarBtn icon="search" />
                        <TopBarBtn icon="cart" />
                        <Link href="/login" style={{
                            background: "#fb923c", borderRadius: 8, padding: "8px 14px",
                            color: "#fff", fontSize: 13, fontWeight: 700,
                            display: "flex", alignItems: "center", gap: 6, textDecoration: "none",
                        }}>
                            <SvgIcon d={ICONS.login} size={14} color="#fff" />
                            Iniciar Sesión
                        </Link>
                    </div>
                </header>

                {/* 👇 Aquí va el contenido de cada página */}
                <main style={{ flex: 1, padding: "28px 32px" }}>
                    {children}
                </main>
            </div>
        </div>
    );
}