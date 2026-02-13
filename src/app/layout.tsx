import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import GoogleAnalytics from "../components/GoogleAnalytics";

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
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22white%22/><text x=%2250%22 y=%2275%22 font-family=%22serif%22 font-weight=%22bold%22 font-size=%2270%22 fill=%22%23FFD700%22 text-anchor=%22middle%22>R</text></svg>",
  },
  openGraph: {
    title: "RIO COLOMBIA | Bisutería Fina",
    description: "Piezas exclusivas que conectan con tu historia.",
    url: "https://riocolombia.com", // Recuerda cambiar esto cuando tengas el link de Vercel
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
