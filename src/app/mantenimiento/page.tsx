import { memo } from "react";

const Maintenance = memo(function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8 text-center antialiased">
      <div className="max-w-md space-y-8 animate-in fade-in duration-700">
        {/* Tu logo aquí */}
        <div className="font-serif text-5xl tracking-tighter text-gray-900 select-none">
          RIO
        </div>

        <div className="space-y-4">
          <h1 className="font-serif text-2xl italic text-gray-800 leading-tight">
            Estamos puliendo nuevos detalles
          </h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 leading-loose balance">
            Nuestra vitrina virtual está siendo actualizada con piezas
            exclusivas. Volvemos en breve.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="h-px w-12 bg-[#D4AF37] opacity-80"></div>
        </div>

        <div className="space-y-2">
          <p className="text-[9px] text-gray-400 italic">
            Si necesitas atención urgente, contáctanos por Instagram
          </p>
          <a
            href="https://www.instagram.com/riocolombia?igsh=MWJtZDhwYzgwaXRhaQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold tracking-widest text-gray-900 hover:text-[#D4AF37] transition-colors duration-300"
          >
            @RIO_COLOMBIA
          </a>
        </div>
      </div>
    </div>
  );
});

export default Maintenance;
