import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-neutral-900/90 to-black" />
      {/* TOP TRUST BAR */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-white/60 tracking-wide">
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
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-5">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-1">
            <span>Vento</span>
            <span className="text-white/80">Shop</span>
          </h3>

          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            Modern essentials crafted for everyday life. Designed with clarity,
            simplicity and premium quality in mind.
          </p>

          {/* Social */}
          <div className="flex gap-4 text-white/60 text-sm">
            <a
              href="#"
              className="hover:text-white transition duration-300 hover:opacity-80"
            >
              Instagram
            </a>
            <a
              href="#"
              className="hover:text-white transition duration-300 hover:opacity-80"
            >
              Twitter
            </a>
            <a
              href="#"
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
                className="hover:text-white transition duration-300 hover:opacity-80"
              >
                All Products
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white transition duration-300 hover:opacity-80"
              >
                New Arrivals
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white transition duration-300 hover:opacity-80"
              >
                Best Sellers
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white transition duration-300 hover:opacity-80"
              >
                Sale
              </a>
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
              <a
                href="#"
                className="hover:text-white transition duration-300 hover:opacity-80"
              >
                Help Center
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white transition duration-300 hover:opacity-80"
              >
                Returns
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white transition duration-300 hover:opacity-80"
              >
                Shipping
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white transition duration-300 hover:opacity-80"
              >
                Contact
              </a>
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
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-xs text-white/50 gap-6 tracking-wide">
          <p>© {new Date().getFullYear()} VentoShop. Crafted with precision.</p>

          <div className="flex gap-6">
            <Link
              href="#"
              className="hover:text-white transition duration-300 hover:opacity-80"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="hover:text-white transition duration-300 hover:opacity-80"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="hover:text-white transition duration-300 hover:opacity-80"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
