export type Currency = "USD" | "EUR" | "TRY";

export type Product = {
  id: string;
  title: string;
  description: string;

  price: number;
  currency?: Currency;

  discountPercentage?: number;
  rating?: number;
  stock?: number;

  brand?: string;
  category?: string;

  thumbnail?: string;
  images?: string[];

  // UI normalized fields (VERY IMPORTANT for consistency)
  image?: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  currency: Currency;
  status: "pending" | "paid" | "failed";
  createdAt: string;
};

export type Coupon = {
  code: string;
  discountPercentage: number;
  expiresAt?: string;
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};
