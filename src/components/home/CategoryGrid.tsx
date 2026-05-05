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
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mb-10">
        <h2 className="text-3xl font-semibold text-neutral-900 dark:text-white">
          Shop by category
        </h2>
        <p className="text-neutral-500 mt-2">Explore curated collections</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group relative overflow-hidden rounded-3xl"
          >
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-4">
              <span className="text-white font-medium text-sm">{cat.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
