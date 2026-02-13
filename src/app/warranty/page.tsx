"use client";

import React from "react";
import {
  ShieldCheck,
  Sparkles,
  Droplets,
  Wind,
  ArrowLeft,
  LucideProps,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Footer from "../../components/Footer";

// Definimos el tipo para nuestros items de cuidado
interface CareItem {
  Icon: React.ComponentType<LucideProps>;
  text: string;
}

export default function WarrantyPage() {
  const careRitual: CareItem[] = [
    {
      Icon: Droplets,
      text: "Evita el contacto con perfumes, alcohol o agua salada para preservar el baño de oro.",
    },
    {
      Icon: Sparkles,
      text: "Limpia tu pieza con un paño de microfibra seco después de cada uso para remover impurezas.",
    },
    {
      Icon: Wind,
      text: "Guarda cada accesorio en su bolsa original para evitar roces y la oxidación natural.",
    },
  ];

  return (
    <main className="relative min-h-screen bg-[#FCFCFA] antialiased">
      {/* IMAGEN DE FONDO HERO */}
      <div className="absolute top-0 left-0 w-full h-[60vh] z-0 overflow-hidden">
        <Image
          src="/rio-insta-3.jpg"
          alt="RIO Luxury Background"
          fill
          priority
          className="object-cover scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#FCFCFA]" />
      </div>

      <div className="relative z-10 pt-16 px-6">
        <div className="container mx-auto max-w-4xl">
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
            <h1 className="font-serif text-5xl md:text-7xl text-white tracking-tighter leading-tight">
              Promesa de <span className="italic uppercase">Calidad</span>
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-8 bg-[#D4AF37]/50" />
              <p className="text-[#D4AF37] uppercase tracking-[0.5em] text-[10px] font-black">
                Cuidado y Respaldo RIO
              </p>
              <div className="h-px w-8 bg-[#D4AF37]/50" />
            </div>
          </div>

          {/* SECCIÓN GARANTÍA */}
          <div className="bg-white border-t-[6px] border-[#D4AF37] p-10 md:p-16 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 mb-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            <div className="w-20 h-20 bg-[#F9F8F6] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <ShieldCheck className="text-[#D4AF37]" size={40} />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl mb-6 text-gray-900 font-bold tracking-tight">
              Compromiso de Garantía
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed text-lg">
              Todas nuestras piezas cuentan con una garantía de{" "}
              <span className="text-gray-900 font-bold border-b-2 border-[#D4AF37]/30">
                5 días calendario
              </span>{" "}
              contra defectos de fabricación. Nos comprometemos a que tu brillo
              nunca se apague.
            </p>
          </div>

          {/* SECCIÓN CUIDADOS */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch mb-20">
            {/* RITUAL DE CUIDADO */}
            <div className="bg-[#2D2926] p-10 md:p-12 rounded-[2.5rem] text-white space-y-8 shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
              <h2 className="font-serif text-3xl text-[#D4AF37] font-medium tracking-tight">
                Metodo de Cuidado
              </h2>

              <div className="space-y-10">
                {careRitual.map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start group/item">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover/item:border-[#D4AF37]/50 group-hover/item:bg-[#D4AF37]/10 transition-all duration-500">
                      {/* Renderizado directo del componente sin cloneElement */}
                      <item.Icon className="text-[#D4AF37]" size={22} />
                    </div>
                    <p className="text-[14px] text-gray-300 leading-relaxed font-medium pt-1">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* IMAGEN DE SOPORTE */}
            <div className="relative rounded-[2.5rem] overflow-hidden min-h-[450px] shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both group">
              <Image
                src="/limpieza.jpg"
                alt="Cuidados de joyería RIO"
                fill
                className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
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
