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
    <div className="space-y-2 sm:space-y-4">
      <div className="flex items-center gap-2">
        <Percent className="text-cyan-400" size={16} />
        <h3 className="text-sm sm:text-lg font-bold text-white">Descuentos por Cantidad</h3>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {discounts.map((item) => {
          const { originalTotal, savings, finalPrice } = calculatePricing(item.quantity, item.discount);
          const isSelected = selectedQuantity === item.quantity;

          return (
            <button
              key={item.quantity}
              onClick={() => onSelectQuantity(item.quantity)}
              className={`relative p-2 sm:p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
                  : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              {/* Badge de descuento */}
              {item.discount > 0 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs sm:px-2 sm:py-1">
                  -{item.discount}%
                </div>
              )}

              {/* Check de selección */}
              {isSelected && (
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-cyan-400 flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </div>
                </div>
              )}

              {/* Contenido */}
              <div className="space-y-1 sm:space-y-3">
                {/* Cantidad */}
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-3xl font-bold text-white">{item.quantity}</span>
                  <span className="text-white/60 text-[10px] sm:text-sm">
                    {item.quantity === 1 ? 'ud.' : 'uds.'}
                  </span>
                </div>

                {/* Label */}
                <div className={`text-[10px] sm:text-sm font-semibold leading-tight ${item.discount > 0 ? 'text-emerald-400' : 'text-white/70'}`}>
                  {item.label}
                </div>

                {/* Ahorro — solo en sm+ */}
                {item.discount > 0 && (
                  <div className="hidden sm:flex items-center gap-1 text-sm">
                    <Tag size={14} className="text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Ahorras Bs. {savings.toFixed(0)}</span>
                  </div>
                )}

                {/* Precio */}
                <div className="pt-1 sm:pt-2 border-t border-white/10">
                  {item.discount > 0 && (
                    <p className="text-white/40 text-[10px] sm:text-xs line-through">Bs. {originalTotal.toFixed(2)}</p>
                  )}
                  <p className="text-sm sm:text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                    Bs. {finalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
