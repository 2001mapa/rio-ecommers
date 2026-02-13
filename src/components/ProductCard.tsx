"use client";

import React, { useMemo } from "react";
import { useCart } from "../store/useCart";
import { formatPrice } from "../lib/utils";
import { Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

const colorMap: Record<string, string> = {
  Dorado: "#D4AF37",
  Plateado: "#C0C0C0",
  "Oro Rosa": "#E0BFB8",
  "Rose Gold": "#E0BFB8",
  Negro: "#000000",
  Blanco: "#FFFFFF",
  Rojo: "#EF4444",
  Azul: "#3B82F6",
  Verde: "#10B981",
  Cuero: "#8B4513",
  Marrón: "#5D4037",
  Marron: "#5D4037",
  Café: "#4E342E",
  Cafe: "#4E342E",
  Beige: "#F5F5DC",
  Crema: "#FFFDD0",
  Gris: "#9CA3AF",
  Rosado: "#F472B6",
  Rosa: "#F472B6",
  Fucsia: "#D946EF",
  Morado: "#7C3AED",
  Lila: "#C084FC",
  Amarillo: "#FACC15",
  Naranja: "#FB923C",
  Vino: "#881337",
  Turquesa: "#2DD4BF",
  Celeste: "#7DD3FC",
};

interface ProductCardProps {
  product: any;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} agregado`, {
      icon: <Sparkles className="h-4 w-4 text-[#D4AF37]" />,
      className: "rounded-2xl font-sans text-xs uppercase tracking-widest",
      duration: 1500,
    });
  };

  const colorsArray = useMemo(
    () =>
      product.colors
        ? product.colors.split(",").map((c: string) => c.trim())
        : [],
    [product.colors],
  );

  return (
    <div
      onClick={onClick}
      /* 1. Agregamos 'isolate' para manejar mejor las capas de CSS.
         2. El border-transparent ayuda a que el recorte sea más limpio.
      */
      className="group relative flex flex-col overflow-hidden rounded-[1.5rem] bg-white transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-transparent hover:border-gray-100 h-full cursor-pointer isolate"
    >
      {/* CONTENEDOR DE IMAGEN: 
          Agregamos rounded-t-[inherit] para que use exactamente el mismo radio (1.5rem) que el padre.
      */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[inherit] bg-[#F9F8F6]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            /* TRANSFORM-GPU: Fuerza el uso de la tarjeta gráfica para que el zoom no "tiemble".
               ROUNDED: También aplicamos el redondeado a la imagen misma.
               SCALE: Bajamos a 1.05 para que sea elegante y no rompa el borde.
            */
            className="h-full w-full object-cover rounded-t-[inherit] transition-transform duration-[2s] ease-out group-hover:scale-105 transform-gpu"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-gray-300 gap-2">
            <Sparkles size={20} className="opacity-20" />
            <span className="text-[10px] uppercase tracking-[0.2em]">
              Próximamente
            </span>
          </div>
        )}

        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/80 backdrop-blur-md px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-gray-900 rounded-full shadow-sm border border-white/50">
            {product.category}
          </span>
        </div>

        <button
          type="button"
          onClick={handleQuickAdd}
          className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-xl transition-all duration-300 hover:bg-[#D4AF37] hover:scale-110 active:scale-95 z-10
          md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
          title="Agregar a la bolsa"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5 bg-white">
        <div className="space-y-1">
          <h3 className="text-[13px] font-serif font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-[#D4AF37] transition-colors duration-300">
            {product.name}
          </h3>

          {colorsArray.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              {colorsArray.slice(0, 4).map((colorName: string, i: number) => {
                const bg = colorMap[colorName] || "#E5E7EB";
                return (
                  <div
                    key={i}
                    className="h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-black/5 shadow-inner"
                    style={{ backgroundColor: bg }}
                    title={colorName}
                  />
                );
              })}
              {colorsArray.length > 4 && (
                <span className="text-[9px] font-bold text-gray-400 ml-1">
                  +{colorsArray.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
          <span className="text-sm font-black tracking-tight text-gray-950">
            {formatPrice(product.price)}
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 group-hover:text-[#D4AF37] transition-colors">
            Ver Detalle
          </span>
        </div>
      </div>
    </div>
  );
}
