"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { useCart } from "../../store/useCart";
import { formatPrice } from "../../lib/utils";
import { createClient } from "../../lib/supabase";
import {
  Trash2,
  MessageCircle,
  Loader2,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

// Constantes de configuración
const FREE_SHIPPING_THRESHOLD = 100000;
const WHOLESALE_MIN_ITEMS = 12;
const WHOLESALE_DISCOUNT = 0.4;

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  // OPTIMIZADO: El ID de borrado ahora incluye variantes para no animar lo que no es
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hpValue, setHpValue] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    id_number: "",
    phone: "",
    city: "",
    address: "",
  });

  const supabase = useMemo(() => createClient(), []);

  // --- CÁLCULOS MEMORIZADOS ---
  const {
    subtotal,
    totalItems,
    isWholesale,
    discountAmount,
    shippingCost,
    total,
    progressPercentage,
    remainingForFreeShipping,
    itemsNeeded,
  } = useMemo(() => {
    const sub = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    const wholesale = count >= WHOLESALE_MIN_ITEMS;
    const discount = wholesale ? sub * WHOLESALE_DISCOUNT : 0;
    const shipping = sub >= FREE_SHIPPING_THRESHOLD ? 0 : 15000;

    return {
      subtotal: sub,
      totalItems: count,
      isWholesale: wholesale,
      discountAmount: discount,
      shippingCost: shipping,
      total: sub + shipping - discount,
      progressPercentage: Math.min(100, (sub / FREE_SHIPPING_THRESHOLD) * 100),
      remainingForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - sub),
      itemsNeeded: Math.max(0, WHOLESALE_MIN_ITEMS - count),
    };
  }, [items]);

  // CORREGIDO: Maneja el borrado identificando color y talla
  const handleRemoveClick = (id: string, color?: string, size?: string) => {
    // Unificamos la generación de la key
    const variantKey = `${id}-${color || ""}-${size || ""}`;
    setDeletingId(variantKey);

    // Esperamos a que termine la animación de 300ms antes de quitarlo del estado
    setTimeout(() => {
      removeItem(id, color, size);
      setDeletingId(null);
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hpValue !== "") return;
    if (items.length === 0) return toast.error("Tu carrito está vacío");

    // Validaciones
    if (formData.name.trim().split(" ").length < 2)
      return toast.error("Ingresa nombre y apellido.");
    if (!/^\d{6,12}$/.test(formData.id_number))
      return toast.error("Cédula inválida (6-12 dígitos).");
    if (!/^3\d{9}$/.test(formData.phone))
      return toast.error("Celular debe empezar por 3 y tener 10 dígitos.");
    if (formData.city.trim().length < 5)
      return toast.error("Ingresa Ciudad y Departamento completos.");
    if (formData.address.trim().length < 10)
      return toast.error("La dirección es demasiado corta.");

    setLoading(true);

    try {
      // 1. Guardar Pedido
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_info: formData,
          products: items,
          total_value: total,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Google Analytics
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "generate_lead", {
          event_category: "Ventas",
          value: total,
          currency: "COP",
        });
      }

      // 3. Descontar Inventario
      await Promise.all(
        items.map(async (item) => {
          const { data } = await supabase
            .from("products")
            .select("stock")
            .eq("id", item.id)
            .single();
          if (data) {
            await supabase
              .from("products")
              .update({ stock: Math.max(0, data.stock - item.quantity) })
              .eq("id", item.id);
          }
        }),
      );

      // 4. Preparar WhatsApp
      const orderId = order.id.slice(0, 8);
      let msg = `*¡Hola Rio! Pedido #${orderId}*\n👤 *Cliente:* ${formData.name}\n📍 *Ciudad:* ${formData.city}\n\n*--- PRODUCTOS ---*\n`;

      items.forEach((item) => {
        const variants = [item.selectedColor, item.selectedSize]
          .filter(Boolean)
          .join(" - ");
        msg += `▪️ ${item.quantity}x ${item.name}${variants ? ` (${variants})` : ""} - ${formatPrice(item.price * item.quantity)}\n`;
      });

      msg += `\n💵 *Subtotal:* ${formatPrice(subtotal)}`;
      if (isWholesale)
        msg += `\n✨ *Desc. Mayorista:* -${formatPrice(discountAmount)}`;
      msg += `\n📦 *Envío:* ${shippingCost === 0 ? "¡GRATIS!" : formatPrice(shippingCost)}`;
      msg += `\n💰 *TOTAL: ${formatPrice(total)}*\n\n📝 *Entrega:* ${formData.address}\nCC: ${formData.id_number}\nCel: ${formData.phone}`;

      const whatsappUrl = `https://wa.me/584246043812?text=${encodeURIComponent(msg)}`;

      clearCart();
      toast.success("¡Redirigiendo a WhatsApp!");
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Error al procesar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  // Clases Reutilizables
  const inputClass =
    "w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:bg-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-medium";
  const labelClass =
    "block text-xs font-bold uppercase text-gray-600 mb-1 tracking-wide";

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] px-4 animate-in fade-in zoom-in">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <ShoppingBag size={48} className="text-gray-300" />
          </div>
          <h2 className="font-serif text-2xl text-gray-900 mb-2">
            Tu bolsa está vacía
          </h2>
          <Link
            href="/"
            className="bg-black text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition shadow-lg"
          >
            Ir al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />
      <div className="container mx-auto px-4 md:px-12 py-12">
        <h1 className="font-serif text-3xl text-gray-900 mb-8 text-center md:text-left">
          Tu Bolsa de Compras
        </h1>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* LADO IZQUIERDO: PRODUCTOS */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Truck
                    size={18}
                    className={
                      remainingForFreeShipping > 0
                        ? "text-gray-400"
                        : "text-[#D4AF37]"
                    }
                  />
                  <p className="text-sm font-medium text-gray-600">
                    {remainingForFreeShipping > 0 ? (
                      <>
                        Faltan{" "}
                        <span className="font-bold text-gray-900">
                          {formatPrice(remainingForFreeShipping)}
                        </span>{" "}
                        para{" "}
                        <span className="font-bold text-[#D4AF37]">
                          Envío Gratis
                        </span>
                      </>
                    ) : (
                      <span className="text-green-600 font-bold">
                        ¡Genial! Tienes Envío Gratis incluido 🎉
                      </span>
                    )}
                  </p>
                </div>
                <span className="text-xs font-bold text-gray-400">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${remainingForFreeShipping > 0 ? "bg-[#D4AF37]" : "bg-green-500"}`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {items.map((item, index) => {
              // Generamos una key única por variante
              const itemKey = `${item.id}-${item.selectedColor || ""}-${item.selectedSize || ""}`;

              return (
                <div
                  key={itemKey}
                  className={`flex gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out ${
                    deletingId === itemKey
                      ? "opacity-0 scale-95 translate-x-8 pointer-events-none"
                      : "opacity-100 scale-100 translate-x-0"
                  }`}
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-24 w-24 object-cover rounded-md bg-gray-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif text-lg text-gray-900">
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-[10px] text-gray-500 uppercase border px-2 py-0.5 rounded bg-gray-50">
                            {item.category}
                          </span>
                          {(item.selectedColor || item.selectedSize) && (
                            <span className="text-[10px] text-black font-bold uppercase border px-2 py-0.5 rounded bg-gray-50">
                              {[item.selectedColor, item.selectedSize]
                                .filter(Boolean)
                                .join(" / ")}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveClick(
                            item.id,
                            item.selectedColor,
                            item.selectedSize,
                          )
                        }
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                      >
                        {deletingId === itemKey ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1),
                              item.selectedColor,
                              item.selectedSize,
                            )
                          }
                          className="px-3 py-1 hover:bg-gray-200 text-gray-600"
                        >
                          -
                        </button>
                        <span className="text-sm font-black w-8 text-center text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1,
                              item.selectedColor,
                              item.selectedSize,
                            )
                          }
                          className="px-3 py-1 hover:bg-gray-200 text-gray-600"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-bold text-gray-900 text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div
              className={`mt-4 p-3 rounded-lg border flex items-center gap-3 ${isWholesale ? "bg-green-50 border-green-200 text-green-800" : "bg-yellow-50 border-yellow-200 text-yellow-800"}`}
            >
              {isWholesale ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <div>
                <h4 className="font-bold text-xs uppercase">
                  {isWholesale
                    ? "¡40% OFF Aplicado!"
                    : "¡Desbloquea precios mayoristas!"}
                </h4>
                <p className="text-[10px] opacity-80">
                  {isWholesale
                    ? "¡Tienes 12+ unidades!"
                    : `Agrega ${itemsNeeded} unidades más para el 40% de descuento.`}
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition pb-0.5 border-b border-transparent hover:border-black w-fit"
            >
              <ArrowLeft size={16} /> SEGUIR COMPRANDO
            </Link>
          </div>

          {/* LADO DERECHO: FORMULARIO */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="font-serif text-xl text-gray-900 mb-6">
                Datos de Envío
              </h3>
              <form onSubmit={handleCheckout} className="space-y-4">
                <div style={{ display: "none" }} aria-hidden="true">
                  <input
                    type="text"
                    name="fax_number"
                    tabIndex={-1}
                    value={hpValue}
                    onChange={(e) => setHpValue(e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Nombre Completo</label>
                  <input
                    required
                    name="name"
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Ej: María Pérez"
                  />
                </div>
                <div>
                  <label className={labelClass}>Correo Electrónico</label>
                  <input
                    required
                    type="email"
                    name="email"
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="ejemplo@correo.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Cédula / NIT</label>
                    <input
                      required
                      name="id_number"
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="123456789"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Celular</label>
                    <input
                      required
                      name="phone"
                      maxLength={10}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="300 123 4567"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Ciudad y Departamento</label>
                  <input
                    required
                    name="city"
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Ej: Bogotá, Cundinamarca"
                  />
                </div>
                <div>
                  <label className={labelClass}>Dirección Exacta</label>
                  <input
                    required
                    name="address"
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Ej: Cra 15 # 80 - 20"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mt-6 space-y-2 border border-gray-100">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {isWholesale && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Descuento Mayorista (40%)</span>
                      <span>- {formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Envío</span>
                    <span
                      className={`font-bold ${shippingCost === 0 ? "text-green-600" : "text-gray-900"}`}
                    >
                      {shippingCost === 0
                        ? "¡GRATIS! 🎉"
                        : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 my-2 pt-2 flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <MessageCircle size={20} /> Finalizar en WhatsApp
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
