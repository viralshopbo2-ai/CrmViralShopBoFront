'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ShoppingBag, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PixelItem {
  content_id: string;
  content_name: string;
  quantity: number;
  price: number;
}

interface OrderItem {
  producto: string;
  cantidad: number;
  precio: number;
}

interface PedidoData {
  nombre: string | null;
  items: OrderItem[];
  subtotal: number;
  descuento: number;
  total: number;
  pixelItems: PixelItem[];
}

export default function PedidoConfirmadoPage() {
  const router = useRouter();
  const [pedido, setPedido] = useState<PedidoData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('pedido_confirmado');
    if (!raw) {
      router.replace('/');
      return;
    }
    try {
      setPedido(JSON.parse(raw));
    } catch {
      router.replace('/');
    }
  }, [router]);

  const handleOk = () => {
    if (!pedido) return;

    // >>> INICIO RASTREO TIKTOK PIXEL <<<
   /* if ((window as any).ttq) {
      (window as any).ttq.track('CompletePayment', {
        contents: pedido.pixelItems.map((item) => ({
          content_id: item.content_id,
          content_type: 'product',
          content_name: item.content_name,
          quantity: item.quantity,
          price: item.price,
        })),
        value: pedido.total,
        currency: 'BOB',
      });
    }*/
    // >>> FIN RASTREO TIKTOK PIXEL <<<

    // >>> INICIO RASTREO FACEBOOK PIXEL <<<
   /* if ((window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        content_ids: pedido.pixelItems.map((i) => i.content_id),
        content_type: 'product',
        value: pedido.total,
        currency: 'BOB',
      });
    }*/
    // >>> FIN RASTREO FACEBOOK PIXEL <<<

    sessionStorage.removeItem('pedido_confirmado');
    router.push('/');
  };

  if (!pedido) return null;

  const saludo = pedido.nombre ? `¡Gracias, ${pedido.nombre}!` : '¡Gracias por tu pedido!';

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-4 sm:py-12">
      <div className="w-full max-w-md space-y-3 sm:space-y-6">

        {/* Ícono y encabezado */}
        <div className="flex flex-col items-center text-center space-y-1.5 sm:space-y-3">
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-green-500/15 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-green-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">{saludo}</h1>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Tu pedido fue recibido con éxito.<br />
            Nos comunicaremos contigo pronto para coordinar la entrega.
          </p>
        </div>

        {/* Resumen del pedido */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 sm:p-5 space-y-2 sm:space-y-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide">Tu pedido</span>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            {pedido.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-zinc-300 flex items-center gap-1">
                  <Package className="w-3 h-3 text-zinc-500 shrink-0" />
                  {item.producto} <span className="text-zinc-500">×{item.cantidad}</span>
                </span>
                <span className="text-white font-medium">
                  Bs. {(item.precio * item.cantidad).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800 pt-2 sm:pt-3 space-y-1">
            {pedido.descuento > 0 && (
              <>
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Subtotal</span>
                  <span>Bs. {pedido.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-emerald-400">
                  <span>Descuento</span>
                  <span>- Bs. {pedido.descuento.toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between font-bold text-white pt-1">
              <span>Total a pagar</span>
              <span className="text-cyan-400 text-lg">Bs. {pedido.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Nota de pago contra entrega */}
        <div className="flex items-start gap-2 sm:gap-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3">
          <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
          <p className="text-zinc-300 text-xs sm:text-sm">
            El pago se realiza <span className="text-cyan-400 font-semibold">al momento de recibir</span> tu pedido en la puerta de tu casa.
          </p>
        </div>

        {/* Botón OK */}
        <Button
          onClick={handleOk}
          className="w-full bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2.5 sm:py-3 text-sm sm:text-base rounded-xl"
        >
          Entendido, volver al inicio
        </Button>
      </div>
    </div>
  );
}
