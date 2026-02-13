"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../lib/supabase";
import { Lock, Mail, ArrowRight, Loader2, Home } from "lucide-react";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  // Memorizamos el cliente para evitar recrearlo
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace("/admin/dashboard");
      }
    };
    checkSession();
  }, [router, supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("Login Error:", error.message);
      setErrorMsg("Credenciales incorrectas o error de conexión.");
      setIsLoading(false);
    }
  };

  const inputClasses =
    "block w-full rounded-lg border border-gray-300 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-black sm:text-sm transition-all";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-100">
        <header className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-inner">
            <Lock size={32} />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
            Acceso Administrativo
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Panel de control RIO COLOMBIA
          </p>
        </header>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={inputClasses}
                placeholder="usuario@admin.com"
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Contraseña"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100 text-center animate-in fade-in slide-in-from-top-1">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-lg bg-black px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <span className="flex items-center gap-2">
                  Ingresar al Panel <ArrowRight size={16} />
                </span>
              )}
            </button>

            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-black transition-all"
            >
              <Home size={16} />
              Volver al Inicio
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
