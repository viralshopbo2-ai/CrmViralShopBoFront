import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ToastProvider } from '@/lib/toast-context'
import Script from 'next/script'
import './globals.css'
import './globals-custom.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Viral Shop Bo',
  description: 'La mejor tienda online de artículos con envío a domicilio. Electrónica, accesorios, hogar y más.',
  generator: 'v0.app',
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
  keywords: ['dropshipping', 'tienda online', 'envío domicilio', 'compras online'],
  openGraph: {
    title: 'Viral Shop Bo - Tienda de Dropshipping',
    description: 'Artículos premium con envío rápido a domicilio',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#5533FF',
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="es">
      <head>
        {/* Parte del Código Base: Noscript (se ejecuta si el usuario no tiene JS) */}
        <noscript>
          <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=1625870901965014&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body className="font-sans antialiased bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-foreground">
      {/* Parte del Código Base: Script principal con estrategia optimizada */}
      <Script id="fb-pixel" strategy="afterInteractive">
        {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1625870901965014');
            fbq('track', 'PageView');
          `}
      </Script>

      <ToastProvider>
        {children}
      </ToastProvider>
      <Analytics />
      </body>
      </html>
  )
}