import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import GoogleAnalytics from "../components/GoogleAnalytics";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "RIO COLOMBIA | Bisutería Fina & Accesorios de Moda",
  description:
    "Venta mayorista de bisutería fina y accesorios de alta calidad en Colombia. Piezas exclusivas y atemporales para elevar tu estilo cotidiano.",
  keywords: [
    "bisutería fina colombia",
    "accesorios de moda",
    "bisutería mayorista",
    "joyas atemporales",
    "RIO",
  ],
  icons: {
    // Corregido: url y href ahora apuntan al mismo archivo y usamos v=10 para forzar el cambio
    icon: [
      {
        url: "/favicon.png?v=10",
        href: "/favicon.png?v=10",
      },
    ],
    shortcut: ["/favicon.png?v=10"],
    apple: ["/favicon.png?v=10"],
  },
  openGraph: {
    title: "RIO COLOMBIA | Bisutería Fina",
    description: "Piezas exclusivas que conectan con tu historia.",
    url: "https://riocolombia.com",
    siteName: "RIO COLOMBIA",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* Meta Pixel (Facebook Ads Retargeting) */}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
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
      fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}'); 
      fbq('track', 'PageView');
    `}
          </Script>
        )}
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans bg-white antialiased`}
      >
        {/* Renderizamos el contenido principal primero */}
        {children}

        {/* Analytics se carga después para no bloquear la visualización inicial */}
        <GoogleAnalytics />

        {/* Notificaciones elegantes */}
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}
