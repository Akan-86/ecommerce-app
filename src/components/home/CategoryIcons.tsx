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
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-neutral-900 dark:to-black" />

      <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {categories.map((cat) => {
          const Icon = cat.icon;

          return (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative flex flex-col items-center justify-center gap-4 rounded-3xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/10 group-hover:scale-110 transition">
                <Icon className="h-7 w-7 text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white" />
              </div>

              <span className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white">
                {cat.name}
              </span>

              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition pointer-events-none border border-black/10 dark:border-white/10" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
