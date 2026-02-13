"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClient } from "../../../lib/supabase";
import Navbar from "../../../components/Navbar";
import { formatPrice } from "../../../lib/utils";
import { useCart } from "../../../store/useCart";
import { toast } from "sonner";
import {
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Star,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const supabase = createClient();
  const addItem = useCart((state) => state.addItem);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [variants, setVariants] = useState<string[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data);
        if (data.category === "Anillos") {
          setVariants(["6", "7", "8", "9", "10"]);
          setSelectedVariant("7");
        } else if (data.category === "Conjuntos") {
          setVariants(["Dorado", "Plateado", "Rose Gold"]);
          setSelectedVariant("Dorado");
        }
      }
      setLoading(false);
    };

    if (params.id) fetchProduct();
  }, [params.id, supabase]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    // Lógica optimizada para evitar múltiples llamadas al store
    for (let i = 0; i < quantity; i++) {
      addItem({ ...product, selectedVariant });
    }

    toast.success(
      <div className="flex flex-col gap-0.5">
        <span className="font-bold text-gray-900">¡Añadido con éxito!</span>
        <span className="text-xs text-gray-500">
          {quantity}x {product.name}{" "}
          {selectedVariant ? `(${selectedVariant})` : ""}
        </span>
      </div>,
      { icon: <ShoppingBag className="text-green-600" size={18} /> },
    );
  }, [product, quantity, selectedVariant, addItem]);

  if (loading)
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-[#D4AF37]" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
          Cargando pieza exclusiva...
        </p>
      </div>
    );

  if (!product)
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 p-20 text-center">
        <h2 className="font-serif text-2xl text-gray-900">
          Esta pieza ya no está disponible
        </h2>
        <Link
          href="/"
          className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] underline"
        >
          Volver a la colección
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-white pb-20 antialiased">
      <Navbar />

      <div className="container mx-auto max-w-7xl px-4 py-6 lg:py-12">
        {/* Breadcrumb / Back Link */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-gray-900"
        >
          <ChevronLeft size={14} /> Volver a la vitrina
        </Link>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* 1. GALERÍA DE IMÁGENES */}
          <div className="relative">
            <div className="sticky top-24 aspect-[4/5] overflow-hidden rounded-2xl bg-[#F9F8F6] shadow-inner group">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-300">
                  Sin Imagen
                </div>
              )}
              <div className="absolute top-6 left-6 rounded-full bg-white/80 backdrop-blur-md px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 shadow-sm border border-white/20">
                {product.category}
              </div>
            </div>
          </div>

          {/* 2. DETALLES DEL PRODUCTO */}
          <div className="flex flex-col justify-center py-2">
            <header className="space-y-4">
              <h1 className="font-serif text-4xl font-medium leading-tight text-gray-900 lg:text-5xl">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 border-b border-gray-100 pb-6">
                <span className="text-3xl font-bold tracking-tighter text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-gray-400 line-through opacity-60">
                  {formatPrice(product.price * 1.2)}
                </span>
              </div>
            </header>

            <div className="mt-8 space-y-6">
              <p className="text-[15px] leading-relaxed text-gray-600">
                {product.description ||
                  "Una pieza exclusiva diseñada para resaltar tu elegancia. Material de alta calidad garantizado por Rio Colombia."}
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-[#F9F8F6] px-4 py-2 text-[11px] font-bold text-gray-600">
                  <ShieldCheck size={14} className="text-[#D4AF37]" /> Garantía
                  Rio
                </div>
                <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-[#F9F8F6] px-4 py-2 text-[11px] font-bold text-gray-600">
                  <Star size={14} className="text-[#D4AF37]" />{" "}
                  {product.material}
                </div>
              </div>
            </div>

            {/* SELECTOR DE VARIANTES */}
            {variants.length > 0 && (
              <div className="mt-10">
                <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-900">
                  Selecciona{" "}
                  {product.category === "Anillos" ? "Talla" : "Tonalidad"}:
                </h3>
                <div className="flex flex-wrap gap-3">
                  {variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`min-w-[56px] px-4 py-2.5 rounded-full border text-xs font-bold transition-all duration-300 ${
                        selectedVariant === v
                          ? "border-gray-900 bg-gray-900 text-white shadow-xl shadow-gray-200"
                          : "border-gray-200 bg-white text-gray-500 hover:border-gray-900 hover:text-gray-900"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ACCIONES DE COMPRA */}
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <div className="flex h-14 items-center justify-between rounded-full border border-gray-200 px-2 sm:w-36">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  <Minus size={16} />
                </button>
                <span className="font-serif text-lg font-bold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="group relative flex h-14 flex-1 items-center justify-center gap-3 overflow-hidden rounded-full bg-black px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-gray-800 active:scale-[0.98]"
              >
                <ShoppingBag
                  size={18}
                  className="transition-transform group-hover:-translate-y-1"
                />
                Añadir a la bolsa
              </button>
            </div>

            {/* ENVÍO INFO */}
            <div className="mt-10 border-t border-gray-50 pt-8">
              <div className="group flex items-center gap-5 rounded-2xl bg-gray-50 p-5 transition-colors hover:bg-[#F9F8F6]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                  <Truck className="h-6 w-6 text-gray-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-900">
                    Envío Asegurado
                  </p>
                  <p className="text-[13px] text-gray-500 font-medium">
                    Cobertura nacional (2-4 días hábiles).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
