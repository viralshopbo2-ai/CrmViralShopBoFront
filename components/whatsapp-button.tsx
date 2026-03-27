'use client';

import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/config';
import { useToast } from '@/lib/toast-context';
import React from 'react';

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  variant?: 'default' | 'floating' | 'inline';
}

export function WhatsAppButton({
  message = 'Hola! Me interesa en tu producto',
  className = '',
  variant = 'default',
}: WhatsAppButtonProps) {
  const { error } = useToast();

  const handleWhatsApp = () => {
    const whatsappMessage = encodeURIComponent(message);
    const phone = CONTACT_INFO.whatsappNumber;
    
    if (!phone) {
      error('Por favor, configura tu número de WhatsApp en las variables de entorno (NEXT_PUBLIC_WHATSAPP_NUMBER)');
      return;
    }
    
    const whatsappURL = `https://wa.me/${phone}?text=${whatsappMessage}`;
    window.open(whatsappURL, '_blank');
  };

  if (variant === 'floating') {
    return (
      <button
        onClick={handleWhatsApp}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full p-4 shadow-lg hover:shadow-2xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-110 flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={handleWhatsApp}
        className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:from-green-600 hover:to-emerald-700 py-2 px-4 text-sm font-semibold inline-flex items-center justify-center gap-2 rounded-lg transition-all ${className}`}
      >
        <MessageCircle size={16} />
        WhatsApp
      </button>
    );
  }

  return (
    <button
      onClick={handleWhatsApp}
      className={`w-full glass-button bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:from-green-600 hover:to-emerald-700 py-4 text-lg font-semibold inline-flex items-center justify-center gap-2 transition-all ${className}`}
    >
      <MessageCircle size={24} />
      Pedir por WhatsApp
    </button>
  );
}
