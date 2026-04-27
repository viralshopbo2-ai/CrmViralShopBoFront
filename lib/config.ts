// API Backend
export const API_BASE_URL = process.env.API_BASE_URL || 'https://apiviralstore.viralshopbo.com';

// WhatsApp Configuration
// Actualiza el número de teléfono con tu número de WhatsApp
// Formato: +1234567890 (incluir el código de país)
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

// Información de contacto
export const CONTACT_INFO = {
  whatsappNumber: WHATSAPP_NUMBER,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@example.com',
  phone: process.env.NEXT_PUBLIC_PHONE || '+1234567890',
  address: process.env.NEXT_PUBLIC_ADDRESS || 'Tu dirección aquí',
  businessHours: {
    weekday: '9:00 AM - 6:00 PM',
    weekend: '10:00 AM - 4:00 PM',
  },
};

// Mensajes predeterminados
export const WHATSAPP_MESSAGES = {
  default: 'Hola! Me interesa en tu producto',
  inquiry: 'Hola! Quería hacer una consulta sobre un producto',
  support: 'Hola! Necesito soporte con mi pedido',
};
