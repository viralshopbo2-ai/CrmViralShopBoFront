'use client';

import { MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/config';
import Link from 'next/link';

export function ContactSection() {
  const handleWhatsAppClick = () => {
    if (CONTACT_INFO.whatsappNumber) {
      const url = `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=Hola! Me interesa en tus productos`;
      window.open(url, '_blank');
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            ¿Tienes dudas? Contacta con nosotros
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Estamos disponibles por WhatsApp, teléfono y email para ayudarte con cualquier pregunta
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* WhatsApp */}
          <div className="glass-card p-8 rounded-2xl space-y-4 text-center hover:border-emerald-400 transition-colors">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 p-4 rounded-full">
                <MessageCircle className="text-emerald-400" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white">WhatsApp</h3>
            <p className="text-white/60 text-sm">Soporte instantáneo y atención rápida</p>
            {CONTACT_INFO.whatsappNumber && (
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
              >
                Escribir por WhatsApp
              </button>
            )}
            {!CONTACT_INFO.whatsappNumber && (
              <p className="text-yellow-400 text-xs">Configura el número en las variables de entorno</p>
            )}
          </div>

          {/* Phone */}
          <div className="glass-card p-8 rounded-2xl space-y-4 text-center hover:border-blue-400 transition-colors">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 p-4 rounded-full">
                <Phone className="text-cyan-400" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white">Teléfono</h3>
            <p className="text-white/60 text-sm">Llámanos directamente</p>
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="text-cyan-400 font-semibold text-lg hover:text-cyan-300 transition-colors"
            >
              {CONTACT_INFO.phone}
            </a>
          </div>

          {/* Email */}
          <div className="glass-card p-8 rounded-2xl space-y-4 text-center hover:border-purple-400 transition-colors">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 p-4 rounded-full">
                <Mail className="text-purple-400" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white">Email</h3>
            <p className="text-white/60 text-sm">Envíanos tus consultas</p>
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="text-purple-400 font-semibold text-sm hover:text-purple-300 transition-colors break-all"
            >
              {CONTACT_INFO.email}
            </a>
          </div>

          {/* Hours */}
          <div className="glass-card p-8 rounded-2xl space-y-4 text-center hover:border-orange-400 transition-colors">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 p-4 rounded-full">
                <Clock className="text-orange-400" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white">Horarios</h3>
            <div className="space-y-1">
              <p className="text-white/60 text-xs">Lunes - Viernes</p>
              <p className="text-white font-semibold">{CONTACT_INFO.businessHours.weekday}</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="glass-dark rounded-2xl p-8 text-center max-w-2xl mx-auto space-y-4">
          <p className="text-white text-lg">
            <span className="font-semibold text-cyan-400">Recomendamos usar WhatsApp</span> para consultas y
            pedidos rápidos
          </p>
          <p className="text-white/60">
            Nuestro equipo responde en menos de una hora durante el horario de atención
          </p>
        </div>
      </div>
    </section>
  );
}
