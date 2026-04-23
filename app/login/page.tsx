'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {  // ← proxy local
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: form.username,
                    password: form.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Usuario o contraseña incorrectos');
                return;
            }

            // Guardar tokens que devuelve tu API
            localStorage.setItem('auth_token', data.accessToken);
            localStorage.setItem('auth_refresh_token', data.refreshToken);
            localStorage.setItem('auth_user', JSON.stringify(data.user));

            document.cookie = `auth_token=${data.accessToken}; path=/; max-age=86400`;

            // Redirigir al admin
            router.push('/admin');

        } catch (err) {
            setError('Error de conexión. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center px-4">

            {/* Background glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-red-500/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative">

                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <div className="text-3xl font-bold gradient-text-purple mb-2">Viral Shop Bo</div>
                    </Link>
                    <p className="text-white/50 text-sm">Panel de Administración</p>
                </div>

                {/* Card */}
                <div className="glass-dark rounded-3xl p-8 space-y-6">

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                             style={{ background: 'linear-gradient(to right, #f97316, #ef4444)' }}>
                            <ShieldCheck size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Iniciar Sesión</h1>
                            <p className="text-white/50 text-sm">Acceso exclusivo para administradores</p>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                            <p className="text-red-400 text-sm font-medium">⚠ {error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Usuario */}
                        <div>
                            <label className="block text-white/70 text-sm font-semibold mb-2">
                                Usuario
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                                autoComplete="username"
                                placeholder="Ingresa tu usuario"
                                className="glass-input"
                            />
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block text-white/70 text-sm font-semibold mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                    placeholder="Ingresa tu contraseña"
                                    className="glass-input pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all"
                            style={{
                                background: loading
                                    ? 'rgba(255,255,255,0.1)'
                                    : 'linear-gradient(to right, #f97316, #ef4444)',
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Ingresando...
                                </>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Ingresar
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="border-t border-white/10 pt-4 text-center">
                        <Link href="/" className="text-white/40 hover:text-white/70 text-sm transition-colors">
                            ← Volver a la tienda
                        </Link>
                    </div>
                </div>

                <p className="text-center text-white/20 text-xs mt-6">
                    © 2026 Viral Shop Bo — Acceso restringido
                </p>
            </div>
        </div>
    );
}