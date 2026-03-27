'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/lib/toast-context';
import { Loader2, ShoppingBag, CheckCircle } from 'lucide-react';

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  numero: string;
  departamento: string;
  provincia: string;
  municipio: string;
  referencia: string;
}

const DEPARTAMENTOS = [
  'Santa Cruz',
  'La Paz',
  'Cochabamba',
  'Oruro',
  'Potosí',
  'Tarija',
  'Chuquisaca',
  'Beni',
  'Pando',
];

export function OrderFormDialog({ open, onOpenChange }: OrderFormDialogProps) {
  const { items, total, clearCart } = useCart();
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    numero: '',
    departamento: '',
    provincia: '',
    municipio: '',
    referencia: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.nombre || !formData.apellido || !formData.telefono || !formData.direccion) {
      error('Por favor, completa todos los campos obligatorios');
      return;
    }

    if (items.length === 0) {
      error('El carrito está vacío');
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar los items en el formato esperado por la API
      const orderItems = items.map((item) => ({
        producto: item.product.name,
        cantidad: item.quantity,
        precio: item.product.price,
      }));

      // Calcular subtotal
      const subtotal = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      // Crear el body de la petición
      const orderData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        direccion: formData.direccion,
        numero: formData.numero,
        departamento: formData.departamento,
        provincia: formData.provincia,
        municipio: formData.municipio,
        referencia: formData.referencia,
        items: orderItems,
        subtotal: subtotal,
        total: total,
      };

      const response = await fetch('http://apiviralstore.viralshopbo.com/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Error al procesar el pedido');
      }

      // Mostrar éxito
      setIsSuccess(true);
      success('Pedido enviado correctamente');
      clearCart();

      // Cerrar el dialog después de 3 segundos
      setTimeout(() => {
        setIsSuccess(false);
        onOpenChange(false);
        // Resetear el formulario
        setFormData({
          nombre: '',
          apellido: '',
          telefono: '',
          direccion: '',
          numero: '',
          departamento: '',
          provincia: '',
          municipio: '',
          referencia: '',
        });
      }, 3000);
    } catch (err) {
      console.error('Error al enviar pedido:', err);
      error('Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Pedido Enviado</h3>
            <p className="text-zinc-400 text-center">
              Tu pedido ha sido recibido correctamente. Nos pondremos en contacto contigo pronto.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-zinc-900 border-zinc-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            Completar Pedido
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Completa tus datos para procesar tu pedido
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos Personales */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide">
              Datos Personales
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-zinc-300">
                  Nombre <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido" className="text-zinc-300">
                  Apellido <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="Tu apellido"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-zinc-300">
                Teléfono <span className="text-red-400">*</span>
              </Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="Ej: 70000000"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                required
              />
            </div>
          </div>

          {/* Dirección de Envío */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide">
              Dirección de Envío
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departamento" className="text-zinc-300">
                  Departamento
                </Label>
                <Select
                  value={formData.departamento}
                  onValueChange={(value) => handleSelectChange('departamento', value)}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {DEPARTAMENTOS.map((dep) => (
                      <SelectItem key={dep} value={dep} className="text-white hover:bg-zinc-700">
                        {dep}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="provincia" className="text-zinc-300">
                  Provincia
                </Label>
                <Input
                  id="provincia"
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleInputChange}
                  placeholder="Tu provincia"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="municipio" className="text-zinc-300">
                  Municipio
                </Label>
                <Input
                  id="municipio"
                  name="municipio"
                  value={formData.municipio}
                  onChange={handleInputChange}
                  placeholder="Tu municipio"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-3 space-y-2">
                <Label htmlFor="direccion" className="text-zinc-300">
                  Dirección <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  placeholder="Av. / Calle / Zona"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero" className="text-zinc-300">
                  Número
                </Label>
                <Input
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  placeholder="123"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="referencia" className="text-zinc-300">
                Referencia
              </Label>
              <Textarea
                id="referencia"
                name="referencia"
                value={formData.referencia}
                onChange={handleInputChange}
                placeholder="Ej: Casa azul con portón negro, cerca de..."
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 resize-none"
                rows={2}
              />
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="space-y-3 bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
            <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide">
              Resumen del Pedido
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-zinc-300">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="text-white font-medium">
                    Bs. {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-700 pt-2 flex justify-between">
              <span className="text-white font-semibold">Total</span>
              <span className="text-lg font-bold text-cyan-400">
                Bs. {total.toFixed(2)}
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Confirmar Pedido'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
