"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ShoppingBag, LayoutDashboard } from "lucide-react";
import { useCart } from "../store/useCart";
import { createClient } from "../lib/supabase";

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const items = useCart((state) => state.items);
  const supabase = createClient();

  // OPTIMIZACIÓN: Memorizamos el conteo para evitar cálculos innecesarios en cada render
  const itemsCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  useEffect(() => {
    setIsMounted(true);

    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setIsAdmin(!!session);
      } catch (error) {
        console.error("Error checking session:", error);
        setIsAdmin(false);
      }
    };

    checkSession();
  }, [supabase.auth]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-lg border-b border-gray-100/80 transition-all duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8 relative">
        {/* 1. IZQUIERDA: ESPACIO VACÍO (Mantiene el logo centrado) */}
        <div className="flex-1 lg:flex hidden" />

        {/* 2. CENTRO: LOGO (Centrado absoluto con refinamiento visual) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link
            href="/"
            className="block group transition-transform duration-500 hover:scale-105"
          >
            <img
              src="/logo.png"
              alt="RIO Boutique"
              className="h-10 md:h-14 w-auto object-contain drop-shadow-sm"
            />
          </Link>
        </div>

        {/* 3. DERECHA: ICONOS Y ACCIONES */}
        <div className="flex-1 flex items-center justify-end gap-3 md:gap-6">
          {/* BOTÓN ADMIN: Más estilizado y minimalista */}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#D4AF37] transition-all duration-300 border border-gray-100 hover:border-[#D4AF37]/30 px-3 py-2 rounded-full bg-gray-50/50"
              title="Panel de Control"
            >
              <LayoutDashboard size={14} strokeWidth={2.5} />
              <span className="hidden sm:inline">Panel</span>
            </Link>
          )}

          {/* CARRITO: Con animación de pulso sutil en el contador */}
          <Link href="/cart" className="relative p-2.5 group transition-colors">
            <ShoppingBag
              strokeWidth={1.5}
              size={24}
              className="text-gray-900 group-hover:text-[#D4AF37] transition-colors duration-300"
            />

            {isMounted && itemsCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#D4AF37] text-[9px] font-black text-white shadow-sm ring-2 ring-white animate-in zoom-in duration-300">
                {itemsCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
