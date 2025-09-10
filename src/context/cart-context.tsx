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
};

type Action =
  | { type: "ADD"; payload: Product }
  | { type: "REMOVE_ONE"; payload: number }
  | { type: "REMOVE_ALL"; payload: number }
  | { type: "CLEAR" };

const initialState: State = { items: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
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
        };
      }
      return {
        items: [...state.items, { product: action.payload, quantity: 1 }],
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
        };
      }
      return {
        items: state.items.filter((i) => i.product.id !== action.payload),
      };
    }
    case "REMOVE_ALL": {
      return {
        items: state.items.filter((i) => i.product.id !== action.payload),
      };
    }
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  add: (p: Product) => void;
  removeOne: (id: number) => void;
  removeAll: (id: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) {
        const parsed: State = JSON.parse(raw);

        if (Array.isArray(parsed.items)) {
          (parsed.items as any[]).forEach((i) => {
            if (typeof i.quantity !== "number") throw new Error("bad data");
          });

          dispatch({ type: "CLEAR" });
          parsed.items.forEach((i) => {
            for (let k = 0; k < i.quantity; k++) {
              dispatch({ type: "ADD", payload: i.product });
            }
          });
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(state));
    } catch {}
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const total = state.items.reduce(
      (sum, i) => sum + i.quantity * i.product.price,
      0
    );
    return {
      items: state.items,
      add: (p) => dispatch({ type: "ADD", payload: p }),
      removeOne: (id) => dispatch({ type: "REMOVE_ONE", payload: id }),
      removeAll: (id) => dispatch({ type: "REMOVE_ALL", payload: id }),
      clear: () => dispatch({ type: "CLEAR" }),
      count,
      total,
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
