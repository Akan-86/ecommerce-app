import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="sticky top-24 w-full md:w-64 bg-white border border-gray-200 rounded-2xl p-6 space-y-10 shadow-md">
      {/* Sidebar Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        <p className="text-xs text-gray-500 mt-1">Refine your results</p>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
          Categories
        </h3>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex justify-between items-center">
            <Link href="#" className="hover:text-black transition">
              All Products
            </Link>
            <span className="text-xs text-gray-400">(120)</span>
          </li>
          <li className="flex justify-between items-center">
            <Link href="#" className="hover:text-black transition">
              Electronics
            </Link>
            <span className="text-xs text-gray-400">(42)</span>
          </li>
          <li className="flex justify-between items-center">
            <Link href="#" className="hover:text-black transition">
              Fashion
            </Link>
            <span className="text-xs text-gray-400">(36)</span>
          </li>
          <li className="flex justify-between items-center">
            <Link href="#" className="hover:text-black transition">
              Home & Living
            </Link>
            <span className="text-xs text-gray-400">(22)</span>
          </li>
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
          Price (€)
        </h3>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-center gap-3">
            <input type="radio" name="price" />
            <span>€0 – €50</span>
          </li>
          <li className="flex items-center gap-3">
            <input type="radio" name="price" />
            <span>€50 – €150</span>
          </li>
          <li className="flex items-center gap-3">
            <input type="radio" name="price" />
            <span>€150 – €300</span>
          </li>
          <li className="flex items-center gap-3">
            <input type="radio" name="price" />
            <span>€300+</span>
          </li>
        </ul>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
          Rating
        </h3>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-center gap-3">
            <input type="checkbox" />
            <span>⭐ 4 & above</span>
          </li>
          <li className="flex items-center gap-3">
            <input type="checkbox" />
            <span>⭐ 3 & above</span>
          </li>
        </ul>
      </div>

      {/* Reset */}
      <div className="pt-4 border-t">
        <button className="w-full text-sm font-medium text-gray-600 hover:text-black transition">
          Reset filters
        </button>
      </div>
    </aside>
  );
}
