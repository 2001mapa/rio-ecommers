"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  Loader2,
  Check, // Nuevo icono para el checklist
} from "lucide-react";

// Rutas relativas
import { createClient } from "../../../lib/supabase";
import { formatPrice } from "../../../lib/utils";
import Navbar from "../../../components/Navbar";

export default function OrderPage() {
  const params = useParams();
  const supabase = createClient();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ESTADO PARA EL CHECKLIST (Local)
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    {},
  );

  useEffect(() => {
    const fetchOrder = async () => {
      const orderId = params.id;
      if (!orderId) return;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) {
        console.error("Error al buscar pedido:", error);
      } else {
        setOrder(data);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [params.id, supabase]);

  // Función para marcar/desmarcar
  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading)
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
        <p className="text-sm font-medium text-gray-500">Cargando recibo...</p>
      </div>
    );

  if (!order) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-white">
        <h1 className="font-serif text-2xl font-bold text-gray-900">
          Pedido no encontrado
        </h1>
        <Link
          href="/"
          className="rounded-full bg-black px-6 py-2 text-sm font-bold text-white transition-transform hover:scale-105"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  const subtotal = order.products.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0,
  );
  const totalItems = order.products.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0,
  );

  const hasDiscount = totalItems >= 12;
  const discountValue = hasDiscount ? subtotal * 0.4 : 0;
  const hasFreeShipping = subtotal > 99990;
  const shipping = hasFreeShipping ? 0 : 15000;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 antialiased">
      <Navbar />

      <div className="container mx-auto max-w-3xl px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-8 rounded-2xl bg-white p-8 text-center shadow-sm border border-green-100">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            ¡Pedido Confirmado!
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-widest">
            Orden ID: {order.id.toString().slice(0, 8)}
          </p>
        </div>

        {/* INFORMACIÓN DEL CLIENTE */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 font-serif text-xl font-bold text-gray-900">
            <FileText className="h-5 w-5 text-[#D4AF37]" />
            Detalles de Facturación
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <User className="mt-1 h-5 w-5 text-gray-300" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Cliente
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {order.customer_info.name}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">
                    CC/NIT: {order.customer_info.id_number}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-gray-300" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Email
                  </p>
                  <p className="text-base font-semibold text-gray-900 break-all">
                    {order.customer_info.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-gray-300" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Teléfono
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {order.customer_info.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-gray-300" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Destino
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {order.customer_info.address}
                  </p>
                  <p className="text-sm font-medium text-gray-500">
                    {order.customer_info.city}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LISTA DE PRODUCTOS CON CHECKLIST */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-serif text-lg font-bold text-gray-900">
              Artículos para Alistamiento ({order.products.length})
            </h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Check de Salida
            </span>
          </div>
          <ul className="divide-y divide-gray-50">
            {order.products.map((item: any, index: number) => {
              const isChecked = !!checkedItems[index];
              return (
                <li
                  key={index}
                  onClick={() => toggleCheck(index)}
                  className={`flex items-center gap-4 p-4 transition-all cursor-pointer select-none ${
                    isChecked ? "bg-gray-50/80" : "hover:bg-gray-50/30"
                  }`}
                >
                  {/* CHECKBOX PERSONALIZADO */}
                  <div
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      isChecked
                        ? "bg-green-500 border-green-500 shadow-sm"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {isChecked && (
                      <Check className="h-4 w-4 text-white" strokeWidth={3} />
                    )}
                  </div>

                  <div
                    className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 transition-opacity ${isChecked ? "opacity-50" : "opacity-100"}`}
                  >
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div
                    className={`flex flex-1 flex-col transition-all ${isChecked ? "opacity-40" : "opacity-100"}`}
                  >
                    <h3
                      className={`font-bold text-gray-900 leading-tight ${isChecked ? "line-through decoration-gray-400" : ""}`}
                    >
                      {item.name}
                    </h3>
                    <p className="text-[10px] font-bold text-[#D4AF37] uppercase mt-1">
                      {item.selectedColor || item.material}{" "}
                      {item.selectedSize ? `| TALLA ${item.selectedSize}` : ""}
                    </p>
                    <div className="mt-1 text-sm font-bold text-gray-900">
                      Cant: {item.quantity}
                    </div>
                  </div>

                  <div
                    className={`text-right font-serif font-bold text-gray-400 transition-opacity ${isChecked ? "opacity-20" : "opacity-100"}`}
                  >
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* TOTALES */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium text-gray-500">
              <span>Subtotal</span>
              <span className="text-gray-900">{formatPrice(subtotal)}</span>
            </div>

            {discountValue > 0 && (
              <div className="flex justify-between text-sm font-bold text-green-600">
                <span>Descuento Mayorista (40% OFF)</span>
                <span>- {formatPrice(discountValue)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-medium text-gray-500">
              <span>Costo de Envío</span>
              <span
                className={
                  shipping === 0 ? "font-bold text-green-600" : "text-gray-900"
                }
              >
                {shipping === 0 ? "¡GRATIS!" : formatPrice(shipping)}
              </span>
            </div>

            <div className="my-4 border-t border-gray-100 pt-4"></div>

            <div className="flex justify-between items-center font-serif">
              <span className="text-lg font-bold text-gray-900">
                Total Final
              </span>
              <span className="text-3xl font-black text-gray-900 tracking-tighter">
                {formatPrice(order.total_value)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
