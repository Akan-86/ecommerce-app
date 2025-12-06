export type CouponType = "percent" | "fixed";

export type CouponScope = {
  products?: string[]; // product IDs eligible for the coupon
  categories?: string[]; // category names/IDs eligible for the coupon
};

export type Coupon = {
  id: string;
  code: string; // unique, uppercase recommended
  type: CouponType; // "percent" or "fixed"
  value: number; // percent: 0–100, fixed: currency amount
  scopes?: CouponScope; // optional targeting rules
  startAt?: number; // ms timestamp (Date.now())
  endAt?: number; // ms timestamp
  minOrderTotal?: number; // minimum subtotal required to apply
  usageLimit?: number; // max times coupon can be used
  usageCount?: number; // current usage count
  active: boolean; // quick toggle
  createdAt?: number;
  updatedAt?: number;
};

// Lightweight request/response shapes

export type CouponValidateItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
  category?: string;
};

export type CouponValidateRequest = {
  code: string;
  items: CouponValidateItem[];
  subtotal: number;
};

export type CouponValidateResponse =
  | {
      valid: true;
      discount: number;
      breakdown: {
        code: string;
        type: CouponType;
        value: number;
        eligibleSubtotal: number;
      };
      couponId: string;
    }
  | {
      valid: false;
      reason:
        | "not_found"
        | "inactive"
        | "not_started"
        | "expired"
        | "limit_reached"
        | "min_total";
    };
