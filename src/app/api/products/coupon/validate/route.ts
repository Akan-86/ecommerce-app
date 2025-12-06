import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  DocumentData,
} from "firebase/firestore";
import type {
  CouponValidateRequest,
  CouponValidateResponse,
} from "@/types/coupon";

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export async function GET() {
  try {
    const snap = await getDocs(collection(db, "coupons"));
    const coupons = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    return NextResponse.json(coupons);
  } catch (err) {
    console.error("GET /api/coupons error:", err);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as any;

    if (
      body?.code &&
      Array.isArray(body?.items) &&
      typeof body?.subtotal === "number"
    ) {
      const validateBody = body as CouponValidateRequest;
      const code = (validateBody.code || "").trim().toUpperCase();
      const items = Array.isArray(validateBody.items) ? validateBody.items : [];
      const subtotal =
        typeof validateBody.subtotal === "number" ? validateBody.subtotal : 0;

      if (!code || items.length === 0) {
        return NextResponse.json(
          { valid: false, reason: "not_found" } as CouponValidateResponse,
          { status: 400 }
        );
      }

      const q = query(collection(db, "coupons"), where("code", "==", code));
      const snap = await getDocs(q);
      if (snap.empty) {
        return NextResponse.json({
          valid: false,
          reason: "not_found",
        } as CouponValidateResponse);
      }

      const doc = snap.docs[0];
      const c = doc.data() as DocumentData;

      const now = Date.now();
      if (!c.active)
        return NextResponse.json({
          valid: false,
          reason: "inactive",
        } as CouponValidateResponse);
      if (c.startAt && now < c.startAt)
        return NextResponse.json({
          valid: false,
          reason: "not_started",
        } as CouponValidateResponse);
      if (c.endAt && now > c.endAt)
        return NextResponse.json({
          valid: false,
          reason: "expired",
        } as CouponValidateResponse);
      if (
        typeof c.usageLimit === "number" &&
        typeof c.usageCount === "number" &&
        c.usageCount >= c.usageLimit
      ) {
        return NextResponse.json({
          valid: false,
          reason: "limit_reached",
        } as CouponValidateResponse);
      }
      if (typeof c.minOrderTotal === "number" && subtotal < c.minOrderTotal) {
        return NextResponse.json({
          valid: false,
          reason: "min_total",
        } as CouponValidateResponse);
      }

      const productScope = new Set<string>(
        (c.scopes?.products as string[]) || []
      );
      const categoryScope = new Set<string>(
        (c.scopes?.categories as string[]) || []
      );

      const eligibleItems = items.filter((it) => {
        const productMatch = productScope.size ? productScope.has(it.id) : true;
        const categoryMatch = categoryScope.size
          ? it.category
            ? categoryScope.has(it.category)
            : false
          : true;
        return productMatch && categoryMatch;
      });

      const eligibleSubtotal = eligibleItems.reduce(
        (sum, it) => sum + it.price * it.qty,
        0
      );

      let discount = 0;
      if (c.type === "percent") {
        discount = round2((eligibleSubtotal * (Number(c.value) || 0)) / 100);
      } else if (c.type === "fixed") {
        discount = Math.min(Number(c.value) || 0, eligibleSubtotal);
        discount = round2(discount);
      }

      const applied = discount > 0;
      if (!applied) {
        return NextResponse.json({
          valid: false,
          reason: "not_found",
        } as CouponValidateResponse);
      }

      const result: CouponValidateResponse = {
        valid: true,
        discount,
        breakdown: {
          code: c.code,
          type: c.type,
          value: c.value,
          eligibleSubtotal: round2(eligibleSubtotal),
        },
        couponId: doc.id,
      };

      return NextResponse.json(result);
    }

    const payload = body as Partial<any>;
    if (
      !payload?.code ||
      !payload?.type ||
      typeof payload?.value !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing required fields: code, type, value" },
        { status: 400 }
      );
    }

    const code = String(payload.code).trim().toUpperCase();

    const q = query(collection(db, "coupons"), where("code", "==", code));
    const existing = await getDocs(q);
    if (!existing.empty) {
      return NextResponse.json(
        { error: "Coupon code already exists" },
        { status: 409 }
      );
    }

    const newCoupon = {
      code,
      type: payload.type,
      value: Number(payload.value),
      scopes: payload.scopes || {},
      startAt:
        typeof payload.startAt === "number" ? payload.startAt : undefined,
      endAt: typeof payload.endAt === "number" ? payload.endAt : undefined,
      minOrderTotal:
        typeof payload.minOrderTotal === "number"
          ? payload.minOrderTotal
          : undefined,
      usageLimit:
        typeof payload.usageLimit === "number" ? payload.usageLimit : undefined,
      usageCount: 0,
      active: typeof payload.active === "boolean" ? payload.active : true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const ref = await addDoc(collection(db, "coupons"), newCoupon);
    return NextResponse.json({ id: ref.id, ...newCoupon }, { status: 201 });
  } catch (err) {
    console.error("POST /api/coupons error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
