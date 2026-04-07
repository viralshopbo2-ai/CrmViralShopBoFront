'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { OrderFormDialog } from './order-form-dialog';
import { useCart } from '@/lib/cart-context';
import { Product } from '@/lib/types';
import * as fbq from '@/lib/fpixel'; // 1. IMPORTAMOS LA UTILIDAD

interface BuyNowButtonProps {
    product?: Product;
    quantity?: number;
    className?: string;
    variant?: 'default' | 'inline';
}

export function BuyNowButton({
                                 product,
                                 quantity = 1,
                                 className = '',
                                 variant = 'default',
                             }: BuyNowButtonProps) {
    const [open, setOpen] = useState(false);
    const { addToCart, items } = useCart();

    const handleBuyNow = () => {
        // 2. DISPARAR EVENTO DE FACEBOOK PIXEL
        if (product) {
            fbq.event('InitiateCheckout', {
                content_name: product.name,
                content_ids: [product.id],
                content_type: 'product',
                value: product.price * quantity,
                currency: 'BOB', // Moneda de Bolivia
                num_items: quantity
            });
        }

        // Si hay un producto específico, agregarlo al carrito primero
        if (product && !items.find(item => item.product.id === product.id)) {
            addToCart(product, quantity);
        }
        setOpen(true);
    };

    if (variant === 'inline') {
        return (
            <>
                <button
                    onClick={handleBuyNow}
                    className={`bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:from-cyan-600 hover:to-blue-600 py-2 px-4 text-sm font-semibold inline-flex items-center justify-center gap-2 rounded-lg transition-all ${className}`}
                >
                    <ShoppingBag size={16} />
                    Comprar
                </button>
                <OrderFormDialog open={open} onOpenChange={setOpen} />
            </>
        );
    }

    return (
        <>
            <button
                onClick={handleBuyNow}
                className={`w-full cta-buy-button text-white py-5 text-xl font-extrabold inline-flex items-center justify-center gap-3 rounded-2xl ${className}`}
            >
                <ShoppingBag size={28} className="drop-shadow-lg" />
                <span className="drop-shadow-lg uppercase tracking-wide">Comprarlo Ahora</span>
            </button>
            <OrderFormDialog open={open} onOpenChange={setOpen} />
        </>
    );
}