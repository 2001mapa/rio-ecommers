"use client";

import { memo } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ShieldCheck, Lock, Eye, Database, Cookie, Mail } from "lucide-react";

export default function PrivacyPage() {
  // Optimizamos la estructura de datos para que sea más limpia
  const sections = [
    {
      icon: <Database size={22} />,
      title: "1. Información que Recopilamos",
      content:
        "Para procesar tus pedidos con excelencia, recopilamos datos básicos como tu nombre, celular, dirección de envío y correo electrónico. También almacenamos tu historial de compras para brindarte una atención personalizada.",
    },
    {
      icon: <Eye size={22} />,
      title: "2. Uso de tu Información",
      content:
        "Tus datos son sagrados. Los usamos exclusivamente para: Coordinar entregas, confirmar pagos vía WhatsApp y, si nos das permiso, enviarte novedades de nuestra colección exclusiva.",
    },
    {
      icon: <Lock size={22} />,
      title: "3. Protección de Datos",
      content:
        "Implementamos medidas de seguridad digital para proteger tu información contra accesos no autorizados. Tu información de pago nunca se almacena en nuestros servidores, ya que las transacciones se realizan directamente entre bancos.",
    },
    {
      icon: <Cookie size={22} />,
      title: "4. Política de Cookies",
      content:
        "Utilizamos cookies para recordar tus preferencias (como tu carrito de compras) y analizar el tráfico de forma anónima para mejorar nuestra web. Puedes desactivarlas en tu navegador cuando desees.",
    },
    {
      icon: <Mail size={22} />,
      title: "5. Contacto y Derechos",
      content:
        "Tienes derecho a conocer, actualizar o eliminar tus datos de nuestra base de datos. Para cualquier solicitud, nuestro canal de atención en WhatsApp está siempre abierto para ti.",
    },
  ];

  return (
    <main className="min-h-screen bg-white antialiased">
      <Navbar />

      {/* Header con Refinamiento Estético */}
      <header className="bg-[#F9F8F6] text-gray-900 py-24 px-6 text-center border-b border-gray-100">
        <div className="flex justify-center mb-8 animate-in fade-in zoom-in duration-500">
          <div className="p-5 bg-white rounded-full shadow-sm ring-1 ring-gray-100">
            <ShieldCheck size={44} className="text-[#D4AF37]" />
          </div>
        </div>
        <h1 className="font-serif text-4xl md:text-6xl tracking-tight mb-6">
          Política de Privacidad
        </h1>
        <p className="text-gray-400 text-[11px] md:text-xs max-w-2xl mx-auto font-bold uppercase tracking-[0.3em] leading-relaxed">
          Tu confianza es nuestra joya más preciada. <br />
          Aquí te explicamos cómo cuidamos de ella.
        </p>
      </header>

      {/* Contenido Principal */}
      <section className="container mx-auto px-4 md:px-12 py-20">
        <div className="max-w-4xl mx-auto grid gap-8">
          {sections.map((section, index) => (
            <article
              key={index}
              className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-xl hover:shadow-gray-100 transition-all duration-500 flex flex-col md:flex-row gap-8 items-start"
            >
              <div className="p-4 bg-[#F9F8F6] group-hover:bg-white group-hover:ring-1 group-hover:ring-[#D4AF37]/20 rounded-full text-[#D4AF37] shrink-0 transition-all duration-500">
                {section.icon}
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-gray-900 font-bold tracking-tight">
                  {section.title}
                </h3>
                <p className="text-gray-500 text-[15px] leading-relaxed font-medium">
                  {section.content}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Footer de Página con Fecha Dinámica */}
        <footer className="text-center mt-20">
          <div className="h-px w-16 bg-gray-100 mx-auto mb-8" />
          <p className="text-[10px] text-gray-300 uppercase tracking-[0.5em] font-bold">
            Última actualización: Febrero 2026
          </p>
        </footer>
      </section>

      <Footer />
    </main>
  );
}
