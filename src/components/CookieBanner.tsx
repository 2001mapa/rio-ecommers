"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Cookie, X } from "lucide-react";
import Link from "next/link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificamos si ya existe el consentimiento
    const consent = localStorage.getItem("rio_cookie_consent");
    if (!consent) {
      // Delay de 2 segundos para no interrumpir la carga inicial
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem("rio_cookie_consent", "true");
  }, []);

  const handleDecline = useCallback(() => {
    setIsVisible(false);
    // Podrías guardar "false" si quieres trackear rechazos
    localStorage.setItem("rio_cookie_consent", "false");
  }, []);

  if (!isVisible) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-4 left-4 right-4 md:left-8 md:bottom-8 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-1000 ease-out"
    >
      {/* Contenedor Principal: Cristalino y Premium */}
      <div className="mx-auto max-w-5xl bg-white/90 backdrop-blur-xl text-gray-800 p-5 md:p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#D4AF37]/20 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Sección de Texto e Icono */}
        <div className="flex items-center md:items-start gap-5 flex-1 text-center md:text-left">
          <div className="hidden sm:flex p-4 bg-[#F9F8F6] rounded-2xl text-[#D4AF37] shrink-0 border border-[#D4AF37]/10 relative group">
            <Cookie
              size={28}
              className="group-hover:rotate-12 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-2xl animate-pulse" />
          </div>

          <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">
              Experiencia Personalizada
            </h4>
            <h3 className="text-sm font-serif font-bold text-gray-900 leading-tight">
              Tu Privacidad es <span className="italic italic">Esencial</span>
            </h3>
            <p className="text-[11px] text-gray-500 leading-relaxed max-w-xl">
              En RIO utilizamos cookies para entender cómo interactúas con
              nuestra boutique y ofrecerte un servicio impecable. Al continuar,
              aceptas nuestra{" "}
              <Link
                href="/privacy"
                className="font-bold text-gray-900 underline decoration-[#D4AF37]/40 hover:text-[#D4AF37] transition-colors"
              >
                Política de Privacidad
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
          <button
            onClick={handleDecline}
            className="w-full sm:w-auto py-3 px-8 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all"
          >
            Solo Necesarias
          </button>

          <button
            onClick={handleAccept}
            className="w-full sm:w-auto py-3.5 px-10 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-all shadow-xl shadow-black/10 active:scale-95 whitespace-nowrap"
          >
            Aceptar Todo
          </button>
        </div>

        {/* Botón Cerrar (X) rápido */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-900 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
