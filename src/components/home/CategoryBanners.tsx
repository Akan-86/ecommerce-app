import Link from "next/link";
import Image from "next/image";

export default function CategoryBanners() {
  const banners = [
    {
      title: "Electronics",
      subtitle: "Latest tech and gadgets",
      href: "/products?category=electronics",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    },
    {
      title: "Fashion",
      subtitle: "Trending styles and outfits",
      href: "/products?category=fashion",
      image: "https://images.unsplash.com/photo-1521334884684-d80222895322",
    },
    {
      title: "Home & Living",
      subtitle: "Upgrade your living space",
      href: "/products?category=home",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="grid md:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <Link
            key={banner.title}
            href={banner.href}
            className="group relative overflow-hidden rounded-3xl"
          >
            <div className="relative h-56 w-full">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                sizes="(max-width:768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
              <h3 className="text-xl font-bold text-white">{banner.title}</h3>
              <p className="text-sm text-gray-200">{banner.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
