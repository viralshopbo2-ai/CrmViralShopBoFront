import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ToastProvider } from '@/lib/toast-context'
import './globals.css'
import './globals-custom.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Viral Shop Bo',
  description: 'La mejor tienda online de artículos con envío a domicilio. Electrónica, accesorios, hogar y más.',
  generator: 'v0.app',
  
    themeColor: '#5533FF',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  keywords: ['dropshipping', 'tienda online', 'envío domicilio', 'compras online'],
  openGraph: {
    title: 'Viral Shop Bo - Tienda de Dropshipping',
    description: 'Artículos premium con envío rápido a domicilio',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-foreground">
        <ToastProvider>
          {children}
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  )
}
