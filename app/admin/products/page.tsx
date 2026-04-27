'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { CartProvider } from '@/lib/cart-context';
import {
    Package, Plus, Edit2, Trash2, ArrowLeft,
    Save, X, RefreshCw, ChevronLeft, ChevronRight,
    AlertCircle, CheckCircle, Star, Upload, Film, ImageIcon, Eye,
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    stars: number;
    reviews: number;
    specifications: string[];
    characteristics: string[];
    comments: string[];
    frequentlyQuestions: string[];
    images: string[];
    video: string;
    gif: string;
}

interface ProductForm {
    name: string;
    price: string;
    description: string;
    stock: string;
    stars: string;
    reviews: string;
    specifications: string[];
    characteristics: string[];
    comments: string[];
    frequentlyQuestions: string[];
}

interface ToastState { message: string; type: 'success' | 'error'; }

const emptyForm = (): ProductForm => ({
    name: '', price: '', description: '', stock: '', stars: '4.5', reviews: '0',
    specifications: [''], characteristics: [''], comments: [], frequentlyQuestions: [],
});

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: ToastState & { onClose: () => void }) {
    useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border
            ${type === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-red-500/20 border-red-500/40 text-red-400'}`}>
            {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{message}</span>
        </div>
    );
}

// ─── Campo de array dinámico ───────────────────────────────────────────────────
function ArrayField({ label, values, onChange, placeholder, optional }: {
    label: string; values: string[]; onChange: (v: string[]) => void;
    placeholder?: string; optional?: boolean;
}) {
    const add    = () => onChange([...values, '']);
    const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
    const update = (i: number, v: string) => onChange(values.map((x, idx) => idx === i ? v : x));
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                    {label}{optional && <span className="text-white/30 normal-case font-normal ml-1">(opcional)</span>}
                </label>
                <button onClick={add} type="button" className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors">
                    <Plus size={12} /> Agregar
                </button>
            </div>
            <div className="space-y-2">
                {values.length === 0 && (
                    <button onClick={add} type="button"
                        className="w-full py-3 border border-dashed border-white/10 rounded-xl text-white/30 text-sm hover:border-white/20 transition-colors">
                        + Agregar {label}
                    </button>
                )}
                {values.map((v, i) => (
                    <div key={i} className="flex gap-2">
                        <input type="text" value={v} onChange={e => update(i, e.target.value)}
                            className="glass-input flex-1" placeholder={placeholder || `${label} ${i + 1}`} />
                        <button onClick={() => remove(i)} type="button"
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 shrink-0 transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">{children}</label>;
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">{title}</p>
            {children}
        </div>
    );
}

function StockBadge({ stock }: { stock: number }) {
    if (stock <= 0)  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">Sin stock</span>;
    if (stock <= 10) return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400">{stock} uds</span>;
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">{stock} uds</span>;
}

// ─── Zona de subida de archivos ────────────────────────────────────────────────
function FileDropZone({ accept, multiple, onSelect, label, icon: Icon }: {
    accept: string; multiple?: boolean; onSelect: (files: File[]) => void;
    label: string; icon: React.ElementType;
}) {
    const ref = useRef<HTMLInputElement>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) onSelect(Array.from(e.target.files));
    };
    return (
        <label
            className="flex flex-col items-center gap-2 p-6 border border-dashed border-white/10 rounded-xl cursor-pointer hover:border-sky-400/40 hover:bg-sky-400/5 transition-all"
            onClick={() => ref.current?.click()}
        >
            <Icon size={24} className="text-white/20" />
            <span className="text-white/40 text-sm">{label}</span>
            <span className="text-white/20 text-xs">Haz clic para seleccionar</span>
            <input ref={ref} type="file" accept={accept} multiple={multiple} className="hidden" onChange={handleChange} />
        </label>
    );
}

// ─── Modal de Detalle ─────────────────────────────────────────────────────────
function ProductDetailModal({ product, onClose }: { product: Product; onClose: () => void }) {
    const [activeImg, setActiveImg] = useState(0);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const images = product.images?.filter(Boolean) ?? [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-dark rounded-2xl border border-white/10 z-10">

                {/* Header */}
                <div className="sticky top-0 z-10 glass-dark flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <h2 className="text-white font-bold text-lg truncate pr-4">{product.name}</h2>
                    <button onClick={onClose}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors shrink-0">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">

                    {/* Galería + Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Galería de imágenes */}
                        <div className="space-y-3">
                            {images.length > 0 ? (
                                <>
                                    <div className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/5">
                                        <img src={images[activeImg]} alt={product.name}
                                            className="w-full h-full object-cover"
                                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                    </div>
                                    {images.length > 1 && (
                                        <div className="grid grid-cols-5 gap-2">
                                            {images.map((url, i) => (
                                                <button key={i} onClick={() => setActiveImg(i)}
                                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-sky-400 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                                                    <img src={url} alt={`img-${i}`} className="w-full h-full object-cover"
                                                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="aspect-square rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                                    <Package size={48} className="text-white/10" />
                                </div>
                            )}
                        </div>

                        {/* Info principal */}
                        <div className="space-y-4">
                            <div>
                                <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Precio</p>
                                <p className="text-4xl font-bold text-emerald-400">Bs. {product.price}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="glass rounded-xl p-3">
                                    <p className="text-white/30 text-xs mb-1">Stock</p>
                                    <p className="text-white font-bold text-xl">{product.stock} <span className="text-white/30 text-sm font-normal">uds</span></p>
                                </div>
                                <div className="glass rounded-xl p-3">
                                    <p className="text-white/30 text-xs mb-1">Rating</p>
                                    <div className="flex items-center gap-1.5">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        <p className="text-white font-bold text-xl">{product.stars}</p>
                                        <p className="text-white/30 text-xs">({product.reviews})</p>
                                    </div>
                                </div>
                            </div>

                            {product.description && (
                                <div>
                                    <p className="text-white/30 text-xs uppercase tracking-wider mb-2">Descripción</p>
                                    <p className="text-white/70 text-sm leading-relaxed">{product.description}</p>
                                </div>
                            )}

                            {(product.video || product.gif) && (
                                <div className="flex gap-3">
                                    {product.video && (
                                        <a href={product.video} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 text-xs hover:bg-purple-500/20 transition-colors">
                                            <Film size={12} /> Ver video
                                        </a>
                                    )}
                                    {product.gif && (
                                        <a href={product.gif} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-400 text-xs hover:bg-pink-500/20 transition-colors">
                                            <ImageIcon size={12} /> Ver GIF
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Especificaciones */}
                    {(product.specifications?.filter(Boolean).length ?? 0) > 0 && (
                        <div>
                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2 mb-3">Especificaciones</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {product.specifications.filter(Boolean).map((s, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                        <span className="text-white/70">{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Características */}
                    {(product.characteristics?.filter(Boolean).length ?? 0) > 0 && (
                        <div>
                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2 mb-3">Características</p>
                            <div className="flex flex-wrap gap-2">
                                {product.characteristics.filter(Boolean).map((c, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-sky-400/10 text-sky-400 text-xs font-medium border border-sky-400/20">
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Comentarios */}
                    {(product.comments?.filter(Boolean).length ?? 0) > 0 && (
                        <div>
                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2 mb-3">Comentarios</p>
                            <div className="space-y-2">
                                {product.comments.filter(Boolean).map((c, i) => (
                                    <div key={i} className="glass rounded-xl px-4 py-3 text-sm text-white/60 italic">
                                        "{c}"
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Preguntas frecuentes */}
                    {(product.frequentlyQuestions?.filter(Boolean).length ?? 0) > 0 && (
                        <div>
                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2 mb-3">Preguntas frecuentes</p>
                            <div className="space-y-2">
                                {product.frequentlyQuestions.filter(Boolean).map((q, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="text-orange-400 font-bold text-sm shrink-0 mt-0.5">Q.</span>
                                        <span className="text-white/70 text-sm">{q}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

// ─── Products Content ─────────────────────────────────────────────────────────
function ProductsContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal]       = useState(0);
    const [page, setPage]         = useState(1);
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState(false);
    const [uploadStep, setUploadStep] = useState('');

    const [showForm, setShowForm]             = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form, setForm]                     = useState<ProductForm>(emptyForm());
    const [activeTab, setActiveTab]           = useState<'basic' | 'media' | 'details'>('basic');

    // Archivos a subir
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [videoFile, setVideoFile]   = useState<File | null>(null);
    const [gifFile, setGifFile]       = useState<File | null>(null);

    const [deletingId, setDeletingId]     = useState<string | null>(null);
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
    const [toast, setToast]               = useState<ToastState | null>(null);

    const SIZE       = 20;
    const totalPages = Math.ceil(total / SIZE);

    const getToken = () => typeof window !== 'undefined' ? (localStorage.getItem('auth_token') || '') : '';

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res  = await fetch(`/api/products?page=${page}&size=${SIZE}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const json = await res.json();
            const raw: any[] = Array.isArray(json) ? json : (json.data || []);
            const list: Product[] = raw.map((p: any) => ({
                ...p,
                images: Array.isArray(p.images) ? p.images : [],
            }));
            const tot: number = Array.isArray(json) ? json.length : (json.total || raw.length);
            setProducts(list);
            setTotal(tot);
        } catch {
            setToast({ message: 'Error al cargar los productos', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => { void fetchProducts(); }, [fetchProducts]);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const f   = (key: keyof ProductForm, val: string) => setForm(prev => ({ ...prev, [key]: val }));
    const arr = (key: keyof ProductForm, val: string[]) => setForm(prev => ({ ...prev, [key]: val }));

    const resetForm = () => {
        setShowForm(false);
        setEditingProduct(null);
        setForm(emptyForm());
        setImageFiles([]);
        setVideoFile(null);
        setGifFile(null);
        setActiveTab('basic');
        setUploadStep('');
    };

    const openEditForm = (p: Product) => {
        setEditingProduct(p);
        setForm({
            name:                p.name,
            price:               String(p.price),
            description:         p.description,
            stock:               String(p.stock),
            stars:               String(p.stars),
            reviews:             String(p.reviews),
            specifications:      p.specifications?.length  ? p.specifications  : [''],
            characteristics:     p.characteristics?.length ? p.characteristics : [''],
            comments:            p.comments            || [],
            frequentlyQuestions: p.frequentlyQuestions || [],
        });
        setImageFiles([]);
        setVideoFile(null);
        setGifFile(null);
        setActiveTab('basic');
        setShowForm(true);
    };

    // ── Subir archivos multimedia ─────────────────────────────────────────────
    const uploadMedia = async (productId: string) => {
        const hasImages = imageFiles.length > 0;
        const hasVideo  = !!videoFile;
        if (!hasImages && !hasVideo) return true;

        const token = `Bearer ${getToken()}`;
        let ok = true;

        // Imágenes → /images  (campo: files, múltiples)
        if (hasImages) {
            setUploadStep(`Subiendo ${imageFiles.length} imagen(es)...`);
            const fd = new FormData();
            imageFiles.forEach(f => fd.append('files', f));
            const res = await fetch(`/api/products/${productId}/images`, {
                method: 'POST', headers: { Authorization: token }, body: fd,
            });
            if (!res.ok) ok = false;
        }

        // Video → /video  (campo: file, único)
        if (hasVideo) {
            setUploadStep('Subiendo video...');
            const fd = new FormData();
            fd.append('file', videoFile!);
            const res = await fetch(`/api/products/${productId}/video`, {
                method: 'POST', headers: { Authorization: token }, body: fd,
            });
            if (!res.ok) ok = false;
        }

        return ok;
    };

    // ── Guardar ───────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!form.name.trim() || !form.price || !form.stock) return;
        setSaving(true);
        setUploadStep('Guardando producto...');
        try {
            const isEdit = !!editingProduct;
            const url    = isEdit ? `/api/products/${editingProduct!.id}` : '/api/products';
            const method = isEdit ? 'PATCH' : 'POST';

            const body: Record<string, unknown> = {
                name:                form.name.trim(),
                price:               parseFloat(form.price),
                description:         form.description.trim(),
                stock:               parseInt(form.stock),
                stars:               parseFloat(form.stars),
                reviews:             parseInt(form.reviews),
                specifications:      form.specifications.filter(s => s.trim()),
                characteristics:     form.characteristics.filter(s => s.trim()),
                comments:            form.comments.filter(s => s.trim()),
                frequentlyQuestions: form.frequentlyQuestions.filter(s => s.trim()),
                // No incluir images/video/gif — se suben en paso separado
            };

            console.log('[products] sending body:', JSON.stringify(body));

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body:    JSON.stringify(body),
            });

            if (!res.ok) {
                const rawText = await res.text().catch(() => '');
                console.warn('[products] status:', res.status, res.statusText);
                console.warn('[products] raw:', rawText.slice(0, 300));
                let errMsg = `HTTP ${res.status}`;
                try {
                    const errData = JSON.parse(rawText);
                    if (Array.isArray(errData.message)) errMsg = errData.message.join(' | ');
                    else if (errData.message) errMsg = errData.message;
                } catch {
                    // body no es JSON — mostrar los primeros 120 chars
                    errMsg = rawText.slice(0, 120) || `HTTP ${res.status}`;
                }
                throw new Error(errMsg);
            }

            const product = await res.json();

            // Para edición usamos el ID que ya conocemos; para creación lo sacamos de la respuesta
            const productId: string = isEdit ? editingProduct!.id : (product.id ?? '');

            // Subir archivos al endpoint de imágenes si el usuario seleccionó alguno
            if (productId) {
                const uploaded = await uploadMedia(productId);
                if (!uploaded) {
                    setToast({ message: 'Producto guardado pero algunos archivos no se subieron', type: 'error' });
                    void fetchProducts();
                    resetForm();
                    return;
                }
            }

            setToast({
                message: isEdit ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
                type: 'success',
            });
            resetForm();
            void fetchProducts();
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Error al guardar el producto';
            setToast({ message: msg, type: 'error' });
        } finally {
            setSaving(false);
            setUploadStep('');
        }
    };

    // ── Eliminar ──────────────────────────────────────────────────────────────
    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method:  'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error('delete');
            setToast({ message: 'Producto eliminado correctamente', type: 'success' });
            setDeletingId(null);
            void fetchProducts();
        } catch {
            setToast({ message: 'Error al eliminar el producto', type: 'error' });
        }
    };

    const isFormValid = form.name.trim() && form.price && form.stock;

    const tabs = [
        { id: 'basic',   label: 'Básico'    },
        { id: 'media',   label: 'Multimedia' },
        { id: 'details', label: 'Detalles'   },
    ] as const;

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-6xl mx-auto">

                <Link href="/admin" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 mb-6 transition-colors text-sm">
                    <ArrowLeft size={16} /> Volver al Panel
                </Link>

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 flex items-center justify-center">
                            <Package size={24} className="text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Gestión de Productos</h1>
                            <p className="text-white/40 text-sm mt-0.5">{total} producto{total !== 1 ? 's' : ''} en total</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={fetchProducts}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all" title="Recargar">
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button onClick={() => { resetForm(); setShowForm(true); }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold"
                            style={{ background: 'linear-gradient(to right, #f97316, #ef4444)' }}>
                            <Plus size={16} /> Nuevo Producto
                        </button>
                    </div>
                </div>

                {/* ── Formulario ────────────────────────────────────────────── */}
                {showForm && (
                    <div className="glass-dark rounded-2xl p-6 mb-6 border border-white/10">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-white">
                                {editingProduct ? `Editar: ${editingProduct.name}` : 'Crear nuevo producto'}
                            </h2>
                            <button onClick={resetForm} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit">
                            {tabs.map(t => (
                                <button key={t.id} onClick={() => setActiveTab(t.id)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                                        activeTab === t.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}>
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab: Básico */}
                        {activeTab === 'basic' && (
                            <div className="space-y-4">
                                <div>
                                    <FieldLabel>Nombre del producto</FieldLabel>
                                    <input type="text" value={form.name} onChange={e => f('name', e.target.value)}
                                        className="glass-input" placeholder="Masajeador Muscular de Percusión Pro" autoFocus />
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div>
                                        <FieldLabel>Precio (Bs.)</FieldLabel>
                                        <input type="number" value={form.price} min="0" step="0.01"
                                            onChange={e => f('price', e.target.value)} className="glass-input" placeholder="259" />
                                    </div>
                                    <div>
                                        <FieldLabel>Stock</FieldLabel>
                                        <input type="number" value={form.stock} min="0"
                                            onChange={e => f('stock', e.target.value)} className="glass-input" placeholder="30" />
                                    </div>
                                    <div>
                                        <FieldLabel>Estrellas</FieldLabel>
                                        <input type="number" value={form.stars} min="0" max="5" step="0.1"
                                            onChange={e => f('stars', e.target.value)} className="glass-input" placeholder="4.5" />
                                    </div>
                                    <div>
                                        <FieldLabel>Reseñas</FieldLabel>
                                        <input type="number" value={form.reviews} min="0"
                                            onChange={e => f('reviews', e.target.value)} className="glass-input" placeholder="125" />
                                    </div>
                                </div>
                                <div>
                                    <FieldLabel>Descripción</FieldLabel>
                                    <textarea value={form.description} onChange={e => f('description', e.target.value)}
                                        className="glass-input resize-none" rows={4}
                                        placeholder="Describe el producto detalladamente..." />
                                </div>
                            </div>
                        )}

                        {/* Tab: Multimedia */}
                        {activeTab === 'media' && (
                            <div className="space-y-6">

                                {/* Imágenes existentes (edición) */}
                                {(editingProduct?.images?.length ?? 0) > 0 && (
                                    <FormSection title="Imágenes actuales">
                                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                            {editingProduct?.images?.map((url, i) => (
                                                <img key={i} src={url} alt={`img-${i}`}
                                                    className="w-full aspect-square object-cover rounded-lg bg-white/5"
                                                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                            ))}
                                        </div>
                                    </FormSection>
                                )}

                                {/* Subir nuevas imágenes */}
                                <FormSection title={editingProduct ? 'Añadir más imágenes' : 'Imágenes del producto'}>
                                    {imageFiles.length === 0 ? (
                                        <FileDropZone
                                            accept="image/*" multiple
                                            onSelect={files => setImageFiles(prev => [...prev, ...files])}
                                            label="Imágenes del producto" icon={ImageIcon}
                                        />
                                    ) : (
                                        <div>
                                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
                                                {imageFiles.map((file, i) => (
                                                    <div key={i} className="relative group">
                                                        <img
                                                            src={URL.createObjectURL(file)} alt={file.name}
                                                            className="w-full aspect-square object-cover rounded-lg bg-white/5"
                                                        />
                                                        <button
                                                            onClick={() => setImageFiles(prev => prev.filter((_, idx) => idx !== i))}
                                                            className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <X size={10} className="text-white" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <label className="w-full aspect-square border border-dashed border-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:border-sky-400/40 transition-colors">
                                                    <Plus size={20} className="text-white/20" />
                                                    <input type="file" accept="image/*" multiple className="hidden"
                                                        onChange={e => { if (e.target.files) setImageFiles(prev => [...prev, ...Array.from(e.target.files!)]); }} />
                                                </label>
                                            </div>
                                            <p className="text-white/30 text-xs">{imageFiles.length} imagen(es) seleccionada(s)</p>
                                        </div>
                                    )}
                                </FormSection>

                                {/* Video */}
                                <FormSection title="Video del producto">
                                    {editingProduct?.video && (
                                        <p className="text-white/30 text-xs mb-2">
                                            Video actual: <span className="text-sky-400">{editingProduct.video.split('/').pop()}</span>
                                        </p>
                                    )}
                                    {videoFile ? (
                                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                            <Film size={16} className="text-purple-400 shrink-0" />
                                            <span className="text-white/70 text-sm truncate flex-1">{videoFile.name}</span>
                                            <button onClick={() => setVideoFile(null)} className="text-white/30 hover:text-red-400 transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <FileDropZone
                                            accept="video/*" onSelect={([f]) => setVideoFile(f)}
                                            label="Video del producto" icon={Film}
                                        />
                                    )}
                                </FormSection>

                                {/* GIF */}
                                <FormSection title="GIF del producto">
                                    {editingProduct?.gif && (
                                        <p className="text-white/30 text-xs mb-2">
                                            GIF actual: <span className="text-sky-400">{editingProduct.gif.split('/').pop()}</span>
                                        </p>
                                    )}
                                    {gifFile ? (
                                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                            <ImageIcon size={16} className="text-pink-400 shrink-0" />
                                            <span className="text-white/70 text-sm truncate flex-1">{gifFile.name}</span>
                                            <button onClick={() => setGifFile(null)} className="text-white/30 hover:text-red-400 transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <FileDropZone
                                            accept="image/gif" onSelect={([f]) => setGifFile(f)}
                                            label="GIF animado del producto" icon={Upload}
                                        />
                                    )}
                                </FormSection>
                            </div>
                        )}

                        {/* Tab: Detalles */}
                        {activeTab === 'details' && (
                            <div className="space-y-6">
                                <FormSection title="Especificaciones técnicas">
                                    <ArrayField label="Especificaciones" values={form.specifications}
                                        onChange={v => arr('specifications', v)}
                                        placeholder="Ej: Dimensiones: 20,5 cm x 13,3 cm" />
                                </FormSection>
                                <FormSection title="Características">
                                    <ArrayField label="Características" values={form.characteristics}
                                        onChange={v => arr('characteristics', v)}
                                        placeholder="Ej: Motor silencioso de alta potencia" />
                                </FormSection>
                                <FormSection title="Extras">
                                    <ArrayField label="Comentarios" values={form.comments}
                                        onChange={v => arr('comments', v)}
                                        placeholder="Comentario de ejemplo" optional />
                                    <ArrayField label="Preguntas frecuentes" values={form.frequentlyQuestions}
                                        onChange={v => arr('frequentlyQuestions', v)}
                                        placeholder="¿Cómo se carga el dispositivo?" optional />
                                </FormSection>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                    {tabs.map(t => (
                                        <div key={t.id} className={`w-2 h-2 rounded-full transition-colors ${activeTab === t.id ? 'bg-sky-400' : 'bg-white/10'}`} />
                                    ))}
                                </div>
                                {uploadStep && (
                                    <span className="text-white/40 text-xs flex items-center gap-2">
                                        <div className="w-3 h-3 border border-sky-400/40 border-t-sky-400 rounded-full animate-spin" />
                                        {uploadStep}
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button onClick={resetForm}
                                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 transition-all inline-flex items-center gap-2">
                                    <X size={16} /> Cancelar
                                </button>
                                <button onClick={handleSave} disabled={saving || !isFormValid}
                                    className="px-5 py-2 rounded-xl text-white font-semibold text-sm inline-flex items-center gap-2 transition-all disabled:opacity-50"
                                    style={{ background: 'linear-gradient(to right, #10b981, #059669)' }}>
                                    {saving
                                        ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        : <Save size={16} />}
                                    {editingProduct ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Tabla ─────────────────────────────────────────────────── */}
                <div className="glass-dark rounded-2xl overflow-hidden border border-white/5">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white/5 border-b border-white/10">
                        <div className="col-span-1 text-white/40 text-xs font-bold uppercase tracking-wider">Img</div>
                        <div className="col-span-3 text-white/40 text-xs font-bold uppercase tracking-wider">Nombre</div>
                        <div className="col-span-2 text-white/40 text-xs font-bold uppercase tracking-wider">Precio</div>
                        <div className="col-span-2 text-white/40 text-xs font-bold uppercase tracking-wider">Stock</div>
                        <div className="col-span-1 text-white/40 text-xs font-bold uppercase tracking-wider">Rating</div>
                        <div className="col-span-3 text-white/40 text-xs font-bold uppercase tracking-wider text-right">Acciones</div>
                    </div>

                    {loading && (
                        <div className="flex items-center justify-center py-16 gap-3">
                            <div className="w-6 h-6 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                            <p className="text-white/40">Cargando productos...</p>
                        </div>
                    )}

                    {!loading && products.map(p => (
                        <div key={p.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center">
                            <div className="col-span-1">
                                {p.images?.[0] ? (
                                    <img src={p.images[0]} alt={p.name}
                                        className="w-10 h-10 rounded-lg object-cover bg-white/5 cursor-pointer"
                                        onClick={() => setViewingProduct(p)}
                                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                ) : (
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                        <Package size={16} className="text-white/20" />
                                    </div>
                                )}
                            </div>
                            <div className="col-span-3 min-w-0">
                                <p className="text-white font-semibold text-sm truncate">{p.name}</p>
                                <p className="text-white/30 text-xs truncate mt-0.5">{p.description}</p>
                            </div>
                            <div className="col-span-2">
                                <span className="text-emerald-400 font-bold">Bs. {p.price}</span>
                            </div>
                            <div className="col-span-2">
                                <StockBadge stock={p.stock} />
                            </div>
                            <div className="col-span-1 flex items-center gap-1">
                                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-white/60 text-sm">{p.stars}</span>
                            </div>
                            <div className="col-span-3 flex justify-end gap-2">
                                <button onClick={() => setViewingProduct(p)}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors" title="Ver detalles">
                                    <Eye size={14} />
                                </button>
                                <button onClick={() => openEditForm(p)}
                                    className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors" title="Editar">
                                    <Edit2 size={14} />
                                </button>
                                {deletingId === p.id ? (
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => handleDelete(p.id)}
                                            className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold transition-colors">
                                            Confirmar
                                        </button>
                                        <button onClick={() => setDeletingId(null)}
                                            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 text-xs transition-colors">
                                            No
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => setDeletingId(p.id)}
                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="Eliminar">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {!loading && products.length === 0 && (
                        <div className="text-center py-16">
                            <Package size={40} className="mx-auto text-white/10 mb-4" />
                            <p className="text-white/30">No hay productos registrados</p>
                        </div>
                    )}

                    {!loading && totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                            <p className="text-white/40 text-sm">Página {page} de {totalPages} — {total} registros</p>
                            <div className="flex gap-2">
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 disabled:opacity-30 transition-all">
                                    <ChevronLeft size={16} />
                                </button>
                                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 disabled:opacity-30 transition-all">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {viewingProduct && (
                <ProductDetailModal product={viewingProduct} onClose={() => setViewingProduct(null)} />
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

export default function ProductsPage() {
    return (
        <AdminLayout>
            <CartProvider>
                <ProductsContent />
            </CartProvider>
        </AdminLayout>
    );
}
