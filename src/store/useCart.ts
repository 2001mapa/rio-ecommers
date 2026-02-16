import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  category: string;
  selectedColor?: string;
  selectedSize?: string;
  // Añadimos estas dos para que el carrito conozca todas las opciones disponibles
  colors?: string[];
  sizes?: string[];
}

interface CartStore {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  removeItem: (id: string, color?: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, color?: string, size?: string) => void;
  // Nueva función para cambiar color o talla directamente
  updateVariant: (id: string, oldColor?: string, oldSize?: string, newColor?: string, newSize?: string) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (product) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex((item) => 
            item.id === product.id && 
            item.selectedColor === product.selectedColor && 
            item.selectedSize === product.selectedSize
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + (product.quantity || 1)
            };
            return { items: newItems };
          }

          return { items: [...state.items, { ...product, quantity: product.quantity || 1 }] };
        });
      },

      removeItem: (id, color, size) => {
        set((state) => ({
          items: state.items.filter((item) => 
            !(item.id === id && item.selectedColor === color && item.selectedSize === size)
          ),
        }));
      },

      updateQuantity: (id, quantity, color, size) => {
        set((state) => ({
          items: state.items.map((item) =>
            (item.id === id && item.selectedColor === color && item.selectedSize === size)
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }));
      },

      // Lógica para actualizar Color o Talla
      updateVariant: (id, oldColor, oldSize, newColor, newSize) => {
        set((state) => {
          // 1. Buscamos el item que queremos cambiar
          const currentItem = state.items.find(item => 
            item.id === id && item.selectedColor === oldColor && item.selectedSize === oldSize
          );

          if (!currentItem) return state;

          // 2. Revisamos si ya existe OTRO item con la NUEVA combinación
          const existingTargetIndex = state.items.findIndex(item => 
            item.id === id && item.selectedColor === newColor && item.selectedSize === newSize
          );

          // Si ya existe la combinación nueva, los fusionamos
          if (existingTargetIndex > -1 && 
              !(oldColor === newColor && oldSize === newSize)) {
            
            const filteredItems = state.items.filter(item => 
              !(item.id === id && item.selectedColor === oldColor && item.selectedSize === oldSize)
            );

            const newItems = [...filteredItems];
            newItems[existingTargetIndex] = {
              ...newItems[existingTargetIndex],
              quantity: newItems[existingTargetIndex].quantity + currentItem.quantity
            };

            return { items: newItems };
          }

          // Si es una combinación única, solo actualizamos las propiedades
          return {
            items: state.items.map((item) =>
              (item.id === id && item.selectedColor === oldColor && item.selectedSize === oldSize)
                ? { ...item, selectedColor: newColor, selectedSize: newSize }
                : item
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'rio-cart-storage',
    }
  )
);