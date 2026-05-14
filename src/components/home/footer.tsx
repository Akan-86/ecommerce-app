import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden bg-black text-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-neutral-900/90 to-black" />
      {/* TOP TRUST BAR */}
      <div className="border-b border-white/10">
        <div className="container-modern py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-white/60 tracking-wide">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white/40" />
            <span>Free shipping over $75</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white/40" />
            <span>30‑day returns</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white/40" />
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white/40" />
            <span>Premium quality</span>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="container-modern grid grid-cols-1 gap-14 py-20 md:grid-cols-4">
        {/* Brand */}
        <div className="space-y-5">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-1">
            <span>Velora</span>
            <span className="text-white/80">Shop</span>
          </h3>

          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            Curated technology, minimalist fashion, and premium essentials
            designed for modern living.
          </p>

          {/* Social */}
          <div className="flex gap-4 text-white/60 text-sm">
            <a
              href="https://instagram.com"
              className="hover:text-white transition duration-300 hover:opacity-80"
            >
              Instagram
            </a>
            <a
              href="https://x.com"
              className="hover:text-white transition duration-300 hover:opacity-80"
            >
              Twitter
            </a>
            <a
              href="https://facebook.com"
              className="hover:text-white transition duration-300 hover:opacity-80"
            >
              Facebook
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-semibold mb-4 text-white tracking-wide">Shop</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li>
              <Link
                href="/products"
                className="transition duration-300 hover:text-white hover:opacity-80"
              >
                All Products
              </Link>
            </li>

            <li>
              <Link
                href="/products"
                className="transition duration-300 hover:text-white hover:opacity-80"
              >
                New Arrivals
              </Link>
            </li>

            <li>
              <Link
                href="/products"
                className="transition duration-300 hover:text-white hover:opacity-80"
              >
                Best Sellers
              </Link>
            </li>

            <li>
              <Link
                href="/products"
                className="transition duration-300 hover:text-white hover:opacity-80"
              >
                Featured Collection
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold mb-4 text-white tracking-wide">
            Support
          </h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li>
              <Link
                href="/help-center"
                className="transition duration-300 hover:text-white hover:opacity-80"
              >
                Help Center
              </Link>
            </li>

            <li>
              <Link
                href="/returns"
                className="transition duration-300 hover:text-white hover:opacity-80"
              >
                Returns
              </Link>
            </li>

            <li>
              <Link
                href="/shipping"
                className="transition duration-300 hover:text-white hover:opacity-80"
              >
                Shipping
              </Link>
            </li>

            <li>
              <Link
                href="/contact"
                className="transition duration-300 hover:text-white hover:opacity-80"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white tracking-wide">
            Join Our Newsletter
          </h4>

          <p className="text-sm text-white/60">
            Get product updates and exclusive offers directly to your inbox.
          </p>

          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded-l-full bg-white/10 border border-white/10 text-sm focus:outline-none focus:ring-2 backdrop-blur-xl"
              style={{ outlineColor: "var(--brand-primary)" }}
            />

            <button
              type="submit"
              className="px-5 py-3 rounded-r-full text-sm font-semibold btn-primary transition-all duration-300 hover:opacity-90"
            >
              Subscribe
            </button>
          </form>

          {/* Payment */}
          <div className="flex gap-3 pt-2 text-xs text-white/50">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10">
        <div className="container-modern flex flex-col items-center justify-between gap-6 py-6 text-xs tracking-wide text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} Velora. Crafted with precision.</p>

          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="transition duration-300 hover:text-white hover:opacity-80"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition duration-300 hover:text-white hover:opacity-80"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="transition duration-300 hover:text-white hover:opacity-80"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
