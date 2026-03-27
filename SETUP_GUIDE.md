# 📱 Guía de Configuración - Landing Pages de Productos

Esta guía te ayudará a configurar correctamente los landing pages de productos con integración de WhatsApp.

## 🎯 Qué hemos creado

Se han creado landing pages individuales para cada producto con:
- Detalles completos del producto (especificaciones, características, garantía)
- Botón de "Pedir por WhatsApp" integrado
- Sección de testimonios de clientes
- Preguntas frecuentes
- Información de contacto
- Productos relacionados

## ⚙️ Configuración Requerida

### 1. Número de WhatsApp

Para que funcione el botón "Pedir por WhatsApp", necesitas configurar tu número de teléfono.

**Opción A: Variables de Entorno (Recomendado)**

Ve a la sección "Vars" en las configuraciones del proyecto (arriba a la derecha) y agrega:

```
NEXT_PUBLIC_WHATSAPP_NUMBER=+1234567890
```

Reemplaza `+1234567890` con tu número real incluyendo:
- `+` al inicio
- Código de país (ej: +58 para Venezuela, +34 para España)
- Número de teléfono sin espacios ni guiones

**Ejemplos:**
- Venezuela: `+584121234567`
- España: `+34612345678`
- Colombia: `+573001234567`

### 2. Información de Contacto (Opcional)

Puedes agregar más datos de contacto en las variables de entorno:

```
NEXT_PUBLIC_CONTACT_EMAIL=contacto@mitienda.com
NEXT_PUBLIC_PHONE=+1234567890
NEXT_PUBLIC_ADDRESS=Calle Principal 123, Ciudad
```

## 📍 Dónde se muestran las landing pages

- **URL de cada producto**: `/producto/[id]`
- **Ejemplos**:
  - `/producto/1` - Audífonos Inalámbricos Pro
  - `/producto/2` - Smartwatch Deportivo
  - `/producto/3` - Funda Acolchada Premium

Puedes acceder desde:
1. La página principal (clickeando en cualquier producto)
2. Directamente escribiendo la URL en la barra de direcciones

## 🎨 Personalizaciones

### Cambiar información de los productos

Todos los productos están definidos en `/lib/products.ts`. Puedes editar:
- Nombre del producto
- Precio
- Imagen
- Descripción
- Especificaciones (specs)
- Características (features)
- Garantía

### Agregar nuevos productos

1. Abre `/lib/products.ts`
2. Agrega un nuevo objeto al array `products`:

```typescript
{
  id: '13',
  name: 'Nombre del Producto',
  price: 99.99,
  image: 'URL-de-la-imagen',
  category: 'electronics', // electronics, technology, accessories, home
  description: 'Descripción corta',
  rating: 4.5,
  reviews: 100,
  stock: 50,
  featured: true,
  specs: {
    'Especificación 1': 'Valor 1',
    'Especificación 2': 'Valor 2',
  },
  features: [
    'Característica 1',
    'Característica 2',
  ],
  warranty: '1 año de garantía',
}
```

3. El nuevo producto aparecerá automáticamente en:
   - La página principal
   - Las búsquedas
   - Su propia página de detalle en `/producto/13`

## 🔧 Archivos Modificados/Creados

### Nuevos archivos:
- `/components/whatsapp-button.tsx` - Botón de WhatsApp reutilizable
- `/components/contact-section.tsx` - Sección de contacto
- `/lib/config.ts` - Configuración centralizada

### Archivos modificados:
- `/app/producto/[id]/page.tsx` - Landing page mejorada
- `/lib/products.ts` - Productos con más datos
- `/lib/types.ts` - Tipos actualizados

## 📱 Funcionamiento del Botón WhatsApp

Cuando un usuario hace click en "Pedir por WhatsApp":
1. Se abre WhatsApp (web o app móvil)
2. Se pre-llena un mensaje con:
   - Nombre del producto
   - Cantidad seleccionada
   - Precio total
3. El usuario puede enviar el mensaje directamente

## 🧪 Pruebas

1. Abre cualquier página de producto
2. Selecciona una cantidad
3. Haz click en "Pedir por WhatsApp"
4. Verifica que se abra WhatsApp con el mensaje correcto

## 📞 Soporte de Contacto

La sección de contacto muestra:
- Botón de WhatsApp (usando tu número configurado)
- Teléfono directo
- Email
- Horarios de atención

## ✨ Mejoras Futuras

Podrías considerar:
- Agregar más métodos de pago en línea
- Sistema de carrito mejorado
- Historial de órdenes
- Notificaciones por email
- Integración con proveedores de pago

---

¿Necesitas ayuda? ¡Contacta con nosotros por WhatsApp!
