"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase";
import { formatPrice } from "../../../lib/utils";
import {
  LogOut,
  Plus,
  Trash2,
  Image as ImageIcon,
  ArrowLeft,
  Loader2,
  Save,
  CloudUpload,
  X,
  Package,
  Edit,
  RefreshCw,
  AlertTriangle,
  Search,
} from "lucide-react";
import { toast } from "sonner";

// Constantes extraídas para evitar re-declaraciones
const CATEGORIES = [
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
  "Conjuntos",
];

const MATERIALS = ["Acero", "Rodio", "Cuero", "Acero Inoxidable"];

const INITIAL_FORM_STATE = {
  name: "",
  code: "",
  description: "",
  price: "",
  material: "",
  category: "",
  stock: "",
  colors: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  // Fetch de productos optimizado
  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error:", error);
      toast.error("Error de conexión");
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/admin");
      } else {
        fetchProducts();
      }
    };
    checkSession();
  }, [router, supabase, fetchProducts]);

  // Limpieza de memoria para previsualización de imágenes
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin");
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      code: product.code || "",
      description: product.description || "",
      price: product.price.toString(),
      material: product.material,
      category: product.category,
      stock: product.stock.toString(),
      colors: product.colors || "",
    });
    setImagePreview(product.image_url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setFormData(INITIAL_FORM_STATE);
    handleRemoveImage();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Validación de código duplicado
      if (formData.code) {
        const { data: existingProduct } = await supabase
          .from("products")
          .select("id, code")
          .eq("code", formData.code.trim())
          .maybeSingle();

        if (existingProduct && existingProduct.id !== editingId) {
          toast.error(`La referencia "${formData.code}" ya existe.`);
          setIsSubmitting(false);
          return;
        }
      }

      let finalImageUrl = imagePreview;
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, imageFile);
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("products").getPublicUrl(fileName);
        finalImageUrl = publicUrl;
      }

      const productData = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        description: formData.description,
        price: Number(formData.price),
        material: formData.material,
        category: formData.category,
        stock: Number(formData.stock),
        colors: formData.colors,
        image_url: finalImageUrl,
      };

      const { error } = editingId
        ? await supabase
            .from("products")
            .update(productData)
            .eq("id", editingId)
        : await supabase.from("products").insert(productData);

      if (error) throw error;

      toast.success(editingId ? "Producto actualizado" : "¡Joya agregada!");
      handleCancelEdit();
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productToDelete);

    if (error) {
      toast.error("Error al eliminar");
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete));
      toast.success("Eliminado correctamente");
      setIsDeleteModalOpen(false);
    }
  };

  // Memorizar el filtrado para evitar re-cálculos costosos
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.code?.toLowerCase().includes(term),
    );
  }, [products, searchTerm]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#FDFDFD]">
        <Loader2 className="animate-spin text-[#C5A028]" size={40} />
      </div>
    );

  const inputStyle =
    "w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all duration-200 font-medium";
  const labelStyle =
    "block text-[11px] font-black uppercase text-gray-400 mb-1.5 tracking-widest ml-1";

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#1A1A1A]">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/admin/dashboard"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={22} className="text-gray-600" />
            </Link>
            <h1 className="font-serif text-2xl font-light tracking-tighter italic">
              Rio{" "}
              <span className="font-bold not-italic text-[#D4AF37]">
                Inventario
              </span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
          >
            Cerrar Sesión{" "}
            <LogOut
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </nav>

      <main className="container mx-auto p-6 lg:p-12">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-4">
            <div
              className={`bg-white rounded-3xl p-8 shadow-2xl shadow-gray-200/50 border border-gray-100 transition-all duration-500 ${editingId ? "ring-2 ring-[#D4AF37]" : ""}`}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-3">
                  {editingId ? (
                    <RefreshCw className="text-[#D4AF37]" />
                  ) : (
                    <Package className="text-[#D4AF37]" />
                  )}
                  {editingId ? "Editar Joya" : "Nueva Pieza"}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Completa los detalles del inventario.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className={labelStyle}>Imagen Principal</label>
                  {!imagePreview ? (
                    <div className="relative group flex aspect-square w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:bg-white hover:border-[#D4AF37] overflow-hidden">
                      <CloudUpload
                        size={32}
                        className="text-gray-300 group-hover:text-[#D4AF37] group-hover:-translate-y-1 transition-all"
                      />
                      <span className="mt-3 text-[10px] font-bold uppercase tracking-tighter text-gray-400">
                        Click para subir
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        required={!editingId}
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-inner group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur shadow-lg rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Código REF</label>
                    <input
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      type="text"
                      className={inputStyle}
                      placeholder="REF-001"
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Categoría</label>
                    <select
                      required
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={inputStyle}
                    >
                      <option value="">Elegir...</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Nombre del Producto</label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text"
                    className={inputStyle}
                    placeholder="Nombre de la pieza..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Precio ($)</label>
                    <input
                      required
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      type="number"
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Stock</label>
                    <input
                      required
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      type="number"
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Material y Colores</label>
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      required
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      className={inputStyle}
                    >
                      <option value="">Material...</option>
                      {MATERIALS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <input
                      name="colors"
                      value={formData.colors}
                      onChange={handleInputChange}
                      type="text"
                      className={inputStyle}
                      placeholder="Colores..."
                    />
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : editingId ? (
                      <>
                        <Save size={18} /> Actualizar Pieza
                      </>
                    ) : (
                      <>
                        <Plus size={18} /> Publicar Joya
                      </>
                    )}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="w-full py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      Cancelar y volver
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-serif font-bold">Colección</h3>
                <p className="text-gray-400 text-xs">
                  Gestiona tus piezas exclusivas ({filteredProducts.length})
                </p>
              </div>
              <div className="relative group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Buscar por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-6 py-2 bg-white border border-gray-200 rounded-full text-sm focus:ring-4 focus:ring-[#D4AF37]/10 focus:border-[#D4AF37] outline-none w-full md:w-64 shadow-sm transition-all"
                />
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200">
                <Package className="text-gray-300 mx-auto mb-4" size={28} />
                <h4 className="text-lg font-serif font-bold text-gray-900">
                  No hay resultados
                </h4>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-200">
                          <ImageIcon size={24} />
                        </div>
                      )}
                      <div
                        className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm ${product.stock > 0 ? "bg-white/90 text-gray-900" : "bg-red-500 text-white"}`}
                      >
                        {product.stock > 0
                          ? `Stock: ${product.stock}`
                          : "Agotado"}
                      </div>
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-white p-2 rounded-full text-gray-900 hover:bg-[#D4AF37] hover:text-white transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setProductToDelete(product.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="bg-white p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[8px] font-black uppercase tracking-wider text-[#D4AF37]">
                          {product.category}
                        </span>
                        <span className="text-[8px] font-bold text-gray-400">
                          #{product.code}
                        </span>
                      </div>
                      <h4 className="font-serif text-xs font-bold text-gray-900 line-clamp-1 italic mb-2">
                        {product.name}
                      </h4>
                      <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-center text-gray-900">
              ¿Retirar de Colección?
            </h3>
            <p className="text-center text-gray-500 mt-2">
              Esta pieza dejará de estar disponible de forma permanente.
            </p>
            <div className="mt-10 flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 hover:bg-gray-50 rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-4 bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
