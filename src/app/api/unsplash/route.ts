import { NextRequest, NextResponse } from "next/server";

const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";
const DEFAULT_PER_PAGE = 12;
const MAX_PER_PAGE = 30;

// Simple in-memory rate limit (per server instance)
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 60; // 60 requests/min
const hits: Map<string, { count: number; resetAt: number }> = new Map();

function rateLimit(key: string) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { ok: true };
}

function parseIntSafe(value: string | null, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export async function GET(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "local";

    const rl = rateLimit(ip);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").trim();
    const page = parseIntSafe(searchParams.get("page"), 1);
    const perPageRaw = parseIntSafe(
      searchParams.get("per_page"),
      DEFAULT_PER_PAGE
    );
    const perPage = Math.min(perPageRaw, MAX_PER_PAGE);

    if (!query) {
      return NextResponse.json(
        { error: "Missing query parameter `q`" },
        { status: 400 }
      );
    }

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      return NextResponse.json(
        { error: "Missing UNSPLASH_ACCESS_KEY environment variable" },
        { status: 500 }
      );
    }

    const url = new URL(UNSPLASH_API_URL);
    url.searchParams.set("query", query);
    url.searchParams.set("page", String(page));
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("orientation", "squarish");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
      cache: "no-store",
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Unsplash request failed", details: text },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Normalize response for frontend
    const results = (data?.results || []).map((item: any) => ({
      id: item.id,
      alt: item.alt_description || item.description || "Unsplash image",
      thumb: item.urls?.thumb,
      small: item.urls?.small,
      regular: item.urls?.regular,
      full: item.urls?.full,
      photographer: item.user?.name,
      profile: item.user?.links?.html,
      download: item.links?.download_location, // optional
    }));

    return NextResponse.json({
      total: data.total,
      total_pages: data.total_pages,
      page,
      per_page: perPage,
      results,
    });
  } catch (error: any) {
    console.error("Unsplash API error:", error);
    if (error?.name === "AbortError") {
      return NextResponse.json(
        { error: "Unsplash request timed out" },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error", message: error?.message },
      { status: 500 }
    );
  }
}
