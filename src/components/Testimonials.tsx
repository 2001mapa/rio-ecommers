"use client";

import { Star, Quote } from "lucide-react";

// Definimos una interfaz para mejor soporte de TypeScript
interface Testimonial {
  name: string;
  city: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Lucía M.",
    city: "Medellín",
    text: "La calidad de las piezas superó mis expectativas. La elegancia de los acabados es real, se nota el cuidado en cada detalle. Definitivamente una inversión que vale la pena.",
    rating: 5,
  },
  {
    name: "Andrés F.",
    city: "Bogotá",
    text: "Buscaba el regalo perfecto y lo encontré en RIO. El empaque es de otro nivel y la joya tiene un brillo increíble que no se pierde con el tiempo.",
    rating: 5,
  },
  {
    name: "Isabela R.",
    city: "Cali",
    text: "Mi collar favorito ahora es de RIO. Lo uso a diario, no se oscurece y combina con todo. La atención al cliente fue impecable.",
    rating: 5,
  },
];

export default function Testimonials() {
  // Generamos el JSON-LD para Google (SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: testimonials.map((t, i) => ({
      "@type": "Review",
      position: i + 1,
      author: {
        "@type": "Person",
        name: t.name,
      },
      reviewBody: t.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating,
        bestRating: "5",
      },
      publisher: {
        "@type": "Organization",
        name: "RIO Colombia",
      },
    })),
  };

  return (
    <section
      className="bg-[#F9F9F9] py-24 relative overflow-hidden"
      aria-labelledby="testimonials-title"
    >
      {/* Script de Datos Estructurados para Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-gray-100 to-transparent opacity-70 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2
            id="testimonials-title"
            className="font-serif text-3xl md:text-5xl italic text-gray-900 tracking-wide mb-4"
          >
            Voces RIO
          </h2>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
            Historias reales de quienes eligen la excelencia
          </p>
          <div className="h-px w-20 bg-[#D4AF37]/30 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {testimonials.map((item, index) => (
            <article
              key={index}
              className="group bg-white p-10 rounded-[2rem] shadow-xl border border-gray-50 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:border-[#D4AF37]/20 relative flex flex-col"
            >
              <Quote
                className="absolute top-8 right-8 text-gray-100 group-hover:text-[#D4AF37]/10 transition-colors"
                size={40}
                aria-hidden="true"
              />

              {/* Rating con accesibilidad para lectores de pantalla */}
              <div
                className="flex gap-1 mb-6"
                aria-label={`Calificación de ${item.rating} estrellas`}
              >
                {[...Array(item.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="text-[#D4AF37]"
                    fill="currentColor"
                  />
                ))}
              </div>

              <blockquote className="flex-grow mb-8">
                <p className="text-gray-600 italic leading-relaxed text-lg">
                  &ldquo;{item.text}&rdquo;
                </p>
              </blockquote>

              <footer className="flex items-center gap-4 pt-6 border-t border-gray-50 group-hover:border-[#D4AF37]/20 transition-colors">
                <div
                  className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-[#D4AF37]"
                  aria-hidden="true"
                >
                  <span className="font-serif font-bold italic">
                    {item.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <cite className="not-italic font-bold text-xs uppercase tracking-[0.2em] text-gray-900">
                    {item.name}
                  </cite>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">
                    {item.city}
                  </p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
