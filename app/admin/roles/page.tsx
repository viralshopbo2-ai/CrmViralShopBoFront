'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CartProvider } from '@/lib/cart-context';
import {
    Shield, Plus, Edit2, Trash2, ArrowLeft,
    Save, X, RefreshCw, ChevronLeft, ChevronRight,
    AlertCircle, CheckCircle
} from 'lucide-react';
import AdminLayout from "@/components/AdminLayout";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Role {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string | null;
}

interface RolesResponse {
    data: Role[];
    total: number;
    page: number;
    size: number;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border transition-all
            ${type === 'success'
            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
            : 'bg-red-500/20 border-red-500/40 text-red-400'
        }`}>
            {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{message}</span>
        </div>
    );
}

// ─── Main Content ─────────────────────────────────────────────────────────────
function RolesContent() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formName, setFormName] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const SIZE = 10;
    const totalPages = Math.ceil(total / SIZE);

    const getToken = () => {
        if (typeof window === 'undefined') return '';
        return localStorage.getItem('auth_token') || '';
    };

    const fetchRoles = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/roles?page=${page}&size=${SIZE}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const json: RolesResponse = await res.json();
            setRoles(json.data || []);
            setTotal(json.total || 0);
        } catch {
            setToast({ message: 'Error al cargar los roles', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => { fetchRoles(); }, [fetchRoles]);

    const handleSave = async () => {
        if (!formName.trim()) return;
        setSaving(true);
        try {
            const isEdit = !!editingRole;
            const url    = isEdit ? `/api/roles/${editingRole!.id}` : '/api/roles';
            const method = isEdit ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ name: formName.trim() }),
            });

            if (!res.ok) throw new Error();
            setToast({ message: isEdit ? 'Rol actualizado correctamente' : 'Rol creado correctamente', type: 'success' });
            resetForm();
            fetchRoles();
        } catch {
            setToast({ message: 'Error al guardar el rol', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/roles/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error();
            setToast({ message: 'Rol eliminado correctamente', type: 'success' });
            setDeletingId(null);
            fetchRoles();
        } catch {
            setToast({ message: 'Error al eliminar el rol', type: 'error' });
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingRole(null);
        setFormName('');
    };

    const openEdit = (role: Role) => {
        setEditingRole(role);
        setFormName(role.name);
        setShowForm(true);
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit', month: 'short', year: 'numeric',
        });

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-4xl mx-auto">

                {/* Breadcrumb */}
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 mb-6 transition-colors text-sm"
                >
                    <ArrowLeft size={16} />
                    Volver al Panel
                </Link>

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-400/10 flex items-center justify-center">
                            <Shield size={24} className="text-orange-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Gestión de Roles</h1>
                            <p className="text-white/40 text-sm mt-0.5">
                                {total} rol{total !== 1 ? 'es' : ''} en total
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchRoles}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
                            title="Recargar"
                        >
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button
                            onClick={() => { resetForm(); setShowForm(true); }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all"
                            style={{ background: 'linear-gradient(to right, #f97316, #ef4444)' }}
                        >
                            <Plus size={16} />
                            Nuevo Rol
                        </button>
                    </div>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="glass-dark rounded-2xl p-6 mb-6 border border-white/10">
                        <h2 className="text-lg font-bold text-white mb-4">
                            {editingRole ? `Editar: ${editingRole.name}` : 'Crear nuevo rol'}
                        </h2>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-white/60 text-sm mb-2">Nombre del rol</label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                    className="glass-input"
                                    placeholder="Ej: Admin, Moderador, Vendedor..."
                                    autoFocus
                                />
                            </div>
                            <div className="flex items-end gap-2">
                                <button
                                    onClick={resetForm}
                                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 transition-all"
                                >
                                    <X size={18} />
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !formName.trim()}
                                    className="px-5 py-2 rounded-xl text-white font-semibold text-sm inline-flex items-center gap-2 transition-all disabled:opacity-50"
                                    style={{ background: 'linear-gradient(to right, #10b981, #059669)' }}
                                >
                                    {saving
                                        ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        : <Save size={16} />
                                    }
                                    {editingRole ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="glass-dark rounded-2xl overflow-hidden border border-white/5">

                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white/5 border-b border-white/10">
                        <div className="col-span-1 text-white/40 text-xs font-bold uppercase tracking-wider">#</div>
                        <div className="col-span-5 text-white/40 text-xs font-bold uppercase tracking-wider">Nombre</div>
                        <div className="col-span-3 text-white/40 text-xs font-bold uppercase tracking-wider">Creado</div>
                        <div className="col-span-3 text-white/40 text-xs font-bold uppercase tracking-wider text-right">Acciones</div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center py-16 gap-3">
                            <div className="w-6 h-6 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin" />
                            <p className="text-white/40">Cargando roles...</p>
                        </div>
                    )}

                    {/* Rows */}
                    {!loading && roles.map((role, idx) => (
                        <div
                            key={role.id}
                            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center"
                        >
                            <div className="col-span-1 text-white/30 text-sm font-mono">
                                {(page - 1) * SIZE + idx + 1}
                            </div>
                            <div className="col-span-5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                                    <Shield size={14} className="text-orange-400" />
                                </div>
                                <span className="text-white font-semibold">{role.name}</span>
                            </div>
                            <div className="col-span-3 text-white/40 text-sm">
                                {formatDate(role.createdAt)}
                            </div>
                            <div className="col-span-3 flex justify-end gap-2">
                                <button
                                    onClick={() => openEdit(role)}
                                    className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                                    title="Editar"
                                >
                                    <Edit2 size={14} />
                                </button>
                                {deletingId === role.id ? (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleDelete(role.id)}
                                            className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold transition-colors"
                                        >
                                            Confirmar
                                        </button>
                                        <button
                                            onClick={() => setDeletingId(null)}
                                            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 text-xs transition-colors"
                                        >
                                            No
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setDeletingId(role.id)}
                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Empty */}
                    {!loading && roles.length === 0 && (
                        <div className="text-center py-16">
                            <Shield size={40} className="mx-auto text-white/10 mb-4" />
                            <p className="text-white/30">No hay roles registrados</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
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

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RolesPage() {
    return (
        <AdminLayout>
            <CartProvider>
                <RolesContent />
            </CartProvider>
        </AdminLayout>
    );
}