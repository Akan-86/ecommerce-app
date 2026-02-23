export function Footer() {
  return (
    <footer className="mt-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-4">
          <h3 className="text-2xl font-black tracking-tight">
            <span>Vento</span>
            <span style={{ color: "var(--brand-primary)" }}>Shop</span>
          </h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Modern essentials crafted for everyday life. Designed with clarity,
            simplicity and premium quality in mind.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Shop</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li>
              <a href="#" className="hover:text-white transition">
                All Products
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                New Arrivals
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Best Sellers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Sale
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Support</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li>
              <a href="#" className="hover:text-white transition">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Returns
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Shipping
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white">Join Our Newsletter</h4>
          <p className="text-sm text-white/60">
            Get product updates and exclusive offers directly to your inbox.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded-l-xl bg-white/10 border border-white/10 text-sm focus:outline-none focus:ring-2"
              style={{ outlineColor: "var(--brand-primary)" }}
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-r-xl text-sm font-semibold btn-primary"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} VentoShop. Crafted with precision.
      </div>
    </footer>
  );
}
