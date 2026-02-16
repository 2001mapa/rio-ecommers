"use client";

import { useState, useEffect } from "react";
// Importamos el componente de imagen optimizada
import Image from "next/image";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import NewsletterModal from "../components/NewsletterModal";
import CookieBanner from "../components/CookieBanner";
import ProductModal from "../components/ProductModal";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import { createClient } from "../lib/supabase";
import { Search, Loader2, ChevronRight } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // --- LÓGICA DEL CARRUSEL (Mantenida 100%) ---
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    "/images/carousel/Slide-1.png",
    "/images/carousel/Slide-2.png",
    "/images/carousel/Slide-3.png",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === heroImages.length - 1 ? 0 : prev + 1,
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);
  // ---------------------------

  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todas" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenProduct = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const categories = [
    "Todas",
    "Cadenas",
    "Pulseras",
    "Tobilleras",
    "Anillos",
    "Earcuff",
    "Topos",
    "Candongas",
    "Estuches",
    "Bolsos",
    "Brazaletes",
    "Relojes",
    "Collares",
  ];

  return (
    <main className="min-h-screen bg-white selection:bg-[#FFD700] selection:text-black">
      <Navbar />

      <NewsletterModal />
      <CookieBanner />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
      />

      {/* --- HERO BANNER (CARRUSEL OPTIMIZADO) --- */}
      <section className="container mx-auto px-4 md:px-12 pt-6">
        <div className="relative h-[500px] w-full overflow-hidden rounded-3xl shadow-sm bg-gray-100">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={img}
                alt={`Colección Rio - Slide ${index + 1}`}
                fill
                priority={index === 0} // Prioriza la carga de la primera imagen del banner
                className="object-cover object-center brightness-[0.85]"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          ))}

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10 animate-in fade-in zoom-in duration-1000">
            <h2 className="mb-4 text-xs font-bold tracking-[0.3em] text-white uppercase opacity-90 drop-shadow-md">
              Nueva Colección 2026
            </h2>
            <h1 className="mb-8 font-serif text-5xl md:text-7xl text-white tracking-wide drop-shadow-lg">
              JOYAS QUE CONECTAN <br />{" "}
              <span className="italic font-light">CON TU HISTORIA</span>
            </h1>
            <button
              onClick={() =>
                document
                  .getElementById("catalogo") // Corregido: Ahora coincide con el ID de la sección abajo
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="border border-white bg-white/10 backdrop-blur-md px-10 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-black rounded-full"
            >
              Ver Catálogo
            </button>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white"
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- CATEGORÍAS (Lógica mantenida) --- */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm mt-8">
        <div className="container mx-auto px-4 md:px-12 relative group">
          <div className="flex justify-start md:justify-center gap-8 overflow-x-auto py-6 no-scrollbar pr-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "text-black border-b-2 border-black pb-1"
                    : "text-gray-400 hover:text-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/90 to-transparent flex items-center justify-end pr-4 pointer-events-none md:hidden">
            <ChevronRight className="text-gray-400 animate-pulse" size={20} />
          </div>
        </div>
      </div>

      {/* --- CATÁLOGO --- */}
      <div id="catalogo" className="container mx-auto px-4 md:px-12 py-12">
        <div className="mb-10 flex justify-center md:justify-end">
          <div className="relative w-full max-w-sm md:max-w-xs transition-all duration-300 bg-gray-100 rounded-full md:bg-transparent md:rounded-none border-transparent md:border-b md:border-gray-300 md:focus-within:border-black">
            <Search className="absolute h-4 w-4 text-gray-400 left-4 top-1/2 -translate-y-1/2 md:left-0 md:top-2 md:translate-y-0" />
            <input
              type="text"
              placeholder="BUSCAR JOYAS..."
              className="w-full bg-transparent font-bold uppercase tracking-wide text-gray-900 placeholder:text-gray-400 focus:outline-none py-3 pl-12 pr-4 text-sm md:py-2 md:pl-6 md:pr-0 md:text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin h-8 w-8 text-[#FFD700]" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 transition-colors duration-300"
                >
                  <ProductCard
                    product={product}
                    onClick={() => handleOpenProduct(product)}
                  />
                </div>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-serif text-xl italic">
                  "No encontramos coincidencias"
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Todas");
                  }}
                  className="mt-4 text-xs font-bold uppercase tracking-widest border-b border-black pb-1"
                >
                  Ver todo el catálogo
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* --- INSTAGRAM (OPTIMIZADO CON LAZY LOADING) --- */}
      <section className="bg-[#DEB887] py-20">
        <div className="container mx-auto px-4 md:px-12 text-center">
          <a
            href="https://www.instagram.com/riocolombia?igsh=MWJtZDhwYzgwaXRhaQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block group"
          >
            <h3 className="mb-4 font-serif text-2xl md:text-3xl text-gray-900 group-hover:text-[#FFD700] transition-colors">
              #RioColombia
            </h3>
          </a>
          <p className="mb-10 text-xs font-bold tracking-widest text-white/90 uppercase">
            Síguenos en Instagram para inspiración diaria
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Post 1 y 2 */}
            <div className="relative h-80 md:h-[450px] w-full rounded-3xl overflow-hidden shadow-sm bg-white border border-white group/container">
              <a
                href="https://www.instagram.com/riocolombia?igsh=MWJtZDhwYzgwaXRhaQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-20 transition-all duration-500 ease-out origin-top-left hover:scale-[1.15] hover:z-30 hover:shadow-2xl"
                style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
              >
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 flex items-start justify-start p-10">
                  <span className="text-white font-bold text-xs tracking-widest uppercase border-b border-white pb-1">
                    Ver Post
                  </span>
                </div>
                <div className="relative w-full h-full bg-white pr-1 pb-1">
                  <Image
                    src="/rio-insta-1.jpg"
                    alt="Instagram 1"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>
              </a>
              <a
                href="https://www.instagram.com/riocolombia?igsh=MWJtZDhwYzgwaXRhaQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 transition-all duration-500 ease-out origin-bottom-right hover:scale-[1.15] hover:z-30 hover:shadow-2xl"
                style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
              >
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 flex items-end justify-end p-10">
                  <span className="text-white font-bold text-xs tracking-widest uppercase border-b border-white pb-1">
                    Ver Post
                  </span>
                </div>
                <div className="relative w-full h-full bg-white pl-1 pt-1">
                  <Image
                    src="/rio-insta-2.jpg"
                    alt="Instagram 2"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>
              </a>
            </div>

            {/* Post 3 y 4 */}
            <div className="relative h-80 md:h-[450px] w-full rounded-3xl overflow-hidden shadow-sm bg-white border border-white group/container">
              <a
                href="https://www.instagram.com/riocolombia?igsh=MWJtZDhwYzgwaXRhaQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-20 transition-all duration-500 ease-out origin-top-left hover:scale-[1.15] hover:z-30 hover:shadow-2xl"
                style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
              >
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 flex items-start justify-start p-10">
                  <span className="text-white font-bold text-xs tracking-widest uppercase border-b border-white pb-1">
                    Ver Post
                  </span>
                </div>
                <div className="relative w-full h-full bg-white pr-1 pb-1">
                  <Image
                    src="/rio-insta-3.jpg"
                    alt="Instagram 3"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>
              </a>
              <a
                href="https://www.instagram.com/riocolombia?igsh=MWJtZDhwYzgwaXRhaQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 transition-all duration-500 ease-out origin-bottom-right hover:scale-[1.15] hover:z-30 hover:shadow-2xl"
                style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
              >
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 flex items-end justify-end p-10">
                  <span className="text-white font-bold text-xs tracking-widest uppercase border-b border-white pb-1">
                    Ver Post
                  </span>
                </div>
                <div className="relative w-full h-full bg-white pl-1 pt-1">
                  <Image
                    src="/rio-insta-4.jpg"
                    alt="Instagram 4"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
      <Testimonials />
      <Footer />
    </main>
  );
}
