'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CartProvider } from '@/lib/cart-context';
import {
    Users, Plus, Edit2, Trash2, ArrowLeft,
    Save, X, RefreshCw, ChevronLeft, ChevronRight,
    AlertCircle, CheckCircle, Eye, EyeOff, Shield
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Role {
    id: string;
    name: string;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    username: string;
    role?: Role;
    createdAt: string;
    updateAt: string;
}

interface UsersResponse {
    data: User[];
    total: number;
    page: string | number;
    size: string | number;
}

interface ToastState {
    message: string;
    type: 'success' | 'error';
}

interface UserForm {
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    username: string;
    password: string;
    roleId: string;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: ToastState & { onClose: () => void }) {
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

// ─── User Avatar ──────────────────────────────────────────────────────────────
function UserAvatar({ firstName, lastName }: { firstName: string; lastName: string }) {
    const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
    const colors = [
        'bg-blue-500/20 text-blue-400',
        'bg-purple-500/20 text-purple-400',
        'bg-emerald-500/20 text-emerald-400',
        'bg-orange-500/20 text-orange-400',
        'bg-pink-500/20 text-pink-400',
        'bg-cyan-500/20 text-cyan-400',
    ];
    const color = colors[firstName.charCodeAt(0) % colors.length];
    return (
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${color}`}>
            {initials}
        </div>
    );
}

// ─── Role Badge ───────────────────────────────────────────────────────────────
function RoleBadge({ roleName }: { roleName?: string }) {
    if (!roleName) return <span className="text-white/20 text-xs">—</span>;
    const styles: Record<string, string> = {
        superadmin: 'bg-orange-400/15 text-orange-400 border-orange-400/30',
        admin:      'bg-indigo-400/15 text-indigo-400 border-indigo-400/30',
        callcenter: 'bg-emerald-400/15 text-emerald-400 border-emerald-400/30',
    };
    const style = styles[roleName.toLowerCase()] ?? 'bg-white/10 text-white/50 border-white/20';
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
            <Shield size={10} />
            {roleName}
        </span>
    );
}

// ─── Form Field ───────────────────────────────────────────────────────────────
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                {label}
            </label>
            {children}
        </div>
    );
}

// ─── Users Content ────────────────────────────────────────────────────────────
function UsersContent() {
    const [users, setUsers]     = useState<User[]>([]);
    const [roles, setRoles]     = useState<Role[]>([]);
    const [total, setTotal]     = useState(0);
    const [page, setPage]       = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving]   = useState(false);

    const [showForm, setShowForm]         = useState(false);
    const [editingUser, setEditingUser]   = useState<User | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState<UserForm>({
        firstName: '',
        lastName:  '',
        dni:       '',
        email:     '',
        username:  '',
        password:  '',
        roleId:    '',
    });

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [toast, setToast]           = useState<ToastState | null>(null);

    const SIZE       = 10;
    const totalPages = Math.ceil(total / SIZE);

    const getToken = () => {
        if (typeof window === 'undefined') return '';
        return localStorage.getItem('auth_token') || '';
    };

    // ── Load roles for dropdown ───────────────────────────────────────────────
    useEffect(() => {
        const loadRoles = async () => {
            try {
                const res  = await fetch('/api/roles?page=1&size=100', {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                const json = await res.json();
                setRoles(json.data || []);
            } catch { /* silent */ }
        };
        loadRoles();
    }, []);

    // ── Fetch users ───────────────────────────────────────────────────────────
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res  = await fetch(`/api/users?page=${page}&size=${SIZE}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const json: UsersResponse = await res.json();
            setUsers(json.data || []);
            setTotal(json.total || 0);
        } catch {
            setToast({ message: 'Error al cargar los usuarios', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    // ── Create / Update ───────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!form.firstName.trim() || !form.email.trim() || !form.username.trim()) return;
        setSaving(true);
        try {
            const isEdit = !!editingUser;
            const url    = isEdit ? `/api/users/${editingUser!.id}` : '/api/users';
            const method = isEdit ? 'PATCH' : 'POST';

            const body: Record<string, string> = {
                firstName: form.firstName.trim(),
                lastName:  form.lastName.trim(),
                dni:       form.dni.trim(),
                email:     form.email.trim(),
                username:  form.username.trim(),
                roleId:    form.roleId,
            };
            if (form.password.trim()) body.password = form.password.trim();

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:  `Bearer ${getToken()}`,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error();
            setToast({
                message: isEdit ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente',
                type: 'success',
            });
            resetForm();
            fetchUsers();
        } catch {
            setToast({ message: 'Error al guardar el usuario', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/users/${id}`, {
                method:  'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error();
            setToast({ message: 'Usuario eliminado correctamente', type: 'success' });
            setDeletingId(null);
            fetchUsers();
        } catch {
            setToast({ message: 'Error al eliminar el usuario', type: 'error' });
        }
    };

    // ── Helpers ───────────────────────────────────────────────────────────────
    const resetForm = () => {
        setShowForm(false);
        setEditingUser(null);
        setShowPassword(false);
        setForm({ firstName: '', lastName: '', dni: '', email: '', username: '', password: '', roleId: '' });
    };

    const openEditForm = (user: User) => {
        setEditingUser(user);
        setForm({
            firstName: user.firstName,
            lastName:  user.lastName,
            dni:       user.dni,
            email:     user.email,
            username:  user.username,
            password:  '',
            roleId:    user.role?.id || '',
        });
        setShowForm(true);
    };

    const isFormValid =
        form.firstName.trim() &&
        form.email.trim() &&
        form.username.trim() &&
        (editingUser || form.password.trim());

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-6xl mx-auto">

                {/* Breadcrumb */}
                <Link href="/admin" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 mb-6 transition-colors text-sm">
                    <ArrowLeft size={16} />
                    Volver al Panel
                </Link>

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-sky-400/10 flex items-center justify-center">
                            <Users size={24} className="text-sky-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>
                            <p className="text-white/40 text-sm mt-0.5">
                                {total} usuario{total !== 1 ? 's' : ''} en total
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchUsers}
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
                            Nuevo Usuario
                        </button>
                    </div>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="glass-dark rounded-2xl p-6 mb-6 border border-white/10">
                        <h2 className="text-lg font-bold text-white mb-5">
                            {editingUser
                                ? `Editar: ${editingUser.firstName} ${editingUser.lastName}`
                                : 'Crear nuevo usuario'}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField label="Nombre">
                                <input
                                    type="text"
                                    value={form.firstName}
                                    onChange={e => setForm({ ...form, firstName: e.target.value })}
                                    className="glass-input"
                                    placeholder="Harold Jhaysson"
                                    autoFocus
                                />
                            </FormField>

                            <FormField label="Apellido">
                                <input
                                    type="text"
                                    value={form.lastName}
                                    onChange={e => setForm({ ...form, lastName: e.target.value })}
                                    className="glass-input"
                                    placeholder="Apaza Monasterio"
                                />
                            </FormField>

                            <FormField label="DNI / CI">
                                <input
                                    type="text"
                                    value={form.dni}
                                    onChange={e => setForm({ ...form, dni: e.target.value })}
                                    className="glass-input"
                                    placeholder="13613979"
                                />
                            </FormField>

                            <FormField label="Correo electrónico">
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="glass-input"
                                    placeholder="correo@ejemplo.com"
                                />
                            </FormField>

                            <FormField label="Nombre de usuario">
                                <input
                                    type="text"
                                    value={form.username}
                                    onChange={e => setForm({ ...form, username: e.target.value })}
                                    className="glass-input"
                                    placeholder="haroldcorp"
                                />
                            </FormField>

                            <FormField label={editingUser ? 'Contraseña (vacío = sin cambios)' : 'Contraseña'}>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        className="glass-input pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </FormField>

                            <FormField label="Rol">
                                <select
                                    value={form.roleId}
                                    onChange={e => setForm({ ...form, roleId: e.target.value })}
                                    className="glass-input"
                                >
                                    <option value="">— Seleccionar rol —</option>
                                    {roles.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </FormField>
                        </div>

                        <div className="flex justify-end gap-3 mt-5">
                            <button
                                onClick={resetForm}
                                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 transition-all inline-flex items-center gap-2"
                            >
                                <X size={16} />
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !isFormValid}
                                className="px-5 py-2 rounded-xl text-white font-semibold text-sm inline-flex items-center gap-2 transition-all disabled:opacity-50"
                                style={{ background: 'linear-gradient(to right, #10b981, #059669)' }}
                            >
                                {saving
                                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : <Save size={16} />
                                }
                                {editingUser ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="glass-dark rounded-2xl overflow-hidden border border-white/5">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white/5 border-b border-white/10">
                        <div className="col-span-1 text-white/40 text-xs font-bold uppercase tracking-wider">#</div>
                        <div className="col-span-3 text-white/40 text-xs font-bold uppercase tracking-wider">Nombre</div>
                        <div className="col-span-3 text-white/40 text-xs font-bold uppercase tracking-wider">Correo</div>
                        <div className="col-span-2 text-white/40 text-xs font-bold uppercase tracking-wider">Usuario</div>
                        <div className="col-span-1 text-white/40 text-xs font-bold uppercase tracking-wider">Rol</div>
                        <div className="col-span-2 text-white/40 text-xs font-bold uppercase tracking-wider text-right">Acciones</div>
                    </div>

                    {loading && (
                        <div className="flex items-center justify-center py-16 gap-3">
                            <div className="w-6 h-6 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
                            <p className="text-white/40">Cargando usuarios...</p>
                        </div>
                    )}

                    {!loading && users.map((user, idx) => (
                        <div
                            key={user.id}
                            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center"
                        >
                            <div className="col-span-1 text-white/30 text-sm font-mono">
                                {(page - 1) * SIZE + idx + 1}
                            </div>
                            <div className="col-span-3 flex items-center gap-3 min-w-0">
                                <UserAvatar firstName={user.firstName} lastName={user.lastName} />
                                <div className="min-w-0">
                                    <p className="text-white font-semibold text-sm truncate">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-white/30 text-xs truncate">CI: {user.dni}</p>
                                </div>
                            </div>
                            <div className="col-span-3 text-white/40 text-sm truncate">
                                {user.email}
                            </div>
                            <div className="col-span-2 text-white/50 text-sm font-mono truncate">
                                @{user.username}
                            </div>
                            <div className="col-span-1">
                                <RoleBadge roleName={user.role?.name} />
                            </div>
                            <div className="col-span-2 flex justify-end gap-2">
                                <button
                                    onClick={() => openEditForm(user)}
                                    className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                                    title="Editar"
                                >
                                    <Edit2 size={14} />
                                </button>
                                {deletingId === user.id ? (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleDelete(user.id)}
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
                                        onClick={() => setDeletingId(user.id)}
                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {!loading && users.length === 0 && (
                        <div className="text-center py-16">
                            <Users size={40} className="mx-auto text-white/10 mb-4" />
                            <p className="text-white/30">No hay usuarios registrados</p>
                        </div>
                    )}

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

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UsersPage() {
    return (
        <AdminLayout>
            <CartProvider>
                <UsersContent />
            </CartProvider>
        </AdminLayout>
    );
}