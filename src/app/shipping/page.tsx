"use client";

import { useState, useMemo } from "react";
import {
  Truck,
  ChevronDown,
  ExternalLink,
  PackageCheck,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Footer from "../../components/Footer";

export default function ShippingPage() {
  const [showTracking, setShowTracking] = useState(false);

  const trackingLinks = useMemo(
    () => [
      {
        name: "Servientrega",
        url: "https://www.servientrega.com/wps/portal/Colombia/transaccional/rastreo-envios",
      },
      {
        name: "Interrapidisimo",
        url: "https://www.interrapidisimo.com/sigue-tu-envio/",
      },
      { name: "Envia", url: "https://envia.co/" },
      {
        name: "Coordinadora",
        url: "https://www.coordinadora.com/rastreo/rastreo-de-guia/",
      },
    ],
    [],
  );

  const cardClasses = `
    p-10 border transition-all duration-700 rounded-[2rem] shadow-sm 
    hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.01]
    bg-white/95 backdrop-blur-xl items-start flex flex-col h-full
    group animate-in fade-in slide-in-from-bottom-10 fill-mode-both
  `;

  return (
    <main className="relative min-h-screen bg-[#FCFCFA] antialiased">
      {/* IMAGEN DE FONDO CON OVERLAY OPTIMIZADO */}
      <div className="absolute top-0 left-0 w-full h-[65vh] z-0 overflow-hidden">
        <Image
          src="/rio-insta-1.jpg"
          alt="Logística RIO"
          fill
          priority
          className="object-cover scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#FCFCFA]" />
      </div>

      <div className="relative z-10 pt-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* BOTÓN VOLVER */}
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-white/70 hover:text-[#D4AF37] transition-all mb-16 group animate-in fade-in slide-in-from-left-4 duration-1000"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 group-hover:border-[#D4AF37]/50 transition-colors">
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-1"
              />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-black">
              Volver al inicio
            </span>
          </Link>

          {/* TÍTULO HERO */}
          <div className="text-center mb-24 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="font-serif text-5xl md:text-7xl text-white tracking-tighter leading-none">
              Logística de <span className="italic">Guante Blanco</span>
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-8 bg-[#D4AF37]/50" />
              <p className="text-[#D4AF37] uppercase tracking-[0.5em] text-[10px] font-black">
                Excelencia en cada entrega
              </p>
              <div className="h-px w-8 bg-[#D4AF37]/50" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch mb-20">
            {/* TARJETA 1: CURADURÍA */}
            <div
              className={`${cardClasses} border-gray-100 duration-1000 delay-150`}
            >
              <div className="w-16 h-16 bg-[#F9F8F6] rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:bg-[#D4AF37] group-hover:rotate-6">
                <PackageCheck
                  className="text-[#D4AF37] group-hover:text-white transition-colors"
                  size={30}
                />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-gray-900 font-bold tracking-tight">
                Curaduría
              </h3>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-8 font-medium">
                Cada pieza es sometida a una inspección rigurosa y empacada bajo
                estándares de alta joyería para asegurar una experiencia
                inolvidable.
              </p>

              {showTracking && (
                <div className="mt-auto w-full h-44 relative rounded-2xl overflow-hidden shadow-inner animate-in zoom-in-95 duration-700">
                  <Image
                    src="/images/logistica/empaque.jpg"
                    alt="Packing"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* TARJETA 2: RASTREO */}
            <div
              className={`${cardClasses} duration-1000 delay-300 ${showTracking ? "border-[#D4AF37] ring-1 ring-[#D4AF37]/20 shadow-xl" : "border-gray-100"}`}
            >
              <div className="w-16 h-16 bg-[#F9F8F6] rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:bg-[#D4AF37] group-hover:-rotate-6">
                <Truck
                  className="text-[#D4AF37] group-hover:text-white transition-colors"
                  size={30}
                />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-gray-900 font-bold tracking-tight">
                Tránsito Seguro
              </h3>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-8 font-medium">
                Alianzas estratégicas con las transportadoras líderes para
                garantizar puntualidad y seguridad total en su inversión.
              </p>

              <button
                onClick={() => setShowTracking(!showTracking)}
                className="mt-auto flex items-center justify-between w-full px-6 py-4 rounded-full border-2 border-gray-900 text-gray-900 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all duration-500"
              >
                {showTracking ? "Ocultar portales" : "Rastrear pedido"}
                <ChevronDown
                  className={`transition-transform duration-700 ${showTracking ? "rotate-180" : ""}`}
                  size={16}
                />
              </button>

              {showTracking && (
                <div className="mt-6 w-full space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                  {trackingLinks.map((link, index) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-xl bg-[#F9F8F6] hover:bg-white hover:shadow-md text-gray-700 text-[11px] font-bold transition-all border border-transparent hover:border-gray-100 group/link"
                      style={{ animationDelay: `${index * 75}ms` }}
                    >
                      <span className="tracking-wide">{link.name}</span>
                      <ExternalLink
                        size={14}
                        className="text-gray-300 group-hover/link:text-[#D4AF37] transition-colors"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* TARJETA 3: DESTINO */}
            <div
              className={`${cardClasses} border-gray-100 duration-1000 delay-500`}
            >
              <div className="w-16 h-16 bg-[#F9F8F6] rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:bg-[#D4AF37] group-hover:rotate-6">
                <MapPin
                  className="text-[#D4AF37] group-hover:text-white transition-colors"
                  size={30}
                />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-gray-900 font-bold tracking-tight">
                Destino Final
              </h3>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-8 font-medium">
                Entrega puerta a puerta en todo el territorio colombiano en un
                lapso de 3 a 5 días hábiles, con notificación en tiempo real.
              </p>

              {showTracking && (
                <div className="mt-auto w-full h-44 relative rounded-2xl overflow-hidden shadow-inner animate-in zoom-in-95 duration-700">
                  <Image
                    src="/images/logistica/entrega.jpg"
                    alt="Delivery"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-20">
        <Footer />
      </div>

      <style jsx global>{`
        @keyframes slow-zoom {
          from {
            transform: scale(1.05);
          }
          to {
            transform: scale(1.15);
          }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite alternate ease-in-out;
        }
      `}</style>
    </main>
  );
}
