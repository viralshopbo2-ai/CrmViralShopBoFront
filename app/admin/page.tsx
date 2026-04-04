'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { CartProvider } from '@/lib/cart-context';
import { products as initialProducts } from '@/lib/products';
import { Product } from '@/lib/types';
import { Edit2, Trash2, Plus, ArrowLeft, Save, X } from 'lucide-react';
import Image from 'next/image';

function AdminContent() {
  const [adminProducts, setAdminProducts] = useState<Product[]>(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: '',
    description: '',
    image: '',
    rating: 0,
    reviews: 0,
    stock: 0,
    featured: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? target.checked
          : type === 'number'
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    if (editingId) {
      setAdminProducts(
        adminProducts.map((p) =>
          p.id === editingId
            ? { ...p, ...formData }
            : p
        )
      );
      setEditingId(null);
    } else {
      const newProduct: Product = {
        ...formData,
        id: Date.now().toString(),
      };
      setAdminProducts([...adminProducts, newProduct]);
    }

    resetForm();
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      image: product.image,
      rating: product.rating,
      reviews: product.reviews,
      stock: product.stock,
      featured: product.featured || false,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setAdminProducts(adminProducts.filter((p) => p.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      category: '',
      description: '',
      image: '',
      rating: 0,
      reviews: 0,
      stock: 0,
      featured: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const stats = [
    { label: 'Total Productos', value: adminProducts.length },
    { label: 'En Stock', value: adminProducts.filter(p => p.stock > 0).length },
    { label: 'Destacados', value: adminProducts.filter(p => p.featured).length },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4">
                <ArrowLeft size={20} />
                Volver a la tienda
              </Link>
              <h1 className="text-5xl font-bold text-white">Panel de Administración</h1>
              <p className="text-white/60 mt-2">Gestiona tu catálogo de productos</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/adminordenes"
                className="glass-button bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg inline-flex items-center gap-2"
              >
                Ver Órdenes
              </Link>
              <button
                onClick={() => setShowForm(!showForm)}
                className="glass-button bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-lg inline-flex items-center gap-2"
              >
                {showForm ? <X size={20} /> : <Plus size={20} />}
                {showForm ? 'Cancelar' : 'Nuevo Producto'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-dark rounded-2xl p-6">
                <p className="text-white/60 text-sm font-semibold">{stat.label}</p>
                <p className="text-4xl font-bold text-white mt-2">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          {showForm && (
            <div className="glass-dark rounded-3xl p-8 mb-8 space-y-6">
              <h2 className="text-3xl font-bold text-white">
                {editingId ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-white font-semibold mb-2">Nombre del Producto</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="glass-input"
                    placeholder="Ej: Audífonos Inalámbricos Pro"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-white font-semibold mb-2">Precio (Bs.)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="glass-input"
                    placeholder="99.99"
                    step="0.01"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-white font-semibold mb-2">Categoría</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="glass-input"
                  >
                    <option value="">Selecciona categoría</option>
                    <option value="electronics">Electrónica</option>
                    <option value="technology">Tecnología</option>
                    <option value="accessories">Accesorios</option>
                    <option value="home">Hogar</option>
                  </select>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-white font-semibold mb-2">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="glass-input"
                    placeholder="50"
                    min="0"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-white font-semibold mb-2">Calificación (0-5)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="glass-input"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>

                {/* Reviews */}
                <div>
                  <label className="block text-white font-semibold mb-2">Número de Reseñas</label>
                  <input
                    type="number"
                    name="reviews"
                    value={formData.reviews}
                    onChange={handleInputChange}
                    className="glass-input"
                    placeholder="0"
                    min="0"
                  />
                </div>

                {/* Image URL */}
                <div className="md:col-span-2">
                  <label className="block text-white font-semibold mb-2">URL de la Imagen</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="glass-input"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-white font-semibold mb-2">Descripción</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="glass-input resize-none"
                    placeholder="Describe el producto..."
                    rows={3}
                  />
                </div>

                {/* Featured */}
                <div className="flex items-center">
                  <label className="glass-card p-4 cursor-pointer inline-flex items-center gap-3 hover:shadow-lg transition-shadow">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-5 h-5"
                    />
                    <span className="text-white font-semibold">Marcar como destacado</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 justify-end">
                <button
                  onClick={resetForm}
                  className="glass-button text-white hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProduct}
                  className="glass-button bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-lg inline-flex items-center gap-2"
                >
                  <Save size={20} />
                  {editingId ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="glass-dark rounded-3xl p-8 overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Catálogo de Productos ({adminProducts.length})</h2>

            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white font-semibold">Imagen</th>
                  <th className="text-left py-4 px-4 text-white font-semibold">Nombre</th>
                  <th className="text-left py-4 px-4 text-white font-semibold">Categoría</th>
                  <th className="text-left py-4 px-4 text-white font-semibold">Precio</th>
                  <th className="text-left py-4 px-4 text-white font-semibold">Stock</th>
                  <th className="text-left py-4 px-4 text-white font-semibold">Calificación</th>
                  <th className="text-left py-4 px-4 text-white font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {adminProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden glass-card-sm">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-white font-semibold line-clamp-2">{product.name}</p>
                      {product.featured && <span className="text-xs text-yellow-400">★ Destacado</span>}
                    </td>
                    <td className="py-4 px-4 text-white/70">{product.category}</td>
                    <td className="py-4 px-4 text-white font-bold">Bs. {product.price.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 0
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {product.stock} unid.
                      </span>
                    </td>
                    <td className="py-4 px-4 text-white">
                      <div className="flex items-center gap-1">
                        <span>★</span>
                        <span className="font-semibold">{product.rating.toFixed(1)}</span>
                        <span className="text-white/60 text-xs">({product.reviews})</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="glass-card-sm p-2 hover:shadow-lg transition-all text-blue-400"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="glass-card-sm p-2 hover:shadow-lg transition-all text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {adminProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/60 text-lg">No hay productos en el catálogo</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <CartProvider>
      <AdminContent />
    </CartProvider>
  );
}
