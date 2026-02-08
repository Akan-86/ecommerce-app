"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { Product } from "@/lib/types";

type CartItem = { product: Product; quantity: number };

type State = {
  items: CartItem[];
  lastAction?: { type: string; productId?: string };
};

type Action =
  | { type: "ADD"; payload: Product }
  | { type: "REMOVE_ONE"; payload: string }
  | { type: "REMOVE_ALL"; payload: string }
  | { type: "CLEAR" }
  | { type: "SET_QTY"; payload: { id: string; quantity: number } }
  | { type: "HYDRATE"; payload: CartItem[] };

const initialState: State = { items: [], lastAction: undefined };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE": {
      return { items: action.payload || [], lastAction: { type: "HYDRATE" } };
    }
    case "ADD": {
      const exists = state.items.find(
        (i) => i.product.id === action.payload.id
      );
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
          lastAction: { type: "ADD", productId: action.payload.id },
        };
      }
      return {
        items: [...state.items, { product: action.payload, quantity: 1 }],
        lastAction: { type: "ADD", productId: action.payload.id },
      };
    }
    case "REMOVE_ONE": {
      const found = state.items.find((i) => i.product.id === action.payload);
      if (!found) return state;
      if (found.quantity > 1) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.payload
              ? { ...i, quantity: i.quantity - 1 }
              : i
          ),
          lastAction: { type: "REMOVE_ONE", productId: action.payload },
        };
      }
      return {
        items: state.items.filter((i) => i.product.id !== action.payload),
        lastAction: { type: "REMOVE_ONE", productId: action.payload },
      };
    }
    case "REMOVE_ALL":
      return {
        items: state.items.filter((i) => i.product.id !== action.payload),
        lastAction: { type: "REMOVE_ALL", productId: action.payload },
      };
    case "CLEAR":
      return { items: [], lastAction: { type: "CLEAR" } };
    case "SET_QTY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          items: state.items.filter((i) => i.product.id !== id),
          lastAction: { type: "SET_QTY", productId: id },
        };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === id ? { ...i, quantity } : i
        ),
        lastAction: { type: "SET_QTY", productId: id },
      };
    }
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  add: (p: Product) => void;
  removeOne: (id: string) => void;
  removeAll: (id: string) => void;
  clear: () => void;
  clearCart: () => void;
  count: number;
  total: number;
  getStripeItems: () => {
    price_data: {
      currency: string;
      product_data: {
        name: string;
        description: string;
        images: string[];
        metadata: { productId: string };
      };
      unit_amount: number;
    };
    quantity: number;
  }[];
  updateQuantity: (id: string, quantity: number) => void;
  formatPrice: (price: number) => string;
  lastAction?: { type: string; productId?: string };
  displayItems: {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }[];
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) {
        const parsed: { items: CartItem[] } = JSON.parse(raw);
        if (Array.isArray(parsed.items)) {
          dispatch({ type: "HYDRATE", payload: parsed.items });
        }
      }
    } catch {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify({ items: state.items }));
    } catch {}
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const total = state.items.reduce(
      (sum, i) => sum + i.quantity * i.product.price,
      0
    );

    const displayItems = state.items.map((i) => ({
      id: i.product.id,
      name: i.product.title || i.product.name || "",
      price: i.product.price,
      image: i.product.imageUrl || i.product.thumbnail || "/placeholder.png",
      quantity: i.quantity,
    }));

    function formatPrice(price: number) {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(price);
    }

    return {
      items: state.items,
      add: (p) => dispatch({ type: "ADD", payload: p }),
      removeOne: (id) => dispatch({ type: "REMOVE_ONE", payload: id }),
      removeAll: (id) => dispatch({ type: "REMOVE_ALL", payload: id }),
      clear: () => dispatch({ type: "CLEAR" }),
      clearCart: () => dispatch({ type: "CLEAR" }),
      count,
      total,
      getStripeItems: () =>
        state.items.map((i) => ({
          price_data: {
            currency: "eur",
            product_data: {
              name: i.product.title || i.product.name || "Product",
              description:
                i.product.description ||
                i.product.title ||
                i.product.name ||
                "Product",
              images: [
                i.product.imageUrl ||
                  i.product.thumbnail ||
                  "https://via.placeholder.com/400x400.png?text=Product",
              ],
              metadata: {
                productId: i.product.id, // 🔑 Firestore’daki ürün ID’si
              },
            },
            unit_amount: Math.round((Number(i.product.price) || 0) * 100),
          },
          quantity: i.quantity,
        })),
      updateQuantity: (id, quantity) =>
        dispatch({ type: "SET_QTY", payload: { id, quantity } }),
      formatPrice,
      lastAction: state.lastAction,
      displayItems,
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
