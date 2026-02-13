import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-white px-6 text-center">
      {/* Un número grande y sutil de fondo */}
      <h1 className="font-serif text-[150px] leading-none text-gray-50 absolute z-0 select-none">
        404
      </h1>

      <div className="z-10">
        <h2 className="text-2xl md:text-3xl font-serif mb-4 text-gray-900 italic">
          Esta pieza no está en nuestro catálogo
        </h2>
        <p className="text-gray-400 mb-10 max-w-sm mx-auto text-[10px] uppercase tracking-[0.3em] leading-relaxed">
          Parece que el enlace que seguiste ha expirado o nunca existió.
        </p>

        <Link
          href="/"
          className="group inline-flex items-center gap-3 border-b border-black pb-2 text-[11px] font-bold uppercase tracking-widest text-black transition-all hover:gap-5"
        >
          Explorar la colección
          <ArrowRight size={14} className="transition-transform" />
        </Link>
      </div>
    </div>
  );
}
