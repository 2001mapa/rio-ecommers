"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "../../components/Footer";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-[#FCFCFA] overflow-hidden">
      {/* IMAGEN DE FONDO (Mitad Superior) - OPTIMIZADA */}
      <div className="absolute top-0 left-0 w-full h-[55vh] z-0 animate-in fade-in duration-1000 zoom-in-105">
        <Image
          src="/images/carousel/Slide-1.png"
          alt="RIO Background - Bisutería Fina"
          fill
          priority // Carga inmediata para evitar el flash en blanco
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#FCFCFA]" />
      </div>

      <div className="relative z-10 pt-20 px-6">
        <div className="container mx-auto max-w-5xl">
          {/* BOTÓN VOLVER AL HOME */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-[#FFD700] transition-colors mb-12 group animate-in fade-in slide-in-from-left-4 duration-700"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span className="text-xs uppercase tracking-[0.2em] font-bold">
              Volver al inicio
            </span>
          </Link>

          {/* TÍTULO PRINCIPAL */}
          <div className="text-center mb-24 space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <h1 className="font-serif text-5xl md:text-6xl text-white drop-shadow-lg tracking-tight">
              Nuestra Esencia
            </h1>
            <p className="text-[#FFD700] uppercase tracking-[0.4em] text-xs font-bold drop-shadow-md">
              El alma detrás de RIO
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* LADO IZQUIERDO: TEXTO */}
            <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300 fill-mode-both">
              <div className="space-y-4">
                <h2 className="text-[#FFD700] text-xs font-black uppercase tracking-[0.3em]">
                  Legado & Estilo
                </h2>
                <h1 className="font-serif text-5xl md:text-6xl text-gray-900 leading-tight">
                  Nuestra <br /> Historia
                </h1>
              </div>
              <div className="prose prose-gray prose-lg">
                <p className="text-gray-600 leading-relaxed italic text-xl border-l-4 border-[#FFD700] pl-6 py-2">
                  "En RIO, cada pieza es un poema visual diseñado para
                  perdurar."
                </p>
                <p className="text-gray-500 pt-4">
                  Nacimos de la pasión por los detalles que brillan con luz
                  propia. Nuestra misión es conectar la elegancia clásica con el
                  espíritu contemporáneo, ofreciendo accesorios que no solo
                  adornan, sino que cuentan quién eres.
                </p>
              </div>
            </div>

            {/* LADO DERECHO*/}
            <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-500 fill-mode-both">
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-[#FFD700] rounded-2xl z-0 transition-transform duration-1000 group-hover:translate-x-2 group-hover:translate-y-2" />
              <div className="relative h-[550px] w-full rounded-2xl overflow-hidden shadow-2xl z-10 group">
                <Image
                  src="/images/carousel/Slide-3.png"
                  alt="Colección de Bisutería RIO"
                  fill
                  className="object-cover transition-transform duration-[2000ms] hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-20 mt-32">
        <Footer />
      </div>
    </main>
  );
}
