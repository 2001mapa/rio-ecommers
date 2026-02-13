"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Mail, Loader2, CheckCircle, User, Sparkles } from "lucide-react";
import { createClient } from "../lib/supabase";
import { toast } from "sonner";

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const hasSeenNewsletter = localStorage.getItem("rio_newsletter_seen");

    if (!hasSeenNewsletter) {
      // Aparece a los 4 segundos para no ser intrusivo al inicio
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem("rio_newsletter_seen", "true");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setLoading(true);

    try {
      const { error } = await supabase.from("newsletter").insert({
        email,
        name,
      });

      if (error) throw error;

      setSuccess(true);
      toast.success(`¡Bienvenido a RIO, ${name}!`);

      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al registrarte. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-500">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] md:grid md:grid-cols-2">
        {/* BOTÓN CERRAR */}
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 z-20 rounded-full bg-white/90 p-2 text-gray-400 hover:text-black transition-all shadow-sm active:scale-90"
        >
          <X size={18} />
        </button>

        {/* IMAGEN IZQUIERDA: Estilo Editorial */}
        <div className="hidden md:block relative h-full bg-[#F9F8F6]">
          <img
            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop"
            alt="RIO Exclusive"
            className="absolute inset-0 h-full w-full object-cover grayscale-[20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">
              Boutique RIO
            </p>
            <p className="font-serif text-xl italic">Elegancia Atemporal</p>
          </div>
        </div>

        {/* CONTENIDO DERECHA */}
        <div className="flex flex-col justify-center p-8 md:p-12 text-center md:text-left bg-white">
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in duration-500">
              <div className="p-4 bg-green-50 rounded-full mb-6">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="font-serif text-2xl text-gray-900 mb-2 italic">
                Bienvenido a la Familia
              </h3>
              <p className="text-gray-500 text-sm">
                Tu acceso exclusivo ha sido confirmado.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <Sparkles size={14} className="text-[#D4AF37]" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">
                  Acceso Exclusivo
                </p>
              </div>

              <h2 className="mb-4 font-serif text-3xl text-gray-900 leading-tight">
                Únete a nuestra <br />
                <span className="italic">Lista Privada</span>
              </h2>

              <p className="mb-8 text-sm text-gray-500 leading-relaxed font-medium">
                Sé el primero en descubrir nuevas colecciones, piezas de edición
                limitada y eventos privados de RIO Colombia.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* INPUT NOMBRE */}
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
                  <input
                    type="text"
                    placeholder="Tu nombre completo"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3.5 pl-12 pr-4 text-xs font-bold uppercase tracking-widest text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#D4AF37]/50 focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/5 transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* INPUT EMAIL */}
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
                  <input
                    type="email"
                    placeholder="Email personal"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3.5 pl-12 pr-4 text-xs font-bold uppercase tracking-widest text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#D4AF37]/50 focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/5 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-black py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-[#D4AF37] transition-all duration-500 shadow-xl shadow-black/10 active:scale-[0.98] disabled:bg-gray-200 flex justify-center items-center gap-3"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <>
                      <span>Suscribirme ahora</span>
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-[9px] text-gray-400 uppercase tracking-widest text-center">
                Privacidad garantizada · Sin spam
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
