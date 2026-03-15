import Link from "next/link";

const categories = [
  {
    name: "Shoes",
    slug: "shoes",
    description: "Running, casual and sports shoes.",
  },
  {
    name: "Clothing",
    slug: "clothing",
    description: "Hoodies, t‑shirts and everyday wear.",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Caps, bags and small essentials.",
  },
  {
    name: "Electronics",
    slug: "electronics",
    description: "Tech gadgets and devices.",
  },
];

export default function CategoriesPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-10">Shop by Category</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className="group border rounded-xl p-6 hover:shadow-md transition bg-white"
          >
            <h2 className="text-lg font-medium mb-2 group-hover:underline">
              {category.name}
            </h2>
            <p className="text-sm text-gray-600">{category.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
