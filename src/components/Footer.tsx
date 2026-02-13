"use client";

import React from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  ShieldCheck,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  // Centralizamos los links para facilitar el mantenimiento y evitar repetición de código
  const shopLinks = [
    { name: "Catálogo", href: "/" },
    { name: "Mi Carrito", href: "/cart" },
    { name: "Novedades 2026", href: "/" },
  ];

  const serviceLinks = [
    { name: "Envíos y Entregas", href: "/shipping" },
    { name: "Sobre Nosotros", href: "/about" },
    { name: "Garantía y Cuidados", href: "/warranty" },
  ];

  const paymentMethods = ["Nequi", "Bancolombia", "Efectivo", "Links de Pago"];

  return (
    <footer className="bg-[#F8F8F5] text-gray-800 pt-24 pb-12 border-t border-gray-200/60 antialiased">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-24">
          {/* COLUMNA 1: IDENTIDAD */}
          <div className="md:col-span-4 space-y-8">
            <div className="space-y-4">
              <Link href="/" className="inline-block group">
                <h2 className="font-serif text-4xl tracking-[0.2em] text-gray-900 group-hover:text-[#D4AF37] transition-colors duration-500">
                  RIO
                </h2>
                <div className="h-px w-0 group-hover:w-full bg-[#D4AF37] transition-all duration-500 ease-in-out" />
              </Link>
              <div className="h-px w-12 bg-[#D4AF37]/40" />
            </div>

            <p className="text-gray-500 text-[13px] leading-relaxed max-w-xs font-medium">
              Una edición exclusiva de piezas de lujo diseñadas para elevar tu
              esencia cotidiana. Elegancia atemporal con el sello de{" "}
              <span className="text-gray-900">RIO Colombia</span>.
            </p>

            <div className="flex gap-4">
              {[
                {
                  Icon: Instagram,
                  href: "https://www.instagram.com/riocolombia?igsh=MWJtZDhwYzgwaXRhaQ==",
                },
                { Icon: Facebook, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-gray-200 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] hover:bg-white hover:shadow-sm transition-all duration-300"
                >
                  <social.Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* COLUMNA 2: TIENDA */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-gray-400">
              Colecciones
            </h3>
            <ul className="space-y-5">
              {shopLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-[13px] text-gray-600 hover:text-[#D4AF37] flex items-center group transition-all duration-300"
                  >
                    <span className="w-0 group-hover:w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 text-[#D4AF37] overflow-hidden">
                      <ArrowRight size={12} className="mr-2" />
                    </span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMNA 3: AYUDA */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-gray-400">
              Servicios
            </h3>
            <ul className="space-y-5">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-gray-600 hover:text-[#D4AF37] transition-all duration-300 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMNA 4: CONTACTO PREMIUM */}
          <div className="md:col-span-4 bg-white/60 backdrop-blur-sm p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <ShieldCheck size={120} className="text-[#D4AF37]" />
            </div>

            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-gray-900 relative z-10">
              Atención Exclusiva
            </h3>

            <div className="flex items-center gap-3 text-gray-800 mb-5 relative z-10">
              <div className="bg-[#D4AF37]/10 p-2.5 rounded-xl">
                <ShieldCheck size={20} className="text-[#D4AF37]" />
              </div>
              <span className="text-[11px] font-black tracking-widest uppercase">
                Compra Protegida
              </span>
            </div>

            <p className="text-[12px] text-gray-500 leading-relaxed mb-8 relative z-10">
              Coordinamos cada detalle de tu entrega y medios de pago de forma
              personalizada vía WhatsApp para garantizar tu seguridad.
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-3 relative z-10">
              {paymentMethods.map((pago) => (
                <span
                  key={pago}
                  className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-600 transition-colors"
                >
                  {pago}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* LÍNEA DE CIERRE */}
        <div className="pt-10 border-t border-gray-200/60 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 lg:gap-8">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-medium">
              © 2026 Rio Colombia
            </p>

            <div className="h-3 w-px bg-gray-200 hidden md:block" />

            {["Privacy", "Terms"].map((legal) => (
              <Link
                key={legal}
                href={`/${legal.toLowerCase()}`}
                className="text-[10px] text-gray-400 hover:text-gray-900 uppercase tracking-[0.3em] font-black transition-all"
              >
                {legal === "Privacy" ? "Privacidad" : "Términos"}
              </Link>
            ))}

            <Link
              href="/admin"
              className="opacity-[0.2] hover:opacity-100 hover:scale-125 transition-all ml-2 p-1"
              title="Staff Only"
            >
              <Lock size={11} className="text-gray-900" />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400">
              Online Store Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
