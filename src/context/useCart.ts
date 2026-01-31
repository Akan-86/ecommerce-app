"use client";

import { createContext, useContext, useState } from "react";
import type { Product } from "@/lib/types";

type CartItem = Product & { quantity: number };

type CartContextType = {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: number;
  getStripeItems: () => { price: string; quantity: number }[];
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clear = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getStripeItems = () =>
    items.map((item) => ({
      price: item.stripePriceId,
      quantity: item.quantity,
    }));

  return (
    <CartContext.Provider value={{ items, add, remove, clear, total, getStripeItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}