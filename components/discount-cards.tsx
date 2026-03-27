'use client';

import { Check, Percent, Tag } from 'lucide-react';

interface DiscountCardsProps {
  price: number;
  selectedQuantity: number;
  onSelectQuantity: (quantity: number) => void;
}

export function DiscountCards({ price, selectedQuantity, onSelectQuantity }: DiscountCardsProps) {
  // Definir descuentos: 1 unidad = precio normal, 2 unidades = 15% desc, 3+ unidades = 20% desc
  const discounts = [
    {
      quantity: 1,
      discount: 0,
      label: 'Precio Normal',
    },
    {
      quantity: 2,
      discount: 15,
      label: '15% Descuento',
    },
    {
      quantity: 3,
      discount: 20,
      label: '20% Descuento',
    },
  ];

  const calculatePricing = (qty: number, discountPercent: number) => {
    const originalTotal = price * qty;
    const savings = originalTotal * (discountPercent / 100);
    const finalPrice = originalTotal - savings;
    return { originalTotal, savings, finalPrice };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Percent className="text-cyan-400" size={20} />
        <h3 className="text-lg font-bold text-white">Descuentos por Cantidad</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {discounts.map((item) => {
          const { originalTotal, savings, finalPrice } = calculatePricing(item.quantity, item.discount);
          const isSelected = selectedQuantity === item.quantity;
          
          return (
            <button
              key={item.quantity}
              onClick={() => onSelectQuantity(item.quantity)}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                isSelected 
                  ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20' 
                  : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              {/* Badge de descuento */}
              {item.discount > 0 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{item.discount}%
                </div>
              )}
              
              {/* Check de selección */}
              {isSelected && (
                <div className="absolute top-3 left-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                </div>
              )}
              
              {/* Contenido */}
              <div className="space-y-3">
                {/* Cantidad */}
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-white">{item.quantity}</span>
                  <span className="text-white/60 text-sm">
                    {item.quantity === 1 ? 'unidad' : 'unidades'}
                  </span>
                </div>
                
                {/* Label */}
                <div className={`text-sm font-semibold ${item.discount > 0 ? 'text-emerald-400' : 'text-white/70'}`}>
                  {item.label}
                </div>
                
                {/* Ahorro */}
                {item.discount > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <Tag size={14} className="text-emerald-400" />
                    <span className="text-emerald-400 font-medium">
                      Ahorras Bs. {savings.toFixed(0)}
                    </span>
                  </div>
                )}
                
                {/* Precio */}
                <div className="pt-2 border-t border-white/10">
                  {item.discount > 0 && (
                    <p className="text-white/40 text-xs line-through">
                      Bs. {originalTotal.toFixed(2)}
                    </p>
                  )}
                  <p className="text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                    Bs. {finalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Info adicional */}
      <p className="text-white/50 text-xs text-center">
        Selecciona la cantidad y obtén descuentos especiales
      </p>
    </div>
  );
}
