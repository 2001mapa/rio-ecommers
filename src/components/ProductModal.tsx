"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useCart } from "../store/useCart";
import { formatPrice } from "../lib/utils";
import { X, Minus, Plus, ShoppingBag, ShieldCheck, Star } from "lucide-react";
import { toast } from "sonner";

interface ProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

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

export default function ProductModal({
  product,
  isOpen,
  onClose,
}: ProductModalProps) {
  const addItem = useCart((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const currentStock = product?.stock || 0;
  const isOutOfStock = currentStock === 0;
  const isLowStock = currentStock > 0 && currentStock <= 10;

  const availableColors = useMemo(
    () =>
      product?.colors
        ? product.colors.split(",").map((c: string) => c.trim())
        : [],
    [product?.colors],
  );

  const availableSizes = useMemo(
    () => (product?.category === "Anillos" ? ["6", "7", "8", "9", "10"] : []),
    [product?.category],
  );

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedColor(availableColors[0] || null);
      setSelectedSize(
        availableSizes.includes("7") ? "7" : availableSizes[0] || null,
      );
    }
  }, [product, availableColors, availableSizes]);

  const handleAddToCart = useCallback(() => {
    if (isOutOfStock) return;

    if (availableSizes.length > 0 && !selectedSize) {
      toast.error("Por favor selecciona una talla");
      return;
    }

    if (quantity > currentStock) {
      toast.error(`Solo quedan ${currentStock} unidades disponibles`);
      return;
    }

    // AGREGADO: Incluimos colors y sizes para que el carrito sepa qué opciones mostrar
    const productToAdd = {
      ...product,
      selectedColor,
      selectedSize,
      colors: availableColors,
      sizes: availableSizes,
      quantity: quantity, // Pasamos la cantidad directamente para evitar el bucle for
    };

    addItem(productToAdd);

    const variants = [selectedColor, selectedSize].filter(Boolean).join(" - ");
    toast.success(`${product.name} agregado`, {
      description: variants ? `Opción: ${variants}` : "¡Excelente elección!",
      icon: <ShoppingBag size={16} />,
      duration: 2000,
    });
    onClose();
  }, [
    isOutOfStock,
    availableSizes,
    selectedSize,
    quantity,
    currentStock,
    product,
    selectedColor,
    availableColors,
    addItem,
    onClose,
  ]);

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4 transition-all duration-500"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl overflow-hidden rounded-t-[2rem] sm:rounded-[2.5rem] bg-white shadow-2xl md:grid md:grid-cols-2 animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-500 max-h-[95vh] flex flex-col md:flex-row"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-20 rounded-full bg-white/90 p-2.5 text-gray-500 hover:text-black transition-all shadow-sm active:scale-90 border border-gray-100"
        >
          <X size={20} />
        </button>

        {/* IMAGEN */}
        <div className="relative h-[40vh] md:h-full bg-[#F9F8F6] overflow-hidden flex-shrink-0">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-[3s] ease-out hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <ShoppingBag size={48} strokeWidth={1} />
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[4px]">
              <span className="bg-black text-white px-6 py-3 text-xs font-black uppercase tracking-[0.3em] rounded-full shadow-xl">
                Agotado
              </span>
            </div>
          )}
        </div>

        {/* CONTENIDO */}
        <div className="flex flex-col p-8 md:p-14 overflow-y-auto bg-white max-h-[55vh] md:max-h-[95vh] custom-scrollbar">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 rounded-full">
              {product.category}
            </span>

            {!isOutOfStock && (
              <div
                className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isLowStock ? "text-orange-500" : "text-green-600"}`}
              >
                <span
                  className={`flex h-2 w-2 rounded-full ${isLowStock ? "bg-orange-500 animate-pulse" : "bg-green-500"}`}
                />
                {isLowStock ? `¡Últimas ${currentStock} piezas!` : "En Stock"}
              </div>
            )}
          </div>

          <h2 className="mb-3 font-serif text-3xl md:text-4xl text-gray-900 leading-[1.1] italic">
            {product.name}
          </h2>

          <div className="flex items-baseline gap-4 mb-8">
            <p className="text-2xl font-black text-gray-950">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="mb-8 space-y-5 border-t border-gray-100 pt-8">
            <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
              {product.description ||
                "Una pieza exclusiva diseñada para perdurar, con el sello de elegancia de Rio Colombia."}
            </p>

            <div className="flex flex-wrap gap-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-gray-900" /> Garantía
                Vitalicia
              </span>
              <span className="flex items-center gap-2">
                <Star size={16} className="text-gray-900" />{" "}
                {product.material || "Material Premium"}
              </span>
            </div>
          </div>

          {!isOutOfStock && availableColors.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                  Seleccionar Color
                </span>
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">
                  {selectedColor}
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                {availableColors.map((color: string) => {
                  const hexCode = colorMap[color] || "#E5E7EB";
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`h-9 w-9 rounded-full border shadow-sm transition-all relative p-0.5 ${selectedColor === color ? "ring-2 ring-black ring-offset-4 scale-110" : "hover:scale-110 border-gray-200"}`}
                      style={{ backgroundColor: hexCode }}
                      title={color}
                    >
                      {color === "Blanco" && (
                        <span className="absolute inset-0 rounded-full border border-gray-200" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!isOutOfStock && availableSizes.length > 0 && (
            <div className="mb-10">
              <div className="flex justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                  Talla (US)
                </span>
                <button
                  type="button"
                  className="text-[9px] font-bold text-gray-400 underline decoration-[#D4AF37] underline-offset-4"
                >
                  Guía de tallas
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {availableSizes.map((size: string) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`h-11 flex items-center justify-center rounded-xl text-[11px] font-black transition-all duration-300 border ${selectedSize === size ? "bg-black border-black text-white shadow-lg" : "border-gray-100 bg-gray-50/50 text-gray-400 hover:border-gray-300 hover:text-gray-900"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-50 pb-4">
            {isOutOfStock ? (
              <button
                disabled
                className="w-full bg-gray-100 text-gray-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] cursor-not-allowed"
              >
                Próximamente Disponible
              </button>
            ) : (
              <>
                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-1 min-w-[140px]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-black shadow-none hover:shadow-sm"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm font-black text-gray-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(Math.min(currentStock, quantity + 1))
                    }
                    className="p-3 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-black shadow-none hover:shadow-sm disabled:opacity-20"
                    disabled={quantity >= currentStock}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-black px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/20 active:scale-[0.98]"
                >
                  <ShoppingBag size={18} />
                  Agregar a la bolsa
                </button>
              </>
            )}
          </div>

          <p className="mt-4 text-[9px] text-center text-gray-300 font-bold uppercase tracking-widest pb-2">
            Envío asegurado a toda Colombia
          </p>
        </div>
      </div>
    </div>
  );
}
