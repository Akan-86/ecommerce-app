import Link from "next/link";
import Image from "next/image";

export default function CategoryGrid() {
  const categories = [
    {
      name: "Electronics",
      href: "/products?category=electronics",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    },
    {
      name: "Fashion",
      href: "/products?category=fashion",
      image: "https://images.unsplash.com/photo-1520975661595-6453be3f7070",
    },
    {
      name: "Home & Living",
      href: "/products?category=home",
      image: "https://images.unsplash.com/photo-1505693314120-0d443867891c",
    },
    {
      name: "Accessories",
      href: "/products?category=accessories",
      image: "https://images.unsplash.com/photo-1518544887877-6d6a3f9c3f3f",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="mb-10">
        <h2 className="text-2xl font-bold">Shop by Category</h2>
        <p className="text-sm text-gray-500">
          Browse our most popular categories
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group relative overflow-hidden rounded-2xl"
          >
            <div className="relative h-40 w-full">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
