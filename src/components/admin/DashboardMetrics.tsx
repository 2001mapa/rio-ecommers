"use client";

import React, { useMemo } from "react"; // ✅ Añadido useMemo para optimización
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatPrice } from "../../lib/utils";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// ✅ Definimos interfaces más precisas para mejor soporte de TypeScript
interface DashboardMetricsProps {
  orders: any[];
  lowStockProducts?: any[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function DashboardMetrics({
  orders,
  lowStockProducts = [],
}: DashboardMetricsProps) {
  // --- OPTIMIZACIÓN: Cálculos memorizados ---
  // Solo se recalculan si el array de 'orders' cambia
  const metrics = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== "Cancelado");

    // 1. Cálculos generales
    const totalSales = validOrders.reduce(
      (acc, order) => acc + (order.total_value || 0),
      0,
    );
    const totalOrdersCount = validOrders.length;
    const averageTicket =
      totalOrdersCount > 0 ? totalSales / totalOrdersCount : 0;

    // 2. Productos más vendidos
    const productCount: Record<string, number> = {};
    validOrders.forEach((order) => {
      order.products?.forEach((prod: any) => {
        productCount[prod.name] =
          (productCount[prod.name] || 0) + prod.quantity;
      });
    });

    const topProducts = Object.entries(productCount)
      .map(([name, cantidad]) => ({ name, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    // 3. Ciudades Top
    const cityCount: Record<string, number> = {};
    validOrders.forEach((order) => {
      const city = order.customer_info?.city || "Desconocida";
      const cityName =
        city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
      cityCount[cityName] = (cityCount[cityName] || 0) + 1;
    });

    const topCities = Object.entries(cityCount)
      .map(([name, pedidos]) => ({ name, pedidos }))
      .sort((a, b) => b.pedidos - a.pedidos)
      .slice(0, 5);

    return {
      totalSales,
      totalOrdersCount,
      averageTicket,
      topProducts,
      topCities,
    };
  }, [orders]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* TARJETAS DE RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ventas */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={80} className="text-[#D4AF37]" />
          </div>
          <div className="z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Ventas Reales
            </p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {formatPrice(metrics.totalSales)}
            </h3>
          </div>
          <p className="text-[10px] text-green-600 font-black bg-green-50 w-fit px-2 py-0.5 rounded-full uppercase tracking-tighter">
            Sin cancelados
          </p>
        </div>

        {/* Pedidos */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShoppingBag size={80} className="text-blue-500" />
          </div>
          <div className="z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Pedidos Exitosos
            </p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {metrics.totalOrdersCount}
            </h3>
          </div>
          <p className="text-xs text-gray-400">Órdenes procesadas</p>
        </div>

        {/* Ticket Promedio */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Package size={80} className="text-purple-500" />
          </div>
          <div className="z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Ticket Promedio
            </p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {formatPrice(metrics.averageTicket)}
            </h3>
          </div>
          <p className="text-xs text-gray-400">Promedio por cliente</p>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Productos Top */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-gray-900 flex items-center gap-2">
            🏆 Productos Más Vendidos
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.topProducts}
                layout="vertical"
                margin={{ left: 0, right: 30 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fontSize: 10, fontWeight: 600 }}
                  interval={0}
                />
                <Tooltip
                  cursor={{ fill: "#F9F8F6" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="cantidad"
                  fill="#D4AF37"
                  radius={[0, 4, 4, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ciudades Top */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-gray-900">
            📍 Ciudades Top
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.topCities}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="pedidos"
                >
                  {metrics.topCities.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ALERTA DE STOCK BAJO */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-lg text-gray-900 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} /> Alertas de
            Stock Bajo
          </h3>
          <span className="bg-red-50 text-red-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {lowStockProducts.length} críticos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lowStockProducts.length === 0 ? (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center opacity-40">
              <Package size={48} className="mb-3 text-gray-300" />
              <p className="text-sm font-bold text-gray-500">
                ¡Todo en orden! Inventario saludable.
              </p>
            </div>
          ) : (
            lowStockProducts.slice(0, 6).map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#FDFDFD] border border-gray-50 hover:border-red-100 transition-all hover:shadow-md group"
              >
                <div className="h-12 w-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      className="h-full w-full object-cover"
                      alt={product.name}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-300">
                      <Package size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate uppercase tracking-tighter italic">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                    DISPONIBLES:{" "}
                    <span className="text-sm font-black">{product.stock}</span>
                  </p>
                </div>
                <Link
                  href="/admin/products"
                  className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm"
                >
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
