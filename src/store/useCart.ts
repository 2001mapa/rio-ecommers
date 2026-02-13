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
}

interface CartStore {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  // Cambiamos las firmas para identificar la variante exacta
  removeItem: (id: string, color?: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, color?: string, size?: string) => void;
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

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'rio-cart-storage', // Persistencia en LocalStorage
    }
  )
);