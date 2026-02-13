"use client";

import { useMemo } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Scale,
  Gem,
  Truck,
  CreditCard,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";

export default function TermsPage() {
  // Optimizamos el array con useMemo para estabilidad de renderizado
  const terms = useMemo(
    () => [
      {
        icon: <Scale size={22} />,
        title: "1. Aceptación",
        content:
          "Al navegar y comprar en Rio Colombia, aceptas estos términos. Nos reservamos el derecho de actualizar nuestras colecciones y precios sin previo aviso, siempre buscando ofrecerte lo mejor.",
      },
      {
        icon: <Gem size={22} />,
        title: "2. Productos y Calidad",
        content:
          "Nuestras joyas están bañadas en Oro, Rodio o fabricadas en Acero Inoxidable de alta calidad. Nos esforzamos por mostrar los colores con precisión, pero pueden variar ligeramente según la pantalla de tu dispositivo.",
      },
      {
        icon: <CreditCard size={22} />,
        title: "3. Pagos y Seguridad",
        content:
          "Este sitio funciona como un catálogo digital. La transacción final es 100% segura y personalizada: se coordina a través de WhatsApp mediante Nequi, Bancolombia o efectivo, garantizando transparencia total.",
      },
      {
        icon: <Truck size={22} />,
        title: "4. Política de Envíos",
        content:
          "Realizamos envíos a toda Colombia. Los tiempos de entrega varían entre 2 a 5 días hábiles dependiendo de la ciudad. El envío es gratis por compras superiores a $100.000 COP.",
      },
      {
        icon: <RefreshCcw size={22} />,
        title: "5. Cambios y Garantías",
        content:
          "Ofrecemos garantía por defectos de fábrica (broches, caída de piedras) reportados dentro de los 5 días posteriores a la entrega. La garantía no cubre el desgaste natural por PH de la piel o mal uso.",
      },
    ],
    [],
  );

  return (
    <main className="min-h-screen bg-white antialiased">
      <Navbar />

      {/* Header Premium Cream */}
      <header className="bg-[#F9F8F6] text-gray-900 py-24 px-6 text-center border-b border-gray-100">
        <div className="flex justify-center mb-8 animate-in fade-in zoom-in duration-700">
          <div className="p-5 bg-white rounded-full shadow-sm ring-1 ring-gray-100/50">
            <Scale size={42} className="text-[#D4AF37]" />
          </div>
        </div>
        <h1 className="font-serif text-4xl md:text-6xl tracking-tight mb-6">
          Términos y Condiciones
        </h1>
        <p className="text-gray-400 text-[11px] md:text-xs max-w-2xl mx-auto font-bold uppercase tracking-[0.3em] leading-relaxed">
          Claridad y transparencia. <br />
          Todo lo que necesitas saber sobre tu compra.
        </p>
      </header>

      {/* Grid de Términos */}
      <section className="container mx-auto px-4 md:px-12 py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="grid gap-6">
            {terms.map((item, index) => (
              <article
                key={index}
                className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-500 flex flex-col md:flex-row gap-8 items-start"
              >
                <div className="p-4 bg-[#F9F8F6] group-hover:bg-[#D4AF37] group-hover:text-white rounded-full text-[#D4AF37] shrink-0 transition-all duration-500 shadow-sm">
                  {item.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="font-serif text-2xl text-gray-900 font-bold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-[15px] leading-relaxed font-medium">
                    {item.content}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Alert Box de Reserva */}
          <div className="bg-[#FFFDF5] p-6 rounded-2xl border border-[#D4AF37]/20 flex gap-5 items-center mt-10 shadow-sm animate-in slide-in-from-bottom-4 duration-1000">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <AlertCircle className="text-[#D4AF37] shrink-0" size={20} />
            </div>
            <p className="text-[11px] md:text-xs text-yellow-900/80 font-semibold leading-relaxed uppercase tracking-wider">
              Rio Colombia se reserva el derecho de cancelar pedidos si se
              detecta actividad sospechosa o errores en el inventario. En tal
              caso, se notificará inmediatamente al cliente.
            </p>
          </div>
        </div>

        {/* Footer de Página */}
        <footer className="text-center mt-20">
          <div className="h-px w-12 bg-gray-100 mx-auto mb-8" />
          <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.4em]">
            Rio Colombia © 2026
          </p>
        </footer>
      </section>

      <Footer />
    </main>
  );
}
