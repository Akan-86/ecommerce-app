export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-600">
        {/* Brand / About */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">MyStore</h3>
          <p className="text-gray-500">
            Your trusted online store for quality products at the best prices.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Categories</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-blue-600">
                Electronics
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Clothing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Home & Living
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Sports
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Support</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-blue-600">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Returns
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Shipping Info
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Stay Updated</h4>
          <p className="text-gray-500 mb-3">
            Subscribe to our newsletter for the latest deals.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 mt-8 py-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} MyStore. All rights reserved.
      </div>
    </footer>
  );
}
