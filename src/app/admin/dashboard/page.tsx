"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase";
import { formatPrice } from "../../../lib/utils";
import {
  LogOut,
  Package,
  Search,
  Eye,
  Trash2,
  Calendar,
  BarChart3,
  List,
  ArrowLeft,
  AlertTriangle,
  Lock,
  Settings,
} from "lucide-react";
import DashboardMetrics from "../../../components/admin/DashboardMetrics";
import { toast } from "sonner";

export default function AdminDashboard() {
  // --- ESTADOS DE DATOS ---
  const [orders, setOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE UI ---
  const [viewMode, setViewMode] = useState<"table" | "metrics">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");

  // --- ESTADOS DE CONFIGURACIÓN DE SEGURIDAD ---
  const [isChangingKey, setIsChangingKey] = useState(false);
  const [oldKeyCheck, setOldKeyCheck] = useState("");
  const [newKey, setNewKey] = useState("");

  // --- ESTADOS DEL MODAL DE ELIMINACIÓN ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState("");

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) router.replace("/admin");
      else fetchData();
    };
    checkSession();
  }, [router, supabase.auth]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      setOrders(ordersData || []);

      const { data: productsData } = await supabase
        .from("products")
        .select("id, name, stock, image_url")
        .lt("stock", 5)
        .order("stock", { ascending: true });
      setLowStockProducts(productsData || []);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin");
  };

  const handleChangePassword = async () => {
    try {
      const { data: config } = await supabase
        .from("admin_config")
        .select("value")
        .eq("key", "delete_password")
        .single();

      if (oldKeyCheck !== config?.value) {
        toast.error("La clave actual es incorrecta.");
        return;
      }

      if (newKey.length < 4) {
        toast.error("Mínimo 4 caracteres");
        return;
      }

      const { error } = await supabase
        .from("admin_config")
        .update({ value: newKey })
        .eq("key", "delete_password");

      if (error) throw error;

      toast.success("¡Clave Maestra actualizada!");
      setOldKeyCheck("");
      setNewKey("");
      setIsChangingKey(false);
    } catch (error) {
      toast.error("No se pudo actualizar");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const previousOrders = [...orders];
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );

    try {
      if (newStatus === "Cancelado") {
        const { error } = await supabase.rpc("handle_order_cancellation", {
          order_id_param: orderId,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("orders")
          .update({ status: newStatus })
          .eq("id", orderId);
        if (error) throw error;
      }
      fetchData();
      toast.success("Estado actualizado");
    } catch (error: any) {
      toast.error("Error: " + error.message);
      setOrders(previousOrders);
    }
  };

  const requestDelete = (orderId: string) => {
    setOrderToDelete(orderId);
    setSecretKey("");
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const { data: config } = await supabase
        .from("admin_config")
        .select("value")
        .eq("key", "delete_password")
        .single();

      if (secretKey === config?.value) {
        if (!orderToDelete) return;
        const { error } = await supabase
          .from("orders")
          .delete()
          .eq("id", orderToDelete);
        if (error) throw error;

        setOrders(orders.filter((o) => o.id !== orderToDelete));
        toast.success("Pedido eliminado");
        setIsDeleteModalOpen(false);
      } else {
        toast.error("⛔ Clave Maestra incorrecta.");
      }
    } catch (error) {
      toast.error("Error al borrar");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const info = order.customer_info || {};
    const matchesText =
      (info.name || "").toLowerCase().includes(term) ||
      (info.id_number || "").toLowerCase().includes(term) ||
      (info.city || "").toLowerCase().includes(term);

    const orderDate = new Date(order.created_at);
    const matchesMonth =
      selectedMonth === "all" ||
      orderDate.getMonth().toString() === selectedMonth;
    return matchesText && matchesMonth;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "bg-green-100 text-green-800 border-green-200";
      case "Enviado":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Cancelado":
        return "bg-red-50 text-red-800 border-red-100";
      default:
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#FCFCFA]">
        <div className="animate-spin h-8 w-8 border-2 border-[#D4AF37] border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FCFCFA] pb-20 relative text-gray-900 antialiased">
      {/* 1. NAVEGACIÓN */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="text-gray-400 hover:text-black transition"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-serif text-2xl font-light tracking-tighter italic">
              Rio{" "}
              <span className="font-bold not-italic text-[#D4AF37]">Admin</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/products"
              className="flex items-center gap-2 rounded-full bg-black px-3 sm:px-5 py-2 text-[10px] sm:text-xs font-bold text-white hover:bg-[#D4AF37] transition uppercase tracking-widest"
            >
              <Package size={14} />
              <span className="hidden xs:inline">Inventario</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-gray-200 px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold text-gray-600 hover:bg-gray-50 transition uppercase tracking-widest"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4 sm:p-6 md:p-10">
        {/* 2. CABECERA */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-1">
              Panel de Control
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Gestión de pedidos y clientes.
            </p>
          </div>
          <div className="flex bg-white p-1 rounded-full border border-gray-200 shadow-sm self-start lg:self-center">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 text-[10px] sm:text-xs font-bold uppercase rounded-full transition-all ${viewMode === "table" ? "bg-black text-white shadow-md" : "text-gray-400"}`}
            >
              <List size={14} /> Pedidos
            </button>
            <button
              onClick={() => setViewMode("metrics")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 text-[10px] sm:text-xs font-bold uppercase rounded-full transition-all ${viewMode === "metrics" ? "bg-black text-white shadow-md" : "text-gray-400"}`}
            >
              <BarChart3 size={14} /> Métricas
            </button>
          </div>
        </div>

        {/* 3. FILTROS */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative w-full md:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
              <Calendar size={18} />
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="block w-full appearance-none rounded-full border border-gray-200 bg-white py-3 pl-12 pr-8 text-sm font-bold outline-none focus:ring-1 focus:ring-black"
            >
              <option value="all">📅 Todos los meses</option>
              {[
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre",
              ].map((m, i) => (
                <option key={m} value={i.toString()}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsChangingKey(!isChangingKey)}
            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all bg-gray-50 px-4 py-3 rounded-full border border-gray-100"
          >
            <Settings
              size={14}
              className={isChangingKey ? "animate-spin" : ""}
            />
            {isChangingKey ? "Cerrar Ajustes" : "Configurar Clave"}
          </button>
        </div>

        {/* 4. PANEL CLAVE */}
        {isChangingKey && (
          <div className="mb-8 p-4 sm:p-6 bg-white rounded-2xl border-2 border-dashed border-gray-200 animate-in slide-in-from-top-4 duration-300">
            <div className="max-w-md">
              <h4 className="text-xs sm:text-sm font-black uppercase mb-1">
                Seguridad: Cambiar Clave
              </h4>
              <p className="text-[10px] sm:text-xs text-gray-500 mb-4">
                Ingresa la clave actual para validar el cambio.
              </p>
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Clave ACTUAL..."
                  value={oldKeyCheck}
                  onChange={(e) => setOldKeyCheck(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-black"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="NUEVA clave..."
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="flex-1 p-3 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-black"
                  />
                  <button
                    onClick={handleChangePassword}
                    className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase hover:bg-green-600 transition-all"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. VISTA DE DATOS */}
        {viewMode === "table" ? (
          <>
            <div className="mb-6 relative w-full max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar cliente, cédula o ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-full border border-gray-200 py-3 pl-12 pr-4 text-sm font-bold outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="rounded-2xl bg-white shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[700px]">
                  <thead className="bg-[#FAFAFA] text-[10px] sm:text-xs uppercase text-gray-400 font-bold border-b">
                    <tr>
                      <th className="px-6 py-4">Fecha</th>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-bold">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono">
                            #{order.id.slice(0, 8)}
                          </p>
                        </td>
                        <td className="px-6 py-4 min-w-[200px]">
                          <p className="font-bold text-gray-900 leading-tight mb-0.5">
                            {order.customer_info?.name}
                          </p>
                          <div className="text-[10px] sm:text-xs text-gray-500">
                            CC: {order.customer_info?.id_number} •{" "}
                            {order.customer_info?.city}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase border cursor-pointer outline-none whitespace-nowrap ${getStatusColor(order.status)}`}
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Completado">Completado</option>
                            <option value="Enviado">Enviado</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 font-black text-base whitespace-nowrap">
                          {formatPrice(order.total_value)}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                          <Link
                            href={`/order/${order.id}`}
                            target="_blank"
                            className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-400 hover:bg-black hover:text-white transition"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => requestDelete(order.id)}
                            className="inline-flex items-center justify-center rounded-lg border border-red-100 p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DashboardMetrics
              orders={filteredOrders}
              lowStockProducts={lowStockProducts}
            />
          </div>
        )}
      </main>

      {/* 6. MODAL ELIMINAR */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
            >
              <div className="bg-red-50 p-6 flex flex-col items-center text-center border-b border-red-100">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-3 text-red-600">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-serif font-bold text-red-900">
                  Eliminar Pedido
                </h3>
                <p className="text-sm text-red-600 mt-1">
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="p-6">
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 text-center">
                  Clave Maestra Requerida
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    autoFocus
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-sm focus:border-red-500 outline-none"
                    placeholder="Escribe la clave..."
                  />
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 py-3 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-lg bg-red-600 text-sm font-bold text-white hover:bg-red-700 shadow-lg transition"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
