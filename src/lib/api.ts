import type { Product, ProductsResponse } from "./types";

const BASE = "https://dummyjson.com";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  const data: ProductsResponse = await res.json();
  return data.products;
}

export async function fetchProduct(id: string | number): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}
