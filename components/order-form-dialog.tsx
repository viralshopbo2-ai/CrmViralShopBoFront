'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Drawer, DrawerContent, DrawerHeader,
  DrawerTitle, DrawerDescription,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/lib/toast-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2, ShoppingBag, Minus, Plus, Zap } from 'lucide-react';

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  nombre: string;
  telefono: string;
  direccion: string;
  departamento: string;
  envioPreferencial: boolean;
}

const DEPARTAMENTOS = [
  'Santa Cruz', 'La Paz', 'Cochabamba', 'Oruro', 'Potosí',
  'Tarija', 'Chuquisaca', 'Trinidad ', 'Pando',
  'Rurrenavaque', 'Riberalta', 'Guayaramerin', 'Yacuiba',
];

function calculateDiscount(quantity: number): number {
  if (quantity >= 3) return 0.20;
  if (quantity >= 2) return 0.15;
  return 0;
}

export function OrderFormDialog({ open, onOpenChange }: OrderFormDialogProps) {
  const { items, clearCart, updateQuantity } = useCart();
  const { error } = useToast();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nombre: '', telefono: '', direccion: '', departamento: '', envioPreferencial: false,
  });

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalDiscount = items.reduce((sum, item) => {
    const disc = calculateDiscount(item.quantity);
    return sum + item.product.price * item.quantity * disc;
  }, 0);
  const finalTotal = subtotal - totalDiscount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitized = name === 'telefono' ? value.replace(/\D/g, '') : value;
    setFormData((prev) => ({ ...prev, [name]: sanitized }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.telefono) { error('Por favor, ingresa tu número de teléfono'); return; }
    if (items.length === 0) { error('El carrito está vacío'); return; }

    // >>> INICIO RASTREO PIXEL CLIENTE POTENCIAL <<<
    if ((window as any).ttq) {
      (window as any).ttq.track('SubmitForm');
    }
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Lead');
    }
    // >>> FIN RASTREO PIXEL CLIENTE POTENCIAL <<<

    setIsSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        producto: item.product.name,
        cantidad: item.quantity,
        precio: item.product.price,
      }));
      const sub = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const orderData = {
        ...(formData.nombre && { nombre: formData.nombre }),
        telefono: formData.telefono,
        ...(formData.departamento && { departamento: formData.departamento }),
        ...(formData.direccion && { direccion: formData.direccion }),
        envio_preferencial: formData.envioPreferencial,
        items: orderItems,
        subtotal: sub,
        descuento: totalDiscount,
        total: finalTotal,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Error al procesar el pedido');

      clearCart();
      onOpenChange(false);

      sessionStorage.setItem('pedido_confirmado', JSON.stringify({
        nombre: formData.nombre || null,
        items: orderItems,
        subtotal: sub,
        descuento: totalDiscount,
        total: finalTotal,
        pixelItems: items.map((item) => ({
          content_id: item.product.id.toString(),
          content_name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
      }));

      router.push('/pedido-confirmado');
    } catch (err) {
      console.error('Error al enviar pedido:', err);
      error('Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
      {/* Campos */}
      <div className="space-y-2 sm:space-y-3">
        <div className="space-y-1">
          <Label htmlFor="nombre" className="text-zinc-300 text-xs sm:text-sm">Nombres</Label>
          <Input
            id="nombre" name="nombre" value={formData.nombre}
            onChange={handleInputChange} placeholder="Tu nombre"
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 h-9 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="telefono" className="text-zinc-300 text-xs sm:text-sm">
            Teléfono <span className="text-red-400">*</span>
          </Label>
          <Input
            id="telefono" name="telefono" type="tel" inputMode="numeric"
            value={formData.telefono} onChange={handleInputChange}
            placeholder="Ej: 70000000" required
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 h-9 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="departamento" className="text-zinc-300 text-xs sm:text-sm">Ciudad</Label>
          <Select value={formData.departamento} onValueChange={(v) => handleSelectChange('departamento', v)}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-9 text-sm">
              <SelectValue placeholder="Seleccionar ciudad" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              {DEPARTAMENTOS.map((dep) => (
                <SelectItem key={dep} value={dep} className="text-white hover:bg-zinc-700">{dep}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="direccion" className="text-zinc-300 text-xs sm:text-sm">Dirección</Label>
          <Input
            id="direccion" name="direccion" value={formData.direccion}
            onChange={handleInputChange} placeholder="Av. / Calle / Zona"
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 h-9 text-sm"
          />
        </div>

        {/* Envío preferencial */}
        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, envioPreferencial: !prev.envioPreferencial }))}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left ${
            formData.envioPreferencial
              ? 'border-cyan-400 bg-cyan-400/10'
              : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-500'
          }`}
        >
          <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-colors ${
            formData.envioPreferencial ? 'bg-cyan-400' : 'bg-zinc-700'
          }`}>
            <Zap size={14} className={formData.envioPreferencial ? 'text-zinc-900' : 'text-zinc-400'} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs sm:text-sm font-semibold ${formData.envioPreferencial ? 'text-cyan-400' : 'text-zinc-300'}`}>
              ¿Envío preferencial?
            </p>
            <p className="text-zinc-500 text-xs">Sin costo extra — prioridad en la entrega</p>
          </div>
          <div className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
            formData.envioPreferencial ? 'border-cyan-400 bg-cyan-400' : 'border-zinc-600'
          }`}>
            {formData.envioPreferencial && <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />}
          </div>
        </button>
      </div>

      {/* Resumen */}
      <div className="space-y-2 bg-zinc-800/50 rounded-xl p-3 border border-zinc-700">
        <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">Tu pedido</h4>
        <div className="space-y-2">
          {items.map((item) => {
            const disc = calculateDiscount(item.quantity);
            const itemTotal = item.product.price * item.quantity * (1 - disc);
            return (
              <div key={item.product.id} className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-300 text-xs sm:text-sm truncate">{item.product.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-zinc-500 text-xs">Bs. {item.product.price.toFixed(2)} c/u</span>
                    {disc > 0 && (
                      <span className="text-xs text-emerald-400 font-medium">-{(disc * 100).toFixed(0)}%</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-6 h-6 rounded-md bg-zinc-700 hover:bg-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3 h-3 text-white" />
                  </button>
                  <span className="w-5 text-center text-white text-sm font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-md bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3 h-3 text-white" />
                  </button>
                </div>
                <span className="text-white font-medium text-xs w-16 text-right shrink-0">
                  Bs. {itemTotal.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="border-t border-zinc-700 pt-2 space-y-1">
          {totalDiscount > 0 && (
            <>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-zinc-300">Bs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-emerald-400">Descuento</span>
                <span className="text-emerald-400 font-medium">- Bs. {totalDiscount.toFixed(2)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between pt-1 border-t border-zinc-700">
            <span className="text-white font-semibold text-sm">Total a Pagar</span>
            <div className="text-right">
              {totalDiscount > 0 && (
                <span className="text-xs text-zinc-500 line-through mr-1">Bs. {subtotal.toFixed(2)}</span>
              )}
              <span className="text-sm sm:text-base font-bold text-cyan-400">Bs. {finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-2 justify-end">
        <Button
          type="button" variant="outline"
          onClick={() => onOpenChange(false)}
          className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white h-9 text-sm"
        >
          Cancelar
        </Button>
        <Button
          type="submit" disabled={isSubmitting}
          className="bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold px-5 flex flex-col items-center leading-tight h-auto py-1.5"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Procesando...</>
          ) : (
            <><span className="text-sm">Pedir ahora</span><span className="text-xs font-normal opacity-90">Pagar en casa</span></>
          )}
        </Button>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-zinc-900 border-zinc-800 px-4 pb-6 max-h-[92vh] overflow-y-auto">
          <DrawerHeader className="text-left px-0 pb-2">
            <DrawerTitle className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              Completar Pedido
            </DrawerTitle>
            <DrawerDescription className="text-zinc-400 text-xs">
              Completa tus datos para procesar tu pedido
            </DrawerDescription>
          </DrawerHeader>
          {formContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-zinc-900 border-zinc-800 overflow-y-auto max-h-[90vh] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            Completar Pedido
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm">
            Completa tus datos para procesar tu pedido
          </DialogDescription>
        </DialogHeader>
        {formContent}
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
