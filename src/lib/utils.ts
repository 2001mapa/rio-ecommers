import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Optimización de estilos:
 * Combina clases de Tailwind de forma eficiente evitando conflictos.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Optimización de Rendimiento (Memoización):
 * Creamos el formateador fuera de la función para que se instancie UNA SOLA VEZ.
 * Esto ahorra ciclos de CPU al renderizar listas largas de productos.
 */
const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formateador de moneda colombiana (COP)
 * @param price - Valor numérico a formatear
 * @returns String formateado (ej: $ 120.000)
 */
export const formatPrice = (price: number) => {
  // Verificación de seguridad para evitar errores de renderizado
  if (typeof price !== 'number') return '$ 0';
  
  return formatter.format(price);
};