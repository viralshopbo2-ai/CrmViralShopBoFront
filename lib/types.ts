export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[]; // Array de imágenes adicionales del producto
  category: 'electronics' | 'home' | 'accessories' | 'technology' | 'wellness';
  rating: number;
  reviews: number;
  stock: number;
  featured?: boolean;
  specs?: Record<string, string>;
  features?: string[];
  warranty?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  shippingMethod: 'standard' | 'express';
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}
