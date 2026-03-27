# ⚡ Quick Start - Landing Pages de Productos

## 📋 Lo Esencial en 5 Minutos

### 1️⃣ Configurar WhatsApp (Obligatorio)

```
Accede a tu proyecto → Settings → Vars (arriba a la derecha)
Agrega esta variable:

NEXT_PUBLIC_WHATSAPP_NUMBER=+1234567890

Ejemplo real:
NEXT_PUBLIC_WHATSAPP_NUMBER=+584121234567
```

✅ **¡Listo! Tu tienda está lista para recibir pedidos por WhatsApp**

---

## 🎯 Cómo Funciona

### Para tus Clientes:

```
1. Abre producto → /producto/1
2. Ve todas las características
3. Selecciona cantidad
4. Haz click "Pedir por WhatsApp"
5. Se abre WhatsApp con mensaje listo
6. Completa la compra
```

### Para Ti:

```
1. Recibes mensajes en WhatsApp
2. Confirmás disponibilidad
3. Negocias detalles
4. Enviás factura/datos bancarios
5. Envías producto
```

---

## 📱 URLs de Acceso

| Página | URL |
|--------|-----|
| Inicio | `/` |
| Producto 1 | `/producto/1` |
| Producto 2 | `/producto/2` |
| Carrito | `/carrito` |

---

## 🎨 Personalizar Productos

### Editar Producto Existente

Abre `/lib/products.ts` y busca el producto:

```typescript
{
  id: '1',
  name: 'Audífonos Inalámbricos Pro',
  price: 89.99,
  // ... resto de datos
}
```

Cambia lo que quieras y guarda.

### Agregar Producto Nuevo

En `/lib/products.ts`, agrega al final del array:

```typescript
{
  id: '13',
  name: 'Mi Nuevo Producto',
  price: 99.99,
  image: 'https://imagen.com/producto.jpg',
  category: 'electronics', // o technology, accessories, home
  description: 'Descripción corta',
  rating: 4.5,
  reviews: 50,
  stock: 20,
  featured: false,
  specs: {
    'Especificación': 'Valor',
  },
  features: [
    'Característica 1',
    'Característica 2',
  ],
  warranty: '1 año',
}
```

¡Automáticamente aparecerá en `/producto/13`! 🎉

---

## 🔧 Variables de Entorno

### Requeridas:
```
NEXT_PUBLIC_WHATSAPP_NUMBER=+1234567890
```

### Opcionales:
```
NEXT_PUBLIC_CONTACT_EMAIL=contacto@mitienda.com
NEXT_PUBLIC_PHONE=+1234567890
NEXT_PUBLIC_ADDRESS=Tu dirección
```

---

## ✨ Lo que Incluye Cada Landing Page

- ✅ Imagen del producto
- ✅ Nombre y categoría
- ✅ Precio y stock
- ✅ Descripción
- ✅ Especificaciones técnicas
- ✅ Características principales
- ✅ Información de garantía
- ✅ Botón "Pedir por WhatsApp"
- ✅ Botón "Agregar al Carrito"
- ✅ Testimonios de clientes
- ✅ Preguntas frecuentes
- ✅ Productos relacionados

---

## 📞 Sección de Contacto

En la página principal hay una sección con:

- 🟢 Botón WhatsApp (usa tu número configurado)
- ☎️ Teléfono directo
- 📧 Email
- 🕐 Horarios de atención

---

## 🎁 Ejemplos de Productos

| ID | Producto | Precio |
|----|----------|--------|
| 1 | Audífonos Inalámbricos Pro | Bs. 89.99 |
| 2 | Smartwatch Deportivo | Bs. 199.99 |
| 3 | Funda Acolchada Premium | Bs. 24.99 |
| 4 | Cable USB-C Premium | Bs. 19.99 |
| 5 | Lámpara LED Inteligente | Bs. 49.99 |
| 6 | Mochila Profesional | Bs. 59.99 |
| 7 | Ventilador Portátil | Bs. 34.99 |
| 8 | Power Bank 20000mAh | Bs. 44.99 |
| 9 | Organizador de Escritorio | Bs. 29.99 |
| 10 | Webcam HD 1080p | Bs. 79.99 |
| 11 | Teclado Mecánico RGB | Bs. 99.99 |
| 12 | Mouse Inalámbrico Pro | Bs. 39.99 |

---

## 🚀 Próximas Acciones

1. **Configura tu número de WhatsApp** ← ¡Hazlo ahora!
2. Personaliza los productos
3. ¡Comienza a vender!

---

## ❓ Necesitas Ayuda?

- 📖 Lee `SETUP_GUIDE.md` para instrucciones detalladas
- 📱 Consulta `WHATSAPP_SETUP.md` para configuración avanzada

---

**¡Tu tienda online está lista! 🎉**

Ahora solo configura tu número de WhatsApp y comienza a vender.
