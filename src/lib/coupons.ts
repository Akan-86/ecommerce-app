import type { Coupon, CouponValidateItem } from "@/types/coupon";

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function computeEligibleSubtotal(
  items: CouponValidateItem[],
  coupon?: Partial<Coupon>
) {
  if (!coupon) {
    return round2(items.reduce((s, it) => s + it.price * it.qty, 0));
  }

  const productScope = new Set<string>(coupon.scopes?.products || []);
  const categoryScope = new Set<string>(coupon.scopes?.categories || []);

  const eligible = items.filter((it) => {
    const productMatch = productScope.size ? productScope.has(it.id) : true;
    const categoryMatch = categoryScope.size
      ? it.category
        ? categoryScope.has(it.category)
        : false
      : true;
    return productMatch && categoryMatch;
  });

  return round2(eligible.reduce((s, it) => s + it.price * it.qty, 0));
}

export function computeDiscountFromCoupon(
  coupon: Partial<Coupon> | null | undefined,
  eligibleSubtotal: number
) {
  if (!coupon) return 0;
  const type = coupon.type;
  const value = Number(coupon.value || 0);

  let discount = 0;
  if (type === "percent") {
    discount = round2((eligibleSubtotal * value) / 100);
  } else if (type === "fixed") {
    discount = Math.min(value, eligibleSubtotal);
    discount = round2(discount);
  }
  return Math.max(0, discount);
}

export function applyCouponToTotals(
  subtotal: number,
  shipping: number,
  tax: number,
  discount: number
) {
  const newSubtotal = round2(Math.max(0, subtotal - discount));
  const total = round2(Math.max(0, newSubtotal + shipping + tax));
  return {
    subtotal: round2(subtotal),
    discount: round2(discount),
    newSubtotal,
    shipping: round2(shipping),
    tax: round2(tax),
    total,
  };
}
