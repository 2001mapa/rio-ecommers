export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  material: string;
  category: string;
  image_url: string | null;
  stock: number;
  // Agregado para tipar las opciones disponibles desde la DB
  colors?: string[];
  sizes?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  // IMPORTANTE: Agregados para que Supabase guarde qué variante compró el cliente
  selectedColor?: string;
  selectedSize?: string;
}

export interface OrderDetails {
  customer: {
    name: string;
    id_number: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  items: CartItem[];
  financials: {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  };
  // Agregado para control de estado en Supabase
  status?: 'pending' | 'completed' | 'cancelled';
  created_at?: string;
}