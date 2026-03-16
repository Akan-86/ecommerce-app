import Link from "next/link";
import { Laptop, Shirt, Home, Watch } from "lucide-react";

export default function CategoryIcons() {
  const categories = [
    {
      name: "Electronics",
      icon: Laptop,
      href: "/products?category=electronics",
    },
    {
      name: "Fashion",
      icon: Shirt,
      href: "/products?category=fashion",
    },
    {
      name: "Home",
      icon: Home,
      href: "/products?category=home",
    },
    {
      name: "Accessories",
      icon: Watch,
      href: "/products?category=accessories",
    },
  ];

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;

          return (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border bg-white p-6 hover:shadow-md transition"
            >
              <Icon className="h-8 w-8 text-gray-700 group-hover:text-black" />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-black">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
