import { Product } from './types';

export const products: Product[] = [
  {
    id: '14',
    name: 'Masajeador Muscular de Percusión Pro',
    price: 259.0,
    image: '/masajeador/masajeador_hd.jpg',
    images: [
      '/masajeador/masajeador2_.jpg',
      '/masajeador/masajeador3_.jpg',
      '/masajeador/masajeador4_.jpg',
    ],
    category: 'wellness',
    description:
      'Masajeador profesional de alto rendimiento diseñado para el alivio muscular profundo. Ideal para atletas y personas con tensión muscular.',
    rating: 4.9,
    reviews: 125,
    stock: 30,
    featured: true,
    specs: {
      Cabezales: '4 puntas intercambiables',
      Niveles: 'Ajustables (6 o 20 niveles)',
      Dimensiones: '20,5 cm x 13,3 cm',
      Carga: 'USB Recargable',
      Autonomía: '2-3 horas de uso continuo',
    },
    features: [
      'Motor silencioso de alta potencia',
      'Diseño ergonómico y ligero',
      'Batería de larga duración',
      'Fácil de transportar',
      'Alivio para contracturas y estrés',
    ],
    warranty: 'Garantía de funcionamiento por fallas de fábrica',
  },
  {
    id: '16',
    name: 'Limpia Vidrios Magnético Doble Cara Pro',
    price: 279.0,
    image: '/limpiador/limpiador2.jpg',
    images: [
      '/limpiador/limpiador5.jpg',
      '/limpiador/limpiador1.jpg',
      '/limpiador/limpiador2.jpg',
      '/limpiador/limpiador3.jpg',
      '/limpiador/limpiador4.jpg',
    ],
    category: 'home', // ✅ CORREGIDO
    description:
      '¡Limpia tus ventanas por dentro y por fuera al mismo tiempo! Este innovador limpiador magnético utiliza imanes potentes para unir ambas caras a través del vidrio.',
    rating: 4.7,
    reviews: 84,
    stock: 50,
    featured: true,
    specs: {
      Material: 'ABS de alta resistencia e imanes de neodimio',
      'Rango de grosor': 'Ideal para vidrios de 3 a 8 mm',
      Seguridad: 'Incluye cuerda anticaída de 2 metros',
      Forma: 'Triangular (facilita la limpieza en las esquinas)',
      Esponjas: 'Intercambiables y lavables',
    },
    features: [
      'Limpieza 2 en 1 simultánea',
      'Cuerda de seguridad para evitar caídas',
      'Diseño ergonómico para agarre cómodo',
      'Reduce el esfuerzo de limpieza a la mitad',
      'Materiales resistentes al agua y químicos',
    ],
    warranty: 'Garantía de funcionamiento ante defectos de fábrica',
  },
];

export const categories = [
  { id: 'electronics', name: 'Electrónica', icon: '📱' },
  { id: 'technology', name: 'Tecnología', icon: '💻' },
  { id: 'accessories', name: 'Accesorios', icon: '🎒' },
  { id: 'home', name: 'Hogar', icon: '🏠' },
  { id: 'wellness', name: 'Salud y Bienestar', icon: '🧘' },
];

// Funciones
export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.category === categoryId);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured).slice(0, 6);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  );
}